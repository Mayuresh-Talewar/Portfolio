"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Rig facts (Art Studio file, viewBox 600x800): arm-l (viewer's right) is a nested joint chain
// arm-l > arm-l-upper > arm-l-forearm > arm-l-fist (+ arm-l-shoulder sleeve cap), each with a data-pivot.
const pivotOf = (el: Element, fallback: string) => el.getAttribute("data-pivot")?.replace(",", " ") ?? fallback;

/**
 * Gomu Gomu no Pistol (cookbook §9f), scrubbed: a rubber tube shoots out of the shoulder (constant ink weight),
 * the fist rides its end across the panel, then everything snaps back. The fist is translated, never scaled.
 * The ONE inlined Luffy file: fetched lazily (near the viewport) so its arm ids can be animated.
 * Reduced motion: static pose. Fetch failure: lettering only.
 */
export function PistolArm({ src }: { src: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch(src)
          .then((r) => (r.ok ? r.text() : null))
          .then((t) => alive && t && setSvg(t.replace(/<title>[\s\S]*?<\/title>/, "")))
          .catch(() => {});
      },
      { rootMargin: "900px 0px" },
    );
    if (root.current) io.observe(root.current);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [src]);

  useGSAP(
    () => {
      const el = root.current!;
      const art = el.querySelector<SVGSVGElement>("[data-rig] svg");
      const arm = art?.querySelector("#arm-l");
      const upper = art?.querySelector("#arm-l-upper");
      const fist = art?.querySelector("#arm-l-fist");
      const host = arm?.parentNode;
      if (!art || !arm || !upper || !fist || !host) return;
      const [sx, sy0] = pivotOf(arm, "369 250").split(" ").map(Number);
      const sy = sy0 + 14; // tube centre: just under the shoulder pivot, inside the sleeve cap
      const [fx, fy] = pivotOf(fist, "413 512").split(" ").map(Number);
      const skin = src.includes("-bw") ? "#ffffff" : "#f6c9a0";

      // A dedicated rubber arm: a tube (its width attribute grows, so the ink weight never distorts) that grows from the
      // shoulder, plus a copy of the fist that is only TRANSLATED along it. The resting arm hides meanwhile;
      // the sleeve cap (arm-l-shoulder) stays on the shoulder.
      const NS = "http://www.w3.org/2000/svg";
      const rubber = document.createElementNS(NS, "g");
      rubber.style.visibility = "hidden"; // reduced motion: never shown
      const tube = document.createElementNS(NS, "rect");
      for (const [k, v] of Object.entries({ x: sx, y: sy - 9, width: 1, height: 18, fill: skin, stroke: "#1a1612", "stroke-width": 3, "vector-effect": "non-scaling-stroke" }))
        tube.setAttribute(k, String(v));
      const hand = fist.cloneNode(true) as SVGGElement;
      for (const n of [hand, ...hand.querySelectorAll("[id]")]) n.removeAttribute("id");
      // Point the fist right with its wrist (pivot) on the tube start; `ride` slides it to the tube end.
      hand.setAttribute("transform", `translate(${sx - fx} ${sy - fy}) rotate(-90 ${fx} ${fy}) translate(${fx} ${fy}) scale(1.5) translate(${-fx} ${-fy})`); // comic-big fist
      hand.style.transformOrigin = "";
      const ride = document.createElementNS(NS, "g");
      ride.append(hand);
      rubber.append(tube, ride);
      const sync = () => ride.setAttribute("transform", `translate(${tube.getAttribute("width")} 0)`);
      host.insertBefore(rubber, arm.nextSibling);

      const mm = gsap.matchMedia();
      mm.add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
        const { desk } = ctx.conditions as { desk: boolean };
        // SVG units the fist travels: ~half the viewport.
        const reach = () => (innerWidth * (desk ? 0.5 : 0.5)) / (art.getBoundingClientRect().height / 800);
        gsap.set(rubber, { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desk
            ? { trigger: el, start: "center center", end: "+=110%", pin: true, scrub: 0.4, invalidateOnRefresh: true, refreshPriority: 1 }
            : { trigger: el, start: "top 70%", end: "bottom 25%", scrub: 0.4, invalidateOnRefresh: true },
        });
        tl.set(upper, { autoAlpha: 0 }, 0.08)
          .set(rubber, { autoAlpha: 1 }, 0.08)
          .to(tube, { attr: { width: () => reach() }, duration: 0.42, onUpdate: sync }, 0.08) // attr, not scale: exact ink weight
          .fromTo(el.querySelectorAll(".pistol-call"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.1, ease: "back.out(2)" }, 0.45)
          .to(tube, { attr: { width: 1 }, duration: 0.1, ease: "power4.in", onUpdate: sync }, 0.85)
          .set(rubber, { autoAlpha: 0 }, 0.95)
          .set(upper, { autoAlpha: 1 }, 0.95);
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      return () => rubber.remove();
    },
    { scope: root, dependencies: [svg], revertOnUpdate: true },
  );

  return (
    // Cropped to head-to-hips so the panel is all action (the tube runs at shoulder height).
    <div ref={root} className="relative h-[40svh] min-h-[18rem] overflow-hidden md:h-[54svh]">
      <div
        data-rig
        role="img"
        aria-label="Fan art: a cartoon pirate throwing a stretching rubber punch toward the next chapter"
        className="relative ml-[4%] h-[170%] [&_svg]:h-full [&_svg]:w-auto [&_svg]:overflow-visible"
        // Same-origin static asset from public/art/luffy (Art Studio output), fetched by path.
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      />
      <p aria-hidden className="sfx absolute top-[4%] left-[38%] -rotate-[6deg] text-[clamp(2rem,6vw,4.5rem)]">
        Gomu gomu no...
      </p>
      <p
        aria-hidden
        className="pistol-call sfx absolute right-[3%] bottom-[8%] text-[clamp(3rem,10vw,8rem)]"
        style={{ "--sfx-fill": "var(--color-paper)" } as React.CSSProperties}
      >
        Pistol!!
      </p>
    </div>
  );
}
