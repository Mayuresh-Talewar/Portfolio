"use client";

import { ThreeDMarquee } from "@/comnponents/ui/3d-marquee";

export function ThreeDMarqueeDemo() {
    const image = [
       
      
      "/image/6.png",
      "/image/7.png",

   "/image/1.png",
  "/image/2.png",
      "/image/3.png",
          "/image/4.png",

  
  "/image/8.png",
  "/image/9.png",
  "/image/10.png",
  "/image/11.png",
  "/image/12.png"
    ]
    
    const images = [...image,...image,...image]
  return (
    <div className="mx-auto h-full max-w-7xl  my-10 bg-gray-950/5  ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
