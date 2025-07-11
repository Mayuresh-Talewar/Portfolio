"use client";

import Hero from "@/comnponents/Hero";
import Modal from "react-modal";
import About from "@/comnponents/About";
import { HeroParallax } from "@/comnponents/ui/hero-parallax";
import { HoverEffect } from "@/comnponents/ui/card-hover-effect";
import React from "react";
import FloatSkills from "@/comnponents/ui/FloatSkills";
import InfinityLogoScrolling from "@/comnponents/ui/InfinityLogoScrolling";

Modal.setAppElement("body");

export default function Home() {

  return (
    <main>
      <div className="flex w-full flex-col mx-auto items-center  -mt-14 sm:px-10 px-3 overflow-hidden ">
        <Hero />
        <About />
        <HoverEffect />
        <FloatSkills/>
        <HeroParallax />
          <div className="">
        <InfinityLogoScrolling speed={30} />
        </div>

        {/* Button to open modal */}
       
      </div>
    </main>
  );
}