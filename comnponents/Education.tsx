"use client";
import React, { useEffect, useState } from "react";
import { FaUniversity, FaGraduationCap, FaSchool } from "react-icons/fa";
import { SiReact, SiMongodb, SiNodedotjs, SiGithub, SiDocker, SiJavascript, SiTypescript } from "react-icons/si";

const educationData = [
  {
    degree: "Bachelor of Technology (B.Tech) in Computer Science",
    institution: "Rashtrasant Tukadoji Maharaj Nagpur University",
    year: "2021 - 2025",
    location: "Nagpur, Maharashtra, India",
    icon: <FaUniversity className="text-[#eef8ce] text-2xl mr-3" />,
  },
  {
    degree: "Diploma in Computer Engineering",
    institution: "ABC Polytechnic College",
    year: "2018 - 2021",
    location: "Nagpur, Maharashtra, India",
    icon: <FaGraduationCap className="text-[#eef8ce] text-2xl mr-3" />,
  },
  {
    degree: "Secondary School (10th)",
    institution: "XYZ High School",
    year: "2017 - 2018",
    location: "Nagpur, Maharashtra, India",
    icon: <FaSchool className="text-[#eef8ce] text-2xl mr-3" />,
  },
];

const floatLogos = [
  { icon: <SiReact />, color: "#eef8ce" },
  { icon: <SiMongodb />, color: "#eef8ce" },
  { icon: <SiNodedotjs />, color: "#eef8ce" },
    { icon: <SiGithub />, color: "#eef8ce" },
  { icon: <SiDocker />, color: "#eef8ce" },
    { icon: <SiJavascript />, name: "JavaScript (ES6+)", color: "#eef8ce" },
    { icon: <SiTypescript />, name: "TypeScript", color: "#eef8ce" },
];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function Education() {
  const [positions, setPositions] = useState<
    { top: string; left: string; color: string; duration: number; delay: number; x1: number; y1: number; x2: number; y2: number; icon: React.ReactNode }[]
  >([]);

  useEffect(() => {
    setPositions(
      floatLogos.map((logo) => ({
        top: `${rand(-10, 100)}%`, // allow some icons above/below
        left: `${rand(-10, 100)}%`, // allow some icons left/right
        color: logo.color,
        duration: rand(10, 18),
        delay: rand(0, 6),
        x1: rand(-80, 80),
        y1: rand(-80, 80),
        x2: rand(-80, 80),
        y2: rand(-80, 80),
        icon: logo.icon,
      }))
    );
  }, []);

  return (
    <section className="relative w-full flex justify-center items-center mb-26 md:mb-10 md:-mt-18 mt-26  h-[600px]">
      {/* Floating tech logos outside the card */}
      <div className="absolute w-[120%] h-[120%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        {positions.map((pos, idx) => (
          <span
            key={idx}
            className="absolute text-5xl opacity-15"
            style={{
              top: pos.top,
              left: pos.left,
              color: pos.color,
              animation: `float-path ${pos.duration}s ease-in-out ${pos.delay}s infinite alternate`,
              ["--x1" as any]: `${pos.x1}px`,
              ["--y1" as any]: `${pos.y1}px`,
              ["--x2" as any]: `${pos.x2}px`,
              ["--y2" as any]: `${pos.y2}px`,
            }}
          >
            {pos.icon}
          </span>
        ))}
      </div>

      {/* Main education card */}
      <div className="relative z-10 max-w-3xl w-full mx-auto px-4 py-8 rounded-xl  backdrop-blur-md backdrop-brightness-90 shadow-lg ">
        <h2 className="text-4xl font-bold text-[#eef8ce] mb-8 text-center">Education</h2>
        <ul className="space-y-8">
          {educationData.map((edu, idx) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center bg-neutral-800 rounded-lg p-6 shadow transition hover:shadow-lg w-full"
            >
              <div className="flex items-center mb-2 sm:mb-0 w-full">
                {edu.icon}
                <span className="text-xl font-semibold text-white max-w-[500px] w-full">{edu.degree}</span>
              </div>
              <div className="sm:ml-6 mt-2 sm:mt-0 md:max-w-1/3 w-full">
                <div className="text-neutral-300">{edu.institution}</div>
                <div className="text-neutral-400 text-sm">{edu.year}</div>
                <div className="text-neutral-400 text-sm">{edu.location}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
    </section>
  );
}