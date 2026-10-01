"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { adopt } from "./adopt";

type Enter = "gearup" | "hello" | "bye";

/** Namespace every id (and its url(#)/href refs) so several rigs can live on one page. */
function scope(svg: string, p: string) {
  return svg
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/\bid="([^"]+)"/g, `id="${p}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
    .replace(/href="#([^"]+)"/g, `href="#${p}$1"`);
}

const pivot = (el: Element | null) => el?.getAttribute("data-pivot")?.replace(",", " ");

/**
 * A living Luffy (Art Studio SVGs, fetched lazily by path, never copied). Parts by id, each optional:
 * eyes-open/eyes-closed (blink), mouth-grin/mouth-laugh/mouth-smile (laugh), hat, hair, arm-l, body, pose.
 * - gearup: squash anticipation on the previous Gear → white flash → swap to this Gear → overshoot settle.
 * - hello / bye: springs up, hat + hair follow through, laughs, waves.
 * Then idles (breathing bob + random blink), paused whenever it's off screen.
 * Reduced motion or no JS: the static server image (children) stays; nothing is fetched.
 */
export function LuffyRig({
  src,
  prev,
  enter,
  label,
  className,
  children,
}: {
  src: string;
  prev?: string | null;
  enter: Enter;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const p = `lr${useId().replace(/[^a-zA-Z0-9]/g, "")}-`;
  const [art, setArt] = useState<{ cur: string; prev: string | null } | null>(null);

  useEffect(() => {
    if (matchMedia(MQ.reduce).matches) return; // static poses only
    let alive = true;
    const get = (u?: string | null) => (u ? fetch(u).then((r) => (r.ok ? r.text() : null)).catch(() => null) : Promise.resolve(null));
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        Promise.all([get(src), get(prev)]).then(([c, b]) => {
          if (alive && c) setArt({ cur: scope(c, `${p}c-`), prev: b ? scope(b, `${p}p-`) : null });
        });
      },
      { rootMargin: "700px 0px" },
    );
    if (root.current) io.observe(root.current);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [src, prev, p]);

  useGSAP(
    () => {
      if (!art) return;
      const el = root.current!;
      const cur = el.querySelector<HTMLElement>("[data-layer='cur']")!;
      const old = el.querySelector<HTMLElement>("[data-layer='prev']");
      const part = (id: string) => cur.querySelector(`[id="${p}c-${id}"]`);
      const eyesOpen = part("eyes-open");
      const eyesShut = part("eyes-closed");
      const mouths = ["mouth-smile", "mouth-grin", "mouth-laugh", "mouth-shout"].map(part).filter((m): m is Element => !!m);
      const rest = mouths.find((m) => getComputedStyle(m).display !== "none");
      const [openMouth, wideMouth] = [part("mouth-laugh"), part("mouth-grin")];
      const hat = part("hat") ?? part("hat-back");
      const hair = part("hair");
      const arm = part("arm-l");
      const body = part("upper-body") ?? part("body");

      const mm = gsap.matchMedia();
      mm.add(MQ.ok, () => {
        adopt(arm, hat, hair, body);
        // Follow-through: hat lags and bounces, hair whips (secondary motion on any big move).
        const follow = (at: gsap.Position, tl: gsap.core.Timeline) => {
          if (hat) tl.fromTo(hat, { y: -18, rotation: -8 }, { y: 0, rotation: 0, svgOrigin: pivot(hat) ?? "300 86", duration: 0.9, ease: "elastic.out(1.1, 0.35)" }, at);
          if (hair) tl.fromTo(hair, { skewX: 10 }, { skewX: 0, duration: 0.8, ease: "elastic.out(1, 0.3)", transformOrigin: "50% 100%" }, at);
        };
        const laugh = (at: gsap.Position, tl: gsap.core.Timeline) => {
          if (!openMouth || !wideMouth || !rest) return;
          tl.addLabel("laugh", at); // "shishishi": laugh/grin frames x3 (< 1 s), then back to the rest mouth
          for (let i = 0; i < 6; i++) {
            tl.set(mouths, { display: "none" }, `laugh+=${i * 0.12}`).set(i % 2 ? wideMouth : openMouth, { display: "inline" }, "<");
          }
          tl.set(mouths, { display: "none" }, "laugh+=0.72").set(rest, { display: "inline" }, "<");
        };

        const tl = gsap.timeline(
          enter === "hello"
            ? { delay: 0.8 }
            : { scrollTrigger: { trigger: el, start: enter === "gearup" ? "top 80%" : "top 85%", once: true } },
        );

        if (enter === "gearup") {
          gsap.set(cur, { autoAlpha: 0 });
          const flash = el.querySelector("[data-flash]");
          if (old) {
            tl.to(old, { scaleY: 0.82, scaleX: 1.12, duration: 0.28, ease: "power2.in", transformOrigin: "50% 100%" }, 0.2) // anticipation
              .to(old, { scaleY: 1.12, scaleX: 0.9, duration: 0.08 }, ">");
          }
          tl.fromTo(flash, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.07 }, old ? 0.52 : 0.3)
            .set(old, { autoAlpha: 0 }, "<0.07")
            .set(cur, { autoAlpha: 1 }, "<")
            .to(flash, { autoAlpha: 0, duration: 0.3 }, "<")
            .fromTo(cur, { scaleY: 1.3, scaleX: 0.78 }, { scaleY: 1, scaleX: 1, duration: 1, ease: "elastic.out(1.1, 0.32)", transformOrigin: "50% 100%" }, "<"); // overshoot settle
          follow("<0.05", tl);
          laugh(">-0.4", tl);
        } else {
          tl.from(cur, { yPercent: 60, autoAlpha: 0, duration: 0.6, ease: "back.out(1.8)" });
          follow("-=0.25", tl);
          laugh("-=0.5", tl);
          if (arm) {
            // Wave relative to the rest pose (the rig ships with its own rotations).
            const o = pivot(arm) ?? "369 250";
            tl.to(arm, { rotation: "-=145", svgOrigin: o, duration: 0.3, ease: "back.out(2)" }, "-=0.3")
              .to(arm, { rotation: "+=22", svgOrigin: o, duration: 0.2, yoyo: true, repeat: 5, ease: "sine.inOut" })
              .to(arm, { rotation: "+=145", svgOrigin: o, duration: 0.4, ease: "power2.inOut" });
          } else {
            tl.to(cur, { rotation: 4, duration: 0.22, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "50% 100%" });
          }
        }

        // Idle: breathing bob + random blink, running only while on screen.
        const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
        if (body) idle.to(body, { y: -3, duration: 1.5, ease: "sine.inOut" }, 0);
        if (hat) idle.to(hat, { y: -2, duration: 1.5, ease: "sine.inOut" }, 0);
        let blink: gsap.core.Tween | undefined;
        const queueBlink = () => {
          if (!eyesOpen || !eyesShut) return;
          blink = gsap.delayedCall(gsap.utils.random(2, 5), () => {
            gsap.set(eyesOpen, { display: "none" });
            gsap.set(eyesShut, { display: "inline" });
            gsap.delayedCall(0.12, () => {
              gsap.set(eyesOpen, { display: "inline" });
              gsap.set(eyesShut, { display: "none" });
              queueBlink();
            });
          });
        };
        const io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting && tl.progress() === 1) {
            idle.play();
            if (!blink) queueBlink();
          } else idle.pause();
        });
        tl.eventCallback("onComplete", () => {
          idle.play();
          queueBlink();
          io.observe(el);
        });
        return () => {
          io.disconnect();
          blink?.kill();
        };
      });
    },
    { scope: root, dependencies: [art], revertOnUpdate: true },
  );

  return (
    <div ref={root} role="img" aria-label={label} className={className}>
      {art ? (
        <>
          {art.prev && (
            <div data-layer="prev" aria-hidden className="absolute inset-0 [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: art.prev }} />
          )}
          <div data-layer="cur" aria-hidden className="absolute inset-0 [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: art.cur }} />
          {enter === "gearup" && <div data-flash aria-hidden className="absolute -inset-[20%] rounded-full bg-white opacity-0 blur-xl" />}
        </>
      ) : (
        children
      )}
    </div>
  );
}
