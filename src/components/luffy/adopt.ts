import { gsap } from "@/lib/gsap";

/**
 * The Art Studio rig stores rest poses as `transform="rotate(n)"` + CSS `transform-origin` (= data-pivot).
 * GSAP re-bases SVG transforms to origin 0,0, so hand it the rest pose first or the part jumps.
 * Complex transforms (translate/scale chains) are left alone: we never animate those groups.
 */
export function adopt(...els: (Element | null | undefined)[]) {
  for (const el of els) {
    if (!el) continue;
    const t = el.getAttribute("transform")?.trim() ?? "";
    const m = t.match(/^rotate\(\s*(-?[\d.]+)\s*\)$/);
    if (t && !m) continue;
    el.removeAttribute("transform");
    (el as SVGElement).style.transformOrigin = "";
    gsap.set(el, { rotation: m ? +m[1] : 0, svgOrigin: el.getAttribute("data-pivot")?.replace(",", " ") ?? "0 0" });
  }
}
