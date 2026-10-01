"""Build layered Luffy SVGs with the construction pipeline (see ../SKILL.md).
Usage: python build.py <out_dir> [g1 g2 g3 g4 g5]  -> luffy-<gear>-color.svg / -bw.svg

Pipeline, one function per stage, all derived from SKEL / HEAD constants:
 1 gesture  2 skeleton+pivots  3 forms  4 head-unit ruler   (hidden <g id="construct-*" display="none">)
 5 features on guides  6 tapered ink  7 flats  8 cel shade (auto, light from upper-left)  9 highlights  10 effects
Char RIGHT = viewer LEFT. Parts are drawn for viewer-left and mirrored in DATA (mx), never with transforms,
so every rig group has real global pivots (data-pivot + transform-origin) for GSAP."""
import sys, math, random, re, itertools

INK = "#1B1B1B"
_ids = itertools.count()

COLOR = dict(skin="#FFD3A8", skinS="#E9A57A", hair=INK, red="#D3272E", redS="#9C1A22",
             hat="#ECC873", hatS="#C99E50", hatH="#F8E3A6", band="#D3272E", bandS="#9C1A22", blue="#4566B8",
             blueS="#2E4791", blueH="#6E8ED6", sash="#F6D232", sashS="#D4A91A", sashH="#FFF08A", cuff="#FFFFFF",
             cuffS="#C9D0DE", scar="#EBA295", scarS="#D27F74", gold="#F3D35A", mouth="#6E1517", tongue="#E46F78",
             teeth="#FFFFFF", eye="#FFFFFF", sole="#B88A4E", soleS="#8E6532", strap=INK, iris=INK,
             haki=INK, hakiS="#000000", ring="#D3272E", hairS=INK, steam="#FFFFFF", steamS="#E7DCE6", flame="#C8141E", glint="#F06A7E")
BW = {k: "#FFFFFF" for k in COLOR}
BW.update(glint="#FFFFFF", hairS=INK, hair=INK, strap=INK, iris=INK, mouth=INK, band=INK, bandS=INK, haki=INK, hakiS="#000000", ring=INK,
          skinS="url(#tone)", redS="url(#hatch)", hatS="url(#hatch)", blue="url(#tone)", blueS="url(#hatch)",
          sashS="url(#hatch)", cuffS="url(#tone)", scarS="url(#tone)", soleS="url(#hatch)",
          hatH="none", blueH="none", sashH="none")

# ---------------- 2. skeleton (global coords, viewBox 0 0 600 800, soles y=760) ----------------
SKEL = dict(head=(300, 150), neck=(300, 226), chest=(300, 300), pelvis=(300, 440),
            shoulder_r=(240, 250), elbow_r=(220, 362), wrist_r=(187, 512), fist_r=(184, 534),
            hip_r=(272, 452), knee_r=(268, 610), ankle_r=(272, 738), toe_r=(270, 756))
for _k, (_x, _y) in list(SKEL.items()):
    if _k.endswith("_r"): SKEL[_k[:-2] + "_l"] = (600 - _x, _y)
BONES = [("head", "neck"), ("neck", "chest"), ("chest", "pelvis")] + [
    (a if a in ("neck", "pelvis") else a + s, b + s) for s in ("_r", "_l") for a, b in
    (("neck", "shoulder"), ("shoulder", "elbow"), ("elbow", "wrist"), ("wrist", "fist"),
     ("pelvis", "hip"), ("hip", "knee"), ("knee", "ankle"), ("ankle", "toe"))]

# head frame (drawn at native size, placed by HEAD_T): cranium circle + jaw wedge; features hang off these guides
HEAD = dict(cx=300, cy=118, r=56, chin=201)
EYE_Y, EYE_DX, NOSE_Y, MOUTH_Y = 148, 27, 163, 178        # eye-line, eye spacing, nose, mouth on the centre line
HEAD_S = 0.67                                              # head-units: crown..sole ~6.8 heads (post-skip 6.5-7)
HEAD_Y = 225                                               # chin lands on the neck at y~222
HEAD_T = f"translate(300 {HEAD_Y}) scale({HEAD_S}) translate(-300 -212)"
SHOULDER_W = 1.1                                           # torso x-scale; arms shift out by ARM_DX
ARM_DX = 9


def hp(x, y):  # head-frame -> global
    return 300 + (x - 300) * HEAD_S, HEAD_Y + (y - 212) * HEAD_S


# ---------------- helpers ----------------
def mx(d):
    """Mirror path data across x=300 (absolute M/L/Q/C/Z coords only: every first number of a pair is x)."""
    out, nums = [], 0
    for t in re.findall(r"[A-Za-z]|-?\d+\.?\d*", d):
        if t.isalpha(): out.append(t); continue
        out.append(f"{600 - float(t):g}" if nums % 2 == 0 else t); nums += 1
    return " ".join(out)


def sample(d, step=6.0):
    """Flatten absolute M/L/Q/C/Z path data into closed point loops."""
    toks = re.findall(r"[MLQCZ]|-?\d+\.?\d*", d); i = 0; loops, pts, cur = [], [], (0, 0)
    num = lambda: float(toks[i])
    while i < len(toks):
        c = toks[i]; i += 1
        if c == "M":
            if len(pts) > 2: loops.append(pts)
            cur = (float(toks[i]), float(toks[i + 1])); pts = [cur]; i += 2
        elif c == "Z":
            if len(pts) > 2: loops.append(pts)
            pts = []
        else:
            n = {"L": 1, "Q": 2, "C": 3}[c]; ctrl = [(float(toks[i + 2 * j]), float(toks[i + 2 * j + 1])) for j in range(n)]; i += 2 * n
            P = [cur] + ctrl; L = sum(math.hypot(P[j + 1][0] - P[j][0], P[j + 1][1] - P[j][1]) for j in range(n))
            k = max(1, int(L / step))
            for j in range(1, k + 1):
                t = j / k; Q = P
                while len(Q) > 1: Q = [(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t) for a, b in zip(Q, Q[1:])]
                pts.append(Q[0])
            cur = ctrl[-1]
    if len(pts) > 2: loops.append(pts)
    return loops


def ink(d, w=3.8, wmin=0.6, step=6.0):
    """6 ink: variable-width filled outline. Thick on the shadow side (lower-right), hairline on the lit side."""
    out = []
    for P in sample(d, step):
        n = len(P); cx = sum(p[0] for p in P) / n; cy = sum(p[1] for p in P) / n; N = []
        for j in range(n):
            (ax, ay), (bx, by) = P[j - 1], P[(j + 1) % n]; tx, ty = bx - ax, by - ay; l = math.hypot(tx, ty) or 1
            N.append((ty / l, -tx / l))
        if sum((P[j][0] - cx) * N[j][0] + (P[j][1] - cy) * N[j][1] for j in range(n)) < 0: N = [(-a, -b) for a, b in N]
        o, q = [], []
        for (x, y), (nx, ny) in zip(P, N):
            f = max(0.0, nx * 0.55 + ny * 0.83); ww = (wmin + (w - wmin) * f ** 0.8) / 2
            o.append(f"{x + nx * ww:.1f},{y + ny * ww:.1f}"); q.append(f"{x - nx * ww:.1f},{y - ny * ww:.1f}")
        out.append("M" + " ".join(o) + "Z M" + " ".join(q[::-1]) + "Z")
    return f'<path fill="{INK}" fill-rule="evenodd" d="{" ".join(out)}"/>'


def cel(d, base, shade=None, k=7, w=3.8, extra="", step=6.0):
    """7 flat + 8 cel shadow (shape minus itself shifted toward the upper-left light) + 6 ink ring."""
    if not shade:
        return f'<path fill="{base}" d="{d}"{extra}/>' + ink(d, w, step=step)
    n = next(_ids)
    return (f'<clipPath id="c{n}"><path d="{d}"/></clipPath><path fill="{shade}" d="{d}"{extra}/>'
            f'<g clip-path="url(#c{n})"><path fill="{base}" d="{d}" transform="translate({-k} {-k})"/></g>' + ink(d, w, step=step))


def taper(d, w=1.6, fill=INK):
    """6 ink: turn 'M p (L p | Q c p)*' centre-lines into filled brush strokes, thick middle, pointed ends."""
    toks = re.findall(r"[MLQ]|-?\d+\.?\d*", d); i = 0; cur = None; segs = []
    while i < len(toks):
        c = toks[i]; i += 1
        if c == "M": cur = (float(toks[i]), float(toks[i + 1])); i += 2
        elif c == "L":
            p = (float(toks[i]), float(toks[i + 1])); segs.append((cur, ((cur[0] + p[0]) / 2, (cur[1] + p[1]) / 2), p)); cur = p; i += 2
        elif c == "Q":
            q, p = (float(toks[i]), float(toks[i + 1])), (float(toks[i + 2]), float(toks[i + 3])); segs.append((cur, q, p)); cur = p; i += 4
    out = []
    for a, q, b in segs:
        L, R = [], []
        for j in range(13):
            t = j / 12; u = 1 - t
            x = u * u * a[0] + 2 * u * t * q[0] + t * t * b[0]; y = u * u * a[1] + 2 * u * t * q[1] + t * t * b[1]
            tx = 2 * u * (q[0] - a[0]) + 2 * t * (b[0] - q[0]); ty = 2 * u * (q[1] - a[1]) + 2 * t * (b[1] - q[1])
            n = math.hypot(tx, ty) or 1; ww = w / 2 * (0.15 + 0.85 * math.sin(math.pi * t) ** 0.8)
            L.append(f"{x - ty / n * ww:.1f},{y + tx / n * ww:.1f}"); R.append(f"{x + ty / n * ww:.1f},{y - tx / n * ww:.1f}")
        out.append("M" + " L".join(L + R[::-1]) + "Z")
    return f'<path fill="{fill}" d="{" ".join(out)}"/>'


def jag(x1, y1, x2, y2, w, n=9, seed=1):
    r = random.Random(seed); dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L
    top, bot = [], []
    for i in range(n + 1):
        t = i / n; ww = w * math.sin(math.pi * t) ** 0.6; px, py = x1 + dx * t, y1 + dy * t
        top.append(f"{px + nx * ww * (.7 + .5 * r.random()):.1f},{py + ny * ww * (.7 + .5 * r.random()):.1f}")
        bot.append(f"{px - nx * ww * (.7 + .5 * r.random()):.1f},{py - ny * ww * (.7 + .5 * r.random()):.1f}")
    return "M" + " L".join(top + bot[::-1]) + "Z"


def fray(cx, cy, rx, ry, droop=16, n=110):
    r = random.Random(5); pts = []
    for i in range(n):
        a = 2 * math.pi * i / n; k = 1 + (0.025 if i % 2 else -0.01) + 0.012 * r.random()
        pts.append(f"{cx + rx * k * math.cos(a):.1f},{cy + ry * k * math.sin(a) + droop * math.cos(a) ** 2:.1f}")
    return "M" + " L".join(pts) + "Z"


def straw(cx, cy, rx, ry, n=70, l=10):
    out = []
    for i in range(n):
        a = 2 * math.pi * i / n; c, s = math.cos(a), math.sin(a); k = 0.62 + 0.08 * ((i * 7) % 3)
        out.append(f"M{cx + rx * k * c:.1f},{cy + ry * k * s + 16 * c * c * k:.1f} L{cx + rx * (k + l / rx) * c:.1f},{cy + ry * (k + l / rx) * s + 16 * c * c * k:.1f}")
    return " ".join(out)


def g(id_, inner, pivot=None, extra=""):
    p = f' data-pivot="{pivot[0]:g},{pivot[1]:g}" style="transform-origin:{pivot[0]:g}px {pivot[1]:g}px"' if pivot else ""
    return f'<g id="{id_}"{p}{extra}>{inner}</g>'


# ---------------- 1-4. construction layers (hidden) ----------------
def tube(a, b, r):
    (x1, y1), (x2, y2) = SKEL[a], SKEL[b]; L = math.hypot(x2 - x1, y2 - y1); nx, ny = -(y2 - y1) / L * r, (x2 - x1) / L * r
    return f'<path d="M{x1 + nx:.0f},{y1 + ny:.0f} L{x2 + nx:.0f},{y2 + ny:.0f} L{x2 - nx:.0f},{y2 - ny:.0f} L{x1 - nx:.0f},{y1 - ny:.0f}Z"/>'


def construct():
    S = SKEL; P = lambda k: f"{S[k][0]},{S[k][1]}"
    gesture = f'<path d="M{P("head")} Q300 330 {P("pelvis")} Q286 600 {P("ankle_r")}" fill="none" stroke="#e33" stroke-width="3"/>'
    skel = "".join(f'<line x1="{S[a][0]}" y1="{S[a][1]}" x2="{S[b][0]}" y2="{S[b][1]}"/>' for a, b in BONES)
    piv = "".join(f'<circle cx="{x}" cy="{y}" r="4"><title>{k}</title></circle>' for k, (x, y) in S.items())
    limbs = "".join(tube(a + s, b + s, r) for s in ("_r", "_l") for a, b, r in
                    (("shoulder", "elbow", 11), ("elbow", "wrist", 10), ("hip", "knee", 17), ("knee", "ankle", 13)))
    H = HEAD
    head = (f'<circle cx="{H["cx"]}" cy="{H["cy"]}" r="{H["r"]}"/><path d="M{H["cx"] - H["r"]},{H["cy"] + 10} L{H["cx"]},{H["chin"]} L{H["cx"] + H["r"]},{H["cy"] + 10}"/>'
            f'<line x1="300" y1="{H["cy"] - H["r"]}" x2="300" y2="{H["chin"]}"/><line x1="240" y1="{EYE_Y}" x2="360" y2="{EYE_Y}"/>'
            f'<line x1="285" y1="{NOSE_Y}" x2="315" y2="{NOSE_Y}"/><line x1="270" y1="{MOUTH_Y}" x2="330" y2="{MOUTH_Y}"/>'
            f'<ellipse cx="300" cy="86" rx="122" ry="32"/>')  # brim plane follows the head's tilt
    forms = (f'<g transform="{HEAD_T}">{head}</g><ellipse cx="300" cy="300" rx="62" ry="72"/>'
             f'<rect x="256" y="420" width="88" height="52" rx="8"/>{limbs}')
    crown = hp(300, HEAD["cy"] - HEAD["r"])[1]; unit = (HEAD["chin"] - (HEAD["cy"] - HEAD["r"])) * HEAD_S
    ruler = "".join(f'<line x1="120" y1="{crown + unit * i:.0f}" x2="480" y2="{crown + unit * i:.0f}"/><text x="100" y="{crown + unit * i + 4:.0f}" font-size="12">{i}</text>' for i in range(7))
    st = 'fill="none" stroke="{}" stroke-width="1.5"'
    return (f'<g id="construct-gesture" display="none">{gesture}</g>'
            f'<g id="construct-skeleton" display="none" {st.format("#2a7")}>{skel}<g fill="#2a7">{piv}</g></g>'
            f'<g id="construct-forms" display="none" {st.format("#36c")}>{forms}</g>'
            f'<g id="construct-proportions" display="none" {st.format("#999")}>{ruler}</g>')


# ---------------- 5-9. parts ----------------
HAIR_D = "M236 90 Q226 110 218 128 Q232 124 238 120 Q232 146 226 172 Q244 150 250 134 Q252 144 254 156 Q258 136 262 122 Q266 132 268 146 Q272 128 276 116 Q281 128 284 140 Q288 126 291 116 Q296 134 297 154 Q300 132 305 116 Q309 128 314 140 Q318 126 322 116 Q326 130 332 146 Q334 132 338 122 Q343 136 348 156 Q350 144 352 134 Q358 150 374 172 Q368 146 362 120 Q370 124 382 128 Q374 110 364 90 Z"


def celh(*a, **k):
    return cel(*a, w=5.0, **k)


def head_stack(p, v):
    ex1, ex2 = 300 - EYE_DX, 300 + EYE_DX
    ear = "M249 128 C234 120 228 146 236 158 C240 166 248 166 252 160 Z"
    face = "M244 112 C242 150 258 182 278 194 C288 200 294 201 300 201 C306 201 312 200 322 194 C342 182 358 150 356 112 C354 82 332 62 300 62 C268 62 246 82 244 112 Z"
    hair_back = g("hair-back", v["hair_back_fn"](p) if "hair_back_fn" in v else celh(v.get("hair_back", "M248 100 L234 152 L248 146 L250 162 L350 162 L352 146 L366 152 L352 100 Z"), p["hair"]))
    ears = g("ears", celh(ear, p["skin"], p["skinS"], 4) + taper("M245 136 Q236 144 245 155", 1.8) +
             celh(mx(ear), p["skin"], p["skinS"], 4) + taper(mx("M245 136 Q236 144 245 155"), 1.8))
    head = g("head", ears + celh(face, p["skin"], p["skinS"], 6))
    if v.get("eyes") == "g5":  # cartoon pop: red rings
        eyes = "".join(f'<circle fill="{p["eye"]}" class="o" style="stroke-width:2.2" cx="{x}" cy="{EYE_Y}" r="14"/>'
                       f'<circle fill="none" stroke="{p["ring"]}" stroke-width="3" cx="{x}" cy="{EYE_Y}" r="8.5"/><circle fill="{p["iris"]}" cx="{x}" cy="{EYE_Y}" r="4"/>' for x in (ex1, ex2))
    else:
        eyes = "".join(f'<ellipse fill="{p["eye"]}" class="o" style="stroke-width:2" cx="{x}" cy="{EYE_Y}" rx="14.5" ry="16.5"/>'
                       f'<circle fill="{p["iris"]}" cx="{x}" cy="{EYE_Y + 1}" r="3.7"/>' for x in (ex1, ex2))
        eyes += taper(f"M{ex1 - 13} {EYE_Y - 5} Q{ex1} {EYE_Y - 22} {ex1 + 13} {EYE_Y - 5}", 2.6)
        eyes += taper(f"M{ex2 + 13} {EYE_Y - 5} Q{ex2} {EYE_Y - 22} {ex2 - 13} {EYE_Y - 5}", 2.6)
    closed = taper(f"M{ex1 - 13} {EYE_Y + 3} Q{ex1} {EYE_Y - 12} {ex1 + 13} {EYE_Y + 3} M{ex2 - 13} {EYE_Y + 3} Q{ex2} {EYE_Y - 12} {ex2 + 13} {EYE_Y + 3}", 3.6)
    eyes = g("eyes-open", eyes) + g("eyes-closed", closed, extra=' style="display:none"')
    if v.get("brows"):
        eyes += taper(f"M{ex1 - 12} {EYE_Y - 22} L{ex1 + 12} {EYE_Y - 16}", 5) + taper(f"M{ex2 + 12} {EYE_Y - 22} L{ex2 - 12} {EYE_Y - 16}", 5)
    eyes += taper(f"M298 {NOSE_Y - 1} Q302 {NOSE_Y + 5} 307 {NOSE_Y + 2}", 2.2)
    scar = g("scar", taper(f"M{ex2 - 9} {EYE_Y + 19} Q{ex2 + 3} {EYE_Y + 24} {ex2 + 16} {EYE_Y + 17}", 2.4) +
             taper(f"M{ex2 - 5} {EYE_Y + 16} L{ex2 - 3} {EYE_Y + 25} M{ex2 + 2} {EYE_Y + 18} L{ex2 + 4} {EYE_Y + 27} M{ex2 + 10} {EYE_Y + 16} L{ex2 + 11} {EYE_Y + 24}", 1.6))
    m = MOUTH_Y
    grin = (celh(f"M264 {m - 8} Q300 {m - 1} 336 {m - 8} Q332 {m + 18} 300 {m + 20} Q268 {m + 18} 264 {m - 8} Z", p["mouth"]) +
            f'<path fill="{p["teeth"]}" d="M266 {m - 6.5} Q300 {m} 334 {m - 6.5} L332 {m + 1} Q300 {m + 6} 268 {m + 1} Z"/>'
            f'<path fill="{p["tongue"]}" d="M280 {m + 15} Q300 {m + 7} 320 {m + 15} Q300 {m + 20} 280 {m + 15} Z"/>' + taper(f"M267 {m + 1} Q300 {m + 6} 333 {m + 1}", 1.4))
    smile = taper(f"M268 {m - 3} Q300 {m + 13} 334 {m - 5}", 3.2) + taper(f"M265 {m - 6} L271 {m}", 1.8) + taper(f"M331 {m - 2} L337 {m - 8}", 1.8)
    teeth = (celh(f"M260 {m - 11} Q300 {m - 4} 340 {m - 11} Q338 {m + 17} 300 {m + 21} Q262 {m + 17} 260 {m - 11} Z", p["teeth"], None) +
             taper(f"M262 {m + 4} Q300 {m + 11} 338 {m + 4}", 1.6) + taper(" ".join(f"M{x} {m - 7 + abs(x - 300) * .1} L{x} {m + 17 - abs(x - 300) * .12}" for x in (274, 287, 300, 313, 326)), 1.2))
    shout = (celh(f"M276 {m - 8} Q300 {m - 14} 324 {m - 8} Q330 {m + 12} 300 {m + 26} Q270 {m + 12} 276 {m - 8} Z", p["mouth"]) +
             f'<path fill="{p["teeth"]}" d="M280 {m - 7} Q300 {m - 11} 320 {m - 7} L318 {m - 2} Q300 {m - 5} 282 {m - 2} Z"/>'
             f'<path fill="{p["tongue"]}" d="M286 {m + 18} Q300 {m + 10} 314 {m + 18} Q300 {m + 24} 286 {m + 18} Z"/>')
    frames = dict(smile=smile, grin=teeth, laugh=grin, shout=shout)
    show = v.get("mouth", "smile")
    mouth = g("face-mouth", "".join(g("mouth-" + k, d, extra="" if k == show else ' style="display:none"') for k, d in frames.items()))
    side = "M238 100 Q220 128 222 172 L230 162 L234 178 L242 160 Q254 138 254 108 Z"
    cap = celh("M242 118 C236 62 268 40 300 40 C332 40 364 62 358 118 Z", p["hair"]) if v.get("hat_t") else ""  # hat knocked off -> no bald crown
    hair = g("hair", v["hair"](p) if "hair" in v else cap + celh(side, p["hair"]) + celh(mx(side), p["hair"]) + celh(HAIR_D, p["hair"]) +
             taper("M226 170 Q220 182 210 188 M374 170 Q380 182 390 188 M224 128 Q212 126 204 132 M376 128 Q388 126 396 132", 2.6))
    hat = g("hat", '<g transform="translate(0 7) rotate(3 300 86)">' + celh(fray(300, 86, 124, 36), p["hat"], p["hatS"], 8) + f'<path class="t" d="{straw(300, 86, 124, 36)}"/>' +
            celh("M230 84 C224 24 260 0 300 0 C340 0 376 24 370 84 Q300 106 230 84 Z", p["hat"], p["hatS"], 12) +
            f'<path fill="{p["hatH"]}" d="M248 36 Q260 12 290 7 Q266 20 256 50 Z"/>' +
            '<path class="t" d="M258 26 L262 35 M282 16 L283 25 M312 16 L311 25 M338 24 L334 33 M244 44 L250 50 M356 44 L350 50 M270 44 L272 52 M328 44 L326 52"/>' +
            celh("M231 58 Q300 74 369 58 L370 84 Q300 106 230 84 Z", p["band"], p["bandS"], 6) + "</g>" +
            (taper("M380 40 L440 20 M384 70 L452 62 M376 100 L430 110", 3) if v.get("hat_t") else ""), (300, 86), T(v.get("hat_t")))
    brows = ""
    if v.get("expr") == "angry":
        brows = g("brows", taper(f"M{ex1 - 16} {EYE_Y - 20} Q{ex1} {EYE_Y - 18} {ex1 + 14} {EYE_Y - 9} M{ex2 + 16} {EYE_Y - 20} Q{ex2} {EYE_Y - 18} {ex2 - 14} {EYE_Y - 9}", 7) +
                  taper(f"M{ex1 - 14} {EYE_Y - 8} L{ex1 + 14} {EYE_Y - 3} M{ex2 + 14} {EYE_Y - 8} L{ex2 - 14} {EYE_Y - 3}", 4.5))
    parts = [hair_back, head, g("face-eyes", eyes), scar, mouth, hair, brows] + ([] if v.get("no_hat") else [hat])
    # transform attr + CSS transform-origin on one <g> shifts the attr transform -> keep the pivot on an outer group
    return g("head-stack", g("head-frame", "".join(parts), extra=f' transform="{HEAD_T}"'), SKEL["neck"],
             f'{T(v.get("head_t"))}')


def arm(side, p, v):
    S = SKEL; f = (lambda d: d) if side == "r" else mx; a = "arm-" + side
    sk, ss = (p["haki"], p["hakiS"]) if v.get("haki") else (p["skin"], p["skinS"])
    fore = cel(f("M206 356 Q192 430 180 510 L200 515 Q218 430 234 356 Z"), sk, ss, 5)
    fist = (cel(f("M172 514 Q165 533 170 546 Q174 554 180 552 Q184 558 190 554 Q195 558 199 551 Q206 534 200 517 Q186 509 172 514 Z"), sk, ss, 5) +
            taper(f("M174 534 L177 548 M181 540 L183 553 M189 541 L190 554"), 1.4) +
            cel(f("M188 514 Q177 520 179 533 Q187 541 198 535 Q203 525 197 516 Z"), sk, ss, 2, 2.2) + taper(f("M184 528 Q190 531 196 528"), 1.2))
    if v.get("giant_fist") and side == "r":
        # four DISTINCT finger rolls (amplitude ~7 local, x6.8 scale) + a thumb pad: reads as a fist, not a log
        fist = (cel("M174 512 Q166 530 168 546 Q166 560 174 560 Q178 566 183 560 Q187 567 192 560 Q197 566 201 558 Q208 548 206 530 Q204 516 200 512 Z", sk, ss, 1.6) +
                cel("M170 528 Q170 540 180 541 Q192 541 194 534 Q190 528 182 527 Z", sk, ss, 0.8, 1.2) +
                taper("M168 546 Q187 550 206 545 M176 548 Q175 554 176 560 M183 549 L183 561 M191 548 Q192 554 192 560 M198 520 Q201 526 200 532", 0.6))
    upper = (cel(f("M254 230 C228 226 214 252 213 290 L206 366 Q222 372 238 366 L242 290 C244 266 252 248 254 230 Z"), p["red"], p["redS"], 8) +
             taper(f("M222 300 Q222 330 218 356"), 1.6))
    bell = (cel(f("M205 350 Q194 406 166 456 Q178 468 188 456 Q198 470 208 458 Q218 472 228 458 Q238 468 246 452 Q234 410 239 350 Z"), p["red"], p["redS"], 8) +
            taper(f("M196 420 L182 456 M214 412 L208 458 M228 420 L230 452 M216 372 Q214 392 210 404"), 1.6))
    cap = ""
    if v.get("no_sleeves"):  # bare upper arm (G4)
        upper, cap, bell = cel(f("M248 236 C228 238 214 256 212 290 L204 372 Q220 380 236 372 L238 300 C242 270 250 254 248 236 Z"), sk, ss, 6), "", ""
    if v.get("haki"):  # Boundman: bulging bicep/forearm masses (inflated muscle, not tubes)
        upper = cel(f("M250 234 C222 222 194 244 194 288 C194 324 210 346 202 374 Q220 388 240 374 C244 340 254 300 250 234 Z"), sk, ss, 6)
        fore = cel(f("M204 352 C174 398 164 462 176 510 L206 518 C226 470 244 410 238 352 Z"), sk, ss, 6)
    if v.get("haki"):  # Boundman: red flame streaks on the black haki
        upper += taper(f("M232 262 Q220 300 226 330 M222 300 Q212 340 216 380"), 4, p["flame"])
        fore += taper(f("M210 452 Q198 480 196 506"), 4, p["flame"])
        cap = cel(f("M246 230 C214 222 196 246 200 274 C204 298 236 300 248 282 Z"), sk, ss, 6) + taper(f("M214 240 Q206 254 212 270"), 5, p["glint"])
        upper += taper(f("M206 300 Q200 340 204 380"), 5, p["glint"])
    fx = v.get(a, {}); dx = -ARM_DX if side == "r" else ARM_DX; sh = S["shoulder_" + side]
    fist_g = g(a + "-fist", fist, S["wrist_" + side], T(fx.get("fist")))
    fore_g = g(a + "-forearm", fore + fist_g + bell, S["elbow_" + side], T(fx.get("forearm")))
    inner = g(a + "-upper", fore_g + upper, sh, T(fx.get("upper"))) + g(a + "-shoulder", cap, sh)
    # pivots inside are local (pre-shift); the outer pivot is global
    return g(a, f'<g transform="translate({dx} 0)">{inner}</g>', (sh[0] + dx, sh[1]), T(fx.get("all")) + '')


def leg(side, p, v):
    S = SKEL; f = (lambda d: d) if side == "r" else mx; L = "leg-" + side; fx = v.get(L, {})
    lk, lks = (p["haki"], p["hakiS"]) if v.get("haki") else (p["skin"], p["skinS"])
    sandal = g("sandal-" + side, cel(f("M260 730 Q250 742 248 752 Q270 758 292 752 Q290 740 284 730 Z"), lk, lks, 3, 2.4) +
               cel(f("M244 752 Q270 760 296 752 L296 760 Q270 768 244 760 Z"), p["sole"], p["soleS"], 3, 2.4) +
               f'<path fill="none" stroke="{p["strap"]}" stroke-width="4" stroke-linecap="round" d="{f("M254 744 Q266 736 272 750 Q278 736 290 744")}"/>',
               S["ankle_" + side], T(fx.get("foot")))
    shin = g(L + "-shin", cel(f("M252 598 Q248 664 258 702 L262 738 L282 738 L284 702 Q292 664 288 598 Z"), lk, lks, 5) + sandal,
             S["knee_" + side], T(fx.get("shin")))
    cuff = "M 222 612 Q 231 603 240 612 Q 249 603 258 612 Q 267 603 276 612 Q 285 603 298 614 L 299 632 Q 290 641 280 632 Q 270 641 260 632 Q 250 641 240 632 Q 230 641 222 632 Q 215 622 222 612 Z"
    thigh = (cel(f("M 236 438 L 302 444 L 300 500 L 298 618 Q 260 624 222 616 Q 228 520 236 438 Z"), p["blue"], p["blueS"], 9) +
             f'<path fill="{p["blueH"]}" d="{f("M236 470 Q238 530 230 590 L238 590 Q246 530 246 470 Z")}"/>' +
             taper(f("M262 480 Q266 530 262 570 M252 510 L256 550 M288 520 Q292 560 290 596"), 1.8) + cel(f(cuff), p["cuff"], p["cuffS"], 5))
    return g(L + "-thigh", shin + thigh, S["hip_" + side], T(fx.get("thigh")))


def body(p, v):
    torso = g("torso", cel(v.get("torso", "M288 214 C270 222 248 230 236 246 L246 440 L354 440 L364 246 C352 230 330 222 312 214 Z"), p["skin"], p["skinS"], 9) +
              taper("M262 236 Q280 244 294 236 M306 236 Q320 244 338 236 M266 300 Q284 312 298 304 M302 304 Q316 312 334 300 M300 304 L300 400 "
                    "M282 330 Q291 335 298 332 M302 332 Q309 335 318 330 M284 356 Q291 360 298 358 M302 358 Q309 360 316 356 M286 380 Q292 384 298 382 M302 382 Q308 384 314 380", 1.8))
    xs = g("x-scar", cel(jag(262, 246, 338, 330, 9, seed=3), p["scar"], p["scarS"], 3, 1.8) +
           cel(jag(338, 246, 262, 330, 9, seed=7), p["scar"], p["scarS"], 3, 1.8))
    shorts = g("shorts", cel("M240 434 Q300 446 360 434 L364 496 Q300 508 236 496 Z", p["blue"], p["blueS"], 8) + taper("M300 448 L300 496", 1.8))
    sash = g("sash", cel("M244 410 Q300 420 356 408 L358 444 Q300 454 242 444 Z", p["sash"], p["sashS"], 6) +
             taper("M250 424 Q300 434 352 422 M256 436 Q300 444 340 436", 1.6))
    panel = "M287 214 L272 226 C254 232 238 242 234 266 L226 400 Q216 444 204 470 Q216 480 228 472 Q240 482 250 472 Q258 480 264 470 L258 400 L262 300 C266 262 276 238 291 224 Z"
    collar = "M287 214 L274 240 L291 230 Z"
    card = "" if v.get("no_cardigan") else g("cardigan", cel(panel, p["red"], p["redS"], 9) + cel(mx(panel), p["red"], p["redS"], 9) +
             cel(collar, p["redS"], None, w=2.2) + cel(mx(collar), p["redS"], None, w=2.2) +
             taper("M244 300 Q240 380 236 450 " + mx("M244 300 Q240 380 236 450"), 1.4) +
             "".join(f'<circle fill="{p["gold"]}" class="o" style="stroke-width:1.6" cx="{x}" cy="{y}" r="4.5"/><circle fill="#fff" cx="{x - 1.5}" cy="{y - 1.5}" r="1.2"/>'
                     for x, y in ((258, 282), (256, 314), (254, 346), (252, 378))))
    knot = g("sash-knot", cel("M338 412 Q364 404 368 426 Q370 448 350 450 Q334 444 338 412 Z", p["sash"], p["sashS"], 5) +
             g("sash-tail", cel("M344 444 Q372 480 374 530 Q386 572 396 618 Q370 632 342 622 Q336 580 332 550 Q324 500 336 448 Z", p["sash"], p["sashS"], 7) +
               f'<path fill="{p["sashH"]}" d="M340 460 Q342 520 348 580 L344 580 Q338 520 337 460 Z"/>' +
               taper("M344 480 Q350 530 356 596 M358 452 Q362 478 360 498 M368 560 Q376 590 380 614", 1.6), (350, 446), T(v.get("tail_t"))))
    neck = g("neck", cel("M290 186 L289 228 Q300 233 311 228 L310 186 Z", p["skin"], p["skinS"], 6, 2.4) +
             f'<path fill="{p["skinS"]}" d="M290 200 Q300 214 310 200 L310 212 Q300 222 290 212 Z"/>')
    wide = f'<g transform="translate(300 0) scale({SHOULDER_W} 1) translate(-300 0)">{torso + xs + shorts + sash + card + knot}</g>'
    return neck, g("body", wide, SKEL["pelvis"], '')


DEFS = """<defs>
<pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#fff"/><line x1="0" y1="0" x2="0" y2="5" stroke="#1B1B1B" stroke-width="1.6"/></pattern>
<pattern id="tone" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#fff"/><circle cx="2.5" cy="2.5" r="1.05" fill="#1B1B1B"/></pattern>
</defs>
<style>.o{stroke:#1B1B1B;stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round}.t{fill:none;stroke:#1B1B1B;stroke-width:1;stroke-linecap:round}</style>"""

def scallop(ring, bump):
    """Join loop points with outward-bulging quadratic bumps (cloud edge)."""
    area = sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(ring, ring[1:] + ring[:1])); sg = -1 if area > 0 else 1
    d = f"M{ring[0][0]:.1f},{ring[0][1]:.1f}"
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        ex, ey = x2 - x1, y2 - y1; mxp, myp = (x1 + x2) / 2 - sg * ey * bump, (y1 + y2) / 2 + sg * ex * bump
        d += f" Q{mxp:.1f},{myp:.1f} {x2:.1f},{y2:.1f}"
    return d + "Z"


def cloud(cx, cy, rx, ry, n=9, seed=1, bump=0.55):
    """10 effects: scalloped steam/cloud outline."""
    r = random.Random(seed)
    return scallop([(cx + rx * math.cos(a), cy + ry * math.sin(a)) for a in (2 * math.pi * i / n + r.random() * 0.3 for i in range(n))], bump * 0.8)


def puffs(p, items, fill="steam", shade="steamS", k=6, id_="fx-steam"):
    curl = lambda cx, cy, rx, *_: taper(f"M{cx - rx * .3:.0f} {cy + rx * .15:.0f} Q{cx - rx * .35:.0f} {cy - rx * .3:.0f} {cx + rx * .05:.0f} {cy - rx * .28:.0f} "
                                        f"Q{cx + rx * .35:.0f} {cy - rx * .1:.0f} {cx + rx * .1:.0f} {cy + rx * .08:.0f}", max(1.4, rx / 22))
    return g(id_, "".join(cel(cloud(*it), p[fill], p[shade], k, w=2.4, step=22) + curl(*it) for it in items))


def hat_back(p, cx=300, cy=232, rx=110, ry=28, rot=0):  # hat hanging on his back: brim peeks out behind the shoulders
    return g("hat-back", f'<g transform="rotate({rot} {cx} {cy})">' + cel(fray(cx, cy, rx, ry, 8), p["hat"], p["hatS"], 6) +
             f'<path class="t" d="{straw(cx, cy - 6, rx, ry - 4)}"/></g>' +
             '<path fill="none" stroke="#1B1B1B" stroke-width="1.6" d="M266 214 Q262 240 300 250 Q338 240 334 214"/>')


HAIR_CAP = "M244 116 C238 60 270 40 300 40 C330 40 362 60 356 116 Z"


def g4_hair(p):  # hatless, swept-up Boundman hair
    return celh("M240 118 L206 92 L232 84 L204 50 L240 56 L226 18 L262 36 L266 -2 L292 28 L310 -10 L322 26 L352 0 L350 38 L388 28 "
               "L368 62 L400 72 L368 90 L394 112 L360 118 Z", p["hair"]) + celh(HAIR_D, p["hair"])


G5_HAIR = ("M238 120 Q206 104 216 76 Q196 60 214 40 Q230 46 236 56 Q226 24 252 8 Q256 30 266 36 Q262 4 290 -14 Q296 14 306 22 "
           "Q314 -10 346 -24 Q340 6 346 18 Q368 0 400 -2 Q384 18 380 34 Q408 34 424 50 Q398 58 388 70 Q410 88 406 112 Q384 102 372 104 "
           "Q380 124 366 140 L360 112 Q330 94 300 98 Q268 94 242 116 Z")  # rounded lobes read as an afro/cloud (G5 iter 4) -> keep flame tongues


G5_MASS = ("M236 132 Q206 120 214 92 Q194 80 200 58 Q220 66 228 70 Q216 40 232 18 Q246 40 256 46 Q252 14 276 -6 Q284 22 296 30 "
           "Q300 -2 330 -24 Q330 8 340 18 Q356 -4 392 -14 Q380 12 380 26 Q404 14 440 18 Q420 34 414 48 Q440 48 470 64 Q444 72 432 84 "
           "Q452 96 462 118 Q432 112 410 116 Q414 132 404 150 Q384 134 366 140 L360 112 Q330 94 300 98 Q268 94 242 116 Z")  # pointed flame tongues, not round lobes


def g5_hair_back(p):  # flame/wave mass sweeping back toward the cloud scarf, with spiral curls
    curls = taper("M250 44 Q238 28 254 22 Q266 28 258 38 M318 6 Q312 -10 328 -10 Q336 0 326 6 M396 6 Q408 -6 420 6 Q414 18 404 14 "
                  "M452 70 Q466 62 472 76 Q464 86 456 80 M216 84 Q206 72 218 64 M352 40 Q362 30 372 40", 2.4)
    return celh(G5_MASS, p["hair"], p["hairS"], 10) + curls


def g5_hair(p):  # white bangs in front of the face
    return celh("M240 116 C236 70 266 50 300 50 C334 50 364 70 360 112 L362 110 Q370 140 374 168 Q358 150 352 132 Q350 144 346 156 Q340 136 334 120 Q328 128 322 142 Q318 132 312 118 Q306 132 300 152 Q298 136 296 118 Q288 124 282 142 Q276 136 270 120 Q262 132 256 156 Q254 146 250 132 Q244 148 228 168 Q228 140 240 116 Z", p["hair"], p["hairS"], 5)
    return celh("M238 110 Q228 140 228 168 Q244 148 250 132 Q254 146 256 156 Q262 132 270 120 Q276 136 282 142 Q288 124 296 118 Q298 136 300 152 "
                "Q306 132 312 118 Q318 132 322 142 Q328 128 334 120 Q340 136 346 156 Q350 144 352 132 Q358 150 374 168 Q370 140 362 110 Z", p["hair"], p["hairS"], 5)


def ribbon(pts, ws, bump=0.9):
    """Cloud ribbon: offset both sides of a centre line, scallop the outline."""
    L, R = [], []
    for i, (x, y) in enumerate(pts):
        (ax, ay), (bx, by) = pts[max(i - 1, 0)], pts[min(i + 1, len(pts) - 1)]; n = math.hypot(bx - ax, by - ay)
        nx, ny = -(by - ay) / n, (bx - ax) / n; L.append((x + nx * ws[i], y + ny * ws[i])); R.append((x - nx * ws[i], y - ny * ws[i]))
    return scallop(L + R[::-1], bump * 0.5)


def g5_collar(p):  # smooth cloud scarf round the shoulders, tail flowing up to his left
    # sparse points + low bump = a few big soft lobes (dense points read as a feather boa); tail thins to a flame tip
    pts = [(204, 230), (250, 258), (300, 266), (350, 258), (396, 232), (426, 184), (446, 136), (478, 92), (520, 62)]
    ws = [12, 22, 24, 22, 22, 22, 18, 11, 2]
    curls = taper("M296 262 Q288 252 300 248 Q308 254 302 258 M240 250 Q234 240 246 238 M364 250 Q358 240 370 238 "
                  "M426 186 Q420 176 432 172 M452 128 Q446 118 458 116", 2)
    return g("fx-cloud-collar", cel(ribbon(pts, ws, 0.6), p["steam"], p["steamS"], 6, w=2.4) + curls)


def g5_bg(p):  # colour-climax burst (colour version only; hide #fx-climax for a plain background)
    if p["red"] != "#F4F4F6": return ""
    rays = " ".join(f"M300 330 L{300 + 900 * math.cos(a):.0f},{330 + 900 * math.sin(a):.0f} L{300 + 900 * math.cos(a + .13):.0f},{330 + 900 * math.sin(a + .13):.0f}Z"
                    for a in [i * 2 * math.pi / 24 for i in range(24)])
    return f'<g id="fx-climax"><rect width="600" height="800" fill="#FFF4D6"/><path fill="#FFE39A" d="{rays}"/><circle cx="300" cy="330" r="190" fill="#FFFBEF" opacity=".8"/></g>'


def g2_steam(p):  # billowing clusters that hug the body (shoulders, arms, knees, feet) - seeded so builds are stable
    r = random.Random(42); items = []
    for i, (ax, ay) in enumerate(((196, 236), (404, 236), (150, 400), (450, 400), (110, 580), (490, 580), (160, 760), (440, 760))):
        for j in range(2):
            rx = r.uniform(34, 52); items.append((ax + r.uniform(-30, 30), ay + r.uniform(-30, 20) - j * 34, rx, rx * .72, 7, i * 3 + j))
    return puffs(p, items)


def flames(p):  # Boundman flame tattoo: curled tongues licking up the chest sides and shoulders (mirrored)
    out = ""
    for x, y, sc in ((222, 344, 1.0), (236, 300, .8), (214, 284, .7), (250, 258, .55)):
        d = (f"M{x - 10 * sc:.0f} {y} Q{x - 16 * sc:.0f} {y - 22 * sc:.0f} {x - 4 * sc:.0f} {y - 36 * sc:.0f} Q{x - 2 * sc:.0f} {y - 22 * sc:.0f} {x + 4 * sc:.0f} {y - 20 * sc:.0f} "
             f"Q{x + 2 * sc:.0f} {y - 42 * sc:.0f} {x + 14 * sc:.0f} {y - 56 * sc:.0f} Q{x + 12 * sc:.0f} {y - 30 * sc:.0f} {x + 18 * sc:.0f} {y - 16 * sc:.0f} Q{x + 18 * sc:.0f} {y - 4 * sc:.0f} {x + 8 * sc:.0f} {y} Z")
        out += cel(d, p["flame"], None, w=1.6) + cel(mx(d), p["flame"], None, w=1.6)
    return out


STEAM = dict(steam="#FFFFFF", steamS="#E7DCE6")
# Poses: raw SVG transforms, applied about each rig group's pivot (transform-origin). Positive rotate = clockwise on screen:
# arm-r/leg-r (viewer left) swing OUT with +deg, arm-l/leg-l with -deg. Nested: upper > forearm > fist, thigh > shin > sandal.
GEARS = {
    "g1": dict(head_t="rotate(-3)", upper_t="rotate(-1)",
               **{"arm-r": dict(all="rotate(7)", forearm="rotate(-10)"), "arm-l": dict(all="rotate(-5)", forearm="rotate(12)"),
                  "leg-r": dict(thigh="rotate(4)", shin="rotate(-3)"), "leg-l": dict(thigh="rotate(-3)", shin="rotate(2)")}),
    "g2": dict(mouth="grin", expr="angry", art_t="translate(0 64)", head_t="rotate(0)",
               **{"arm-r": dict(all="rotate(10)", forearm="rotate(-28)", fist="scale(1.5)"), "arm-l": dict(all="rotate(-10)", forearm="rotate(28)", fist="scale(1.5)"),
                  "leg-r": dict(thigh="rotate(56)", shin="rotate(-60)", foot="rotate(4)"),
                  "leg-l": dict(thigh="rotate(-56)", shin="rotate(60)", foot="rotate(-4)")},
               pal_color=dict(steam="#FFF5F8", steamS="#EBC7D6", skin="#F79C8F", skinS="#D4666A"), pal_bw=dict(steam="#FFFFFF", steamS="url(#tone)"),
               fx_back=g2_steam,
               fx_front=lambda p: puffs(p, [(244, 262, 30, 18, 9, 7), (358, 258, 32, 19, 9, 8)], id_="fx-steam-front") +
               g("fx-steam-vent", "".join(f'<path fill="{p["steam"]}" opacity=".6" d="{ribbon(pts, [2, 6, 8, 6, 2], 0.5)}"/>' + taper("M" + " L".join(f"{x} {y}" for x, y in pts), 1.2, p["steamS"]) for pts in (
                   [(232, 262), (224, 236), (232, 210), (222, 186), (230, 160)], [(368, 262), (376, 236), (368, 210), (378, 186), (370, 160)],
                   [(186, 520), (176, 494), (186, 468), (176, 444), (184, 420)], [(414, 520), (424, 494), (414, 468), (424, 444), (416, 420)]))) +
               g("fx-steam-lines", taper("M206 232 Q196 212 206 192 Q216 172 206 152 M394 232 Q404 212 394 192 Q384 172 394 152 M186 380 Q176 360 186 340 M414 380 Q424 360 414 340", 2.2))),
    "g3": dict(mouth="grin", brows=True, giant_fist=True, art_t="translate(372 770) scale(0.58) translate(-300 -760)",
               upper_t="rotate(-14) skewX(-8) scale(0.94 1)", head_t="rotate(-8)", hat_t="translate(110 -70) rotate(28)",
               css='<style>#arm-r path{vector-effect:non-scaling-stroke}</style>',
               **{"arm-r": dict(all="rotate(138)", upper="scale(1.5 1)", forearm="rotate(-14) scale(1.7 1)", fist="scale(6.8)"),
                  "arm-l": dict(all="rotate(-38)", forearm="rotate(-70)"),
                  "leg-r": dict(thigh="rotate(26)", shin="rotate(-16)"), "leg-l": dict(thigh="rotate(-8)", shin="rotate(24)")},
               fx_front=lambda p: g("fx-impact", taper("M60 120 L120 170 M40 260 L118 270 M120 30 L160 110 M420 60 L370 130 M470 200 L400 230", 3))),
    "g4": dict(mouth="shout", expr="angry", haki=True, no_sleeves=True, no_cardigan=True, no_hat=True, hair=g4_hair,
               art_t="translate(0 -24)", head_t="rotate(4)", upper_t="rotate(3)",
               hair_back="M240 100 L222 160 L244 150 L250 168 L350 168 L356 150 L378 160 L360 100 Z",
               torso="M290 212 C246 212 208 228 204 262 C198 324 204 404 248 446 L352 446 C396 404 402 324 396 262 C392 228 354 212 310 212 Z",
               arms_front=True,
               **{"arm-r": dict(all="rotate(24) scale(1.3 1.05)", forearm="rotate(-105)", fist="scale(1.8)"),
                  "arm-l": dict(all="rotate(-28) scale(1.3 1.05)", forearm="rotate(18)", fist="scale(1.8)"),
                  "leg-r": dict(thigh="rotate(34)", shin="rotate(-66)"), "leg-l": dict(thigh="rotate(-28)", shin="rotate(58)")},
               pal_color=dict(STEAM, flame="#C8141E", steamS="#D5D3DC"), pal_bw=dict(steam="#FFFFFF", steamS="url(#tone)", flame="#FFFFFF"),
               fx_upper_back=lambda p: hat_back(p, 300, 226, 100, 26),
               fx_front=lambda p: g("fx-steam-glow", "".join(f'<path fill="{p["steam"]}" opacity=".55" d="{ribbon(pts, [2, 9, 12, 9, 2], 0.5)}"/>' + taper("M" + " L".join(f"{x} {y}" for x, y in pts), 1.2, p["steamS"]) for pts in (
                   [(150, 250), (128, 320), (144, 400), (126, 470), (150, 540)], [(450, 250), (474, 320), (456, 400), (476, 470), (452, 540)],
                   [(250, 600), (232, 660), (250, 720)], [(350, 600), (370, 660), (350, 720)]))),
               fx_mid=lambda p: g("fx-flame-tattoo", flames(p)) + g("hat-string", '<path fill="none" stroke="#C9A45C" stroke-width="2.4" d="M264 214 Q256 252 300 262 Q344 252 336 214"/>' + taper("M298 262 L292 276 M302 262 L308 276", 1.4)) +
               g("fx-steam-scarf", cel(ribbon([(176, 286), (196, 244), (240, 214), (300, 204), (360, 214), (404, 244), (424, 286)],
                                               [3, 6, 7, 6, 7, 6, 3], 0.7), p["steam"], p["steamS"], 3, w=1.6, extra=' opacity=".75"'))),
    "g5": dict(mouth="laugh", eyes="g5", no_hat=True, hair=g5_hair, hair_back_fn=g5_hair_back, tail_t="rotate(-62)",
               art_t="translate(300 760) scale(0.84) translate(-300 -760) translate(0 -70)", upper_t="rotate(-9)", head_t="rotate(-10)",
               **{"arm-r": dict(all="rotate(160)", forearm="rotate(-55)"), "arm-l": dict(all="rotate(-78)", forearm="rotate(-55)"),
                  "leg-r": dict(thigh="rotate(72)", shin="rotate(-105)", foot="rotate(10)"),
                  "leg-l": dict(thigh="rotate(-22)", shin="rotate(68)", foot="rotate(-20)")},
               pal_color=dict(STEAM, hair="#FFFFFF", hairS="#CFD3DE", red="#F4F4F6", redS="#C9CDD8", blue="#FAFAFC", blueS="#C9CDD8",
                              blueH="none", sash="#B9A3D6", sashS="#8E73B8", sashH="#D9CCEA", band="#FFFFFF", bandS="#C9CDD8",
                              steamS="#D3D7E2", ring="#E0352F"),
               pal_bw=dict(hair="#FFFFFF", hairS="url(#hatch)", steam="#FFFFFF", steamS="url(#tone)", band="#FFFFFF", bandS="url(#hatch)", sash="url(#tone)"),
               fx_bg=g5_bg, fx_upper_back=lambda p: hat_back(p, 372, 262, 70, 22, -28), fx_mid=g5_collar),
}




def T(t):
    return f' transform="{t}"' if t else ""


def build(gear, base):
    v = GEARS[gear]; p = dict(base, **v.get("pal_color" if base is COLOR else "pal_bw", {}))
    neck, bod = body(p, v)
    fx = lambda k: v[k](p) if k in v else ""
    arms = arm("r", p, v) + arm("l", p, v)
    upper = g("upper-body", fx("fx_upper_back") + neck + ("" if v.get("arms_front") else arms) + bod + fx("fx_mid") +
              (arms if v.get("arms_front") else "") + head_stack(p, v),
              (300, 480), T(v.get("upper_t")))
    layers = [fx("fx_bg"), f'<g id="pose"{T(v.get("art_t"))}>', fx("fx_back"), g("legs", leg("r", p, v) + leg("l", p, v), extra=''),
              upper, fx("fx_front"), "</g>"]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="1200" height="1600" id="luffy-{gear}">\n'
            f'<title>Straw-hat pirate (fan art, {gear})</title>\n{DEFS}{v.get("css", "")}\n{construct()}\n<g id="art">\n' + "\n".join(layers) + "\n</g>\n</svg>\n")


if __name__ == "__main__":
    out = sys.argv[1]
    for gname in sys.argv[2:] or ["g1"]:
        for name, pal in (("color", COLOR), ("bw", BW)):
            open(f"{out}/luffy-{gname}-{name}.svg", "w", encoding="utf-8").write(build(gname, pal))
    print("ok")
