import Hero from "@/comnponents/Hero";
import About from "@/comnponents/About";
import { HeroParallax } from "@/comnponents/ui/hero-parallax";
export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-start -mt-14 sm:px-10 px-3 overflow-hidden">
        <Hero />
        <About />
        <HeroParallax  />
        </div>
    </main>
  );
}


