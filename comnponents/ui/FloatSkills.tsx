"use client";
import React, { useEffect, useState } from "react";
import {
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiDocker,
  SiFigma,
  SiPostman,
  SiGithub,
  SiTailwindcss,
  SiBootstrap,
  SiRedux,
  SiSocketdotio,
  SiJest,
} from "react-icons/si";

const skills = [
  { icon: <SiJavascript />, name: "JavaScript (ES6+)", color: "#F7DF1E" },
  { icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
  { icon: <SiReact />, name: "React.js", color: "#61DAFB" },
  { icon: <SiNextdotjs />, name: "Next.js", color: "#fff" },
  { icon: <SiRedux />, name: "Redux", color: "#764ABC" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS", color: "#38B2AC" },
  { icon: <SiBootstrap />, name: "Bootstrap", color: "#7952B3" },
  { icon: <SiNodedotjs />, name: "Node.js", color: "#3C873A" },
  { icon: <SiExpress />, name: "Express.js", color: "#fff" },
  { icon: <SiSocketdotio />, name: "Socket.IO", color: "#fff" },
  { icon: <SiMongodb />, name: "MongoDB", color: "#47A248" },
  { icon: <SiGithub />, name: "GitHub", color: "#fff" },
  { icon: <SiPostman />, name: "Postman", color: "#FF6C37" },
  { icon: <SiDocker />, name: "Docker", color: "#2496ED" },
  { icon: <SiFigma />, name: "Figma", color: "#F24E1E" },
  { icon: <SiJest />, name: "Jest", color: "#C21325" },
];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function FloatSkills() {
  const [positions, setPositions] = useState<
    {
      top: string;
      left: string;
      color: string;
      duration: number;
      delay: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[]
  >([]);

  useEffect(() => {
    setPositions(
      skills.map(() => ({
        top: `${rand(10, 85)}%`,
        left: `${rand(10, 85)}%`,
        color: "",
        duration: rand(10, 18),
        delay: rand(0, 6),
        x1: rand(-140, 140),
        y1: rand(-140, 140),
        x2: rand(-140, 140),
        y2: rand(-140, 140),
      }))
    );
  }, []);

  // Only render floating icons after positions are set (client-side)
  if (positions.length === 0) {
    return (
      <div className="relative w-full mx-auto h-[300px] mt-10 rounded-xl">
        <div className="mx-auto z-40 text-center max-w-[1000px] backdrop-blur-xs flex flex-wrap flex-col w-full">
          <h1 className="text-5xl z-40 md:text-7xl w-full font-bold dark:text-white">
            Skills
          </h1>
          <p className="text-wrap w-full z-40 md:mx-0 mx-auto text-center text-sm sm:text-base md:text-xl font-light mt-4 sm:mt-6 md:mt-8 dark:text-white">
            A well-rounded tech stack honed through hands-on projects. From designing responsive UIs in React to building powerful APIs with Node.js and Express, these are the tools and technologies I use to bring digital ideas to life.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto h-[500px] my-10  rounded-xl">
      <div className="mx-auto z-40 text-center max-w-[1000px] backdrop-blur-xs flex flex-wrap flex-col w-full">
        <h1 className="text-5xl z-40 md:text-7xl w-full font-bold dark:text-[#eef8ce]">
          Skills
        </h1>
        <p className="text-wrap w-full z-40 md:mx-0 mx-auto text-center text-sm sm:text-base md:text-xl font-light mt-4 sm:mt-6 md:mt-8 dark:text-white">
          A well-rounded tech stack honed through hands-on projects. From designing responsive UIs in React to building powerful APIs with Node.js and Express, these are the tools and technologies I use to bring digital ideas to life.
        </p>
      </div>
      {skills.map((skill, i) => {
        const pos = positions[i];
        return (
          <span
            key={i}
            className="absolute mt-10 -z-50 text-5xl"
            style={{
              top: pos.top,
              left: pos.left,
              color: skill.color,
              animation: `float-path ${pos.duration}s ease-in-out ${pos.delay}s infinite alternate`,
              ["--x1" as any]: `${pos.x1}px`,
              ["--y1" as any]: `${pos.y1}px`,
              ["--x2" as any]: `${pos.x2}px`,
              ["--y2" as any]: `${pos.y2}px`,
            }}
            title={skill.name}
          >
            {skill.icon}
          </span>
        );
      })}

      <style jsx>{`
        @keyframes float-path {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          40% {
            transform: translate(var(--x1), var(--y1)) scale(1.1);
          }
          70% {
            transform: translate(var(--x2), var(--y2)) scale(0.95);
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}