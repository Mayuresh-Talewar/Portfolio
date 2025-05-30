'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface Logo {
    icon: React.ReactNode;
    alt: string;
}

interface InfinityLogoScrollingProps {
    logos: Logo[];
    speed?: number;
}

const InfinityLogoScrolling: React.FC<InfinityLogoScrollingProps> = ({
    logos,
    speed = 20
}) => {
    // Duplicate logos array to create seamless loop
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

    return (
        <div className="w-full    bg-transparent">
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
