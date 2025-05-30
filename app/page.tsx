import Hero from "@/comnponents/Hero";
import About from "@/comnponents/About";
export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center  sm:px-10 px-3  overflow-hidden">
        <Hero />
        <About />
      </div>
    </main>
  );
}
