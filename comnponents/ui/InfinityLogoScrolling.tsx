'use client'

import React from 'react';
import { motion } from 'framer-motion';
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiNodedotjs,
    SiMongodb,
    SiTailwindcss,
    SiJavascript,
    SiHtml5,
    SiCss3
} from 'react-icons/si';


const logos = [
    {
        icon: <SiReact className="w-12 h-12 text-[#eef8ce] group-hover:text-[#61DAFB] transition-colors duration-300" />,
        alt: "React"
    },
    {
        icon: <SiNextdotjs className="w-12 h-12 text-[#eef8ce] group-hover:text-white transition-colors duration-300" />,
        alt: "Next.js"
    },
    {
        icon: <SiTypescript className="w-12 h-12 text-[#eef8ce] group-hover:text-[#3178C6] transition-colors duration-300" />,
        alt: "TypeScript"
    },
    {
        icon: <SiNodedotjs className="w-12 h-12 text-[#eef8ce] group-hover:text-[#339933] transition-colors duration-300" />,
        alt: "Node.js"
    },
    {
        icon: <SiMongodb className="w-12 h-12 text-[#eef8ce] group-hover:text-[#47A248] transition-colors duration-300" />,
        alt: "MongoDB"
    },
    {
        icon: <SiTailwindcss className="w-12 h-12 text-[#eef8ce] group-hover:text-[#06B6D4] transition-colors duration-300" />,
        alt: "Tailwind CSS"
    },
    {
        icon: <SiJavascript className="w-12 h-12 text-[#eef8ce] group-hover:text-[#F7DF1E] transition-colors duration-300" />,
        alt: "JavaScript"
    },
    {
        icon: <SiHtml5 className="w-12 h-12 text-[#eef8ce] group-hover:text-[#E34F26] transition-colors duration-300" />,
        alt: "HTML5"
    },
    {
        icon: <SiCss3 className="w-12 h-12 text-[#eef8ce] group-hover:text-[#1572B6] transition-colors duration-300" />,
        alt: "CSS3"
    }
];



interface InfinityLogoScrollingProps {
    speed?: number;
}

const InfinityLogoScrolling: React.FC<InfinityLogoScrollingProps> = ({
    speed = 20
}) => {
    // Duplicate logos array to create seamless loop
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <div className="w-full backdrop-blur-md   bg-transparent">
            <motion.div
                className="flex gap-12 "
                animate={{
                    x: [0, -50 * logos.length],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <div
                        key={`${logo.alt}-${index}`}
                        className="flex items-center justify-center min-w-[60px]"
                    >
                        <div className="relative w-12 h-12 group hover:scale-110 transition-transform  duration-300">
                            {logo.icon}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default InfinityLogoScrolling;
