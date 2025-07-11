"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

const items = [
  {
    duraction: "April 2025 - Present",
    title:"Lead Full Stack Developer (MERN Stack)",
    row:"1",
    role:"Intern",
    company: "TECHNOLOGY WORLD CREATER PVT LTD",
    description:
      "Full Stack Developer Intern (Team Lead) at Technology World Creater Pvt Ltd, where I led a team in developing scalable MERN stack applications, integrated third-party APIs like Razorpay and Twilio, and implemented agile practices to drive faster, cross-device compatible web solutions.",
   
  },
  {
    duraction: "September 2024 – March 2025 ",
    company:"SOFTTRONIX SOFTWARE SOLUTION PVT LTD ",
    row:"2",
    role:"Intern",
    title: "Lead React Developer ",
    description:
      "React.js Intern (Team Lead) at Softtronix Software Solution Pvt Ltd, focused on building responsive user interfaces, optimizing development with reusable components, and collaborating with cross-functional teams to implement design patterns and agile workflows",
  },
  {
    duraction: "January 2024 – June 2024",
    company:"TechLang",
    row:"3",
    role:"Intern",
    title: "Full Stack Developer  (MERN Stack)",
    description:
      "Full Stack Intern at TechLang, where I developed and optimized key features using the MERN stack, improved application load times by 25%, and transformed wireframes into dynamic, user-friendly interfaces — significantly enhancing client satisfaction and overall product usability.",
  },
  {
    duraction: "June 2020 – August 2020",
    company:"Qaswa Technologies Private Limited",
    row:"4",
    role:"Intern",
    title: "Web Developer ",
    description:
      "Assisted in frontend web development using HTML, CSS, and JavaScript to create responsive, accessible, and visually consistent layouts. Collaborated with the development team to implement best practices in UI/UX design, and supported comprehensive UI testing to ensure seamless functionality, cross-browser compatibility.",
  }
];

export const HoverEffect = ({
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={"mx-auto mt-10  py-10 text-center flex flex-wrap flex-col  px-2 sm:px-10 w-full"}>
      <div className=" mx-auto  text-center max-w-[1000px] flex flex-wrap flex-col   w-full ">
<h1 className="text-5xl  md:text-7xl w-full  font-bold dark:text-[#eef8ce]">
  Work Experience
</h1>
<p className="text-wrap  w-full md:mx-0 mx-auto text-center  text-sm sm:text-base md:text-xl font-light mt-4 sm:mt-6 md:mt-8 dark:text-white">
  Here’s a snapshot of my professional journey — from building full-stack applications and leading dev teams to collaborating on real-world products during full-time internships. Each experience has strengthened my technical foundation and leadership skills.
</p>


  </div>
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 max-w-[1200px] w-full mx-auto justify-center items-center py-10 mt-5",
        className
      )}
    >
      
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={idx}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full  bg-[#eef8ce] dark:bg-[#eef8ce]/[0.3] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="relative z-20">
            <CardTitle>{item.title}</CardTitle>
           
            <CompanyTitle> {item.company}</CompanyTitle>
            <DuractionTitle>{item.duraction}</DuractionTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
      </div>
          </div>

  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full  px-4 py-8   overflow-hidden bg-neutral-800 border  border-[#eef8ce]/[0.3]  relative z-20",
        className
      )}
    >
      <div className=" z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 text-start text-xl font-bold tracking-wide ", className)}>
      {children}
    </h4>
  );
};
export const CompanyTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100/80 font-light text-start text-md tracking-wide ", className)}>
    Intern At {children}
    </h4>
  );
};
export const DuractionTitle = ({
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100/70  text-start absolute top-3 right-4 text-[11px]    ")}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide text-start font-light leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
