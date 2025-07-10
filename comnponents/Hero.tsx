'use client'
import React from 'react'
import { ContainerTextFlip } from '@/comnponents/ui/container-text-flip'
import DownloadPDFButton from './ui/DownloadPDFButton';
import CopyEmailButton from './ui/CopyEmailButton';
import InfinityLogoScrolling from './ui/InfinityLogoScrolling';
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

const ROLES: string[] = [
    "Mern Stack Developer",
    "Full Stack Developer",
    "React.js Developer",
    "Node.js Developer"
];

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

const Hero: React.FC = () => {
    return (
        <section className="flex flex-col items-center justify-center w-full  min-h-screen ">
            {/* <TypewriterEffect  words={words} />
           */}
            <div className='flex flex-col items-start justify-center text-start w-full  max-w-screen gap-4 '>
                <div className="flex flex-col sm:flex-row items-start sm:items-center md:pl-5 gap-2 sm:gap-3">
                    <h1 className='text-white text-2xl md:text-5xl font-bold'>Hi There!</h1>
                </div>
                <div className="md:pl-5 w-full flex  md:flex-row flex-col md:gap-3  group-hover:text-[#61DAFB] transition-colors duration-300">
                  <p className='md:text-8xl text-4xl text-start font-black text-white'>I am </p><ContainerTextFlip words={ROLES} />
                </div>
                <p className='text-white text-sm sm:text-base md:ml-5  w-full max-w-[800px]'>
                    Turning ideas into responsive, fast, and scalable digital products using React, Node, and MongoDB.
                </p>
                <div className="flex flex-col h-full w-full md:flex-row items-center justify-start gap-5 pt-4 md:pl-5 sm:gap-3">
                    <div className="flex flex-row w-full max-w-[350px] items-center justify-between md:mr-10">

                        <DownloadPDFButton />
                        <CopyEmailButton />

                    </div>
                    <div className='max-w-[750px] overflow-hidden  md:mt-0 mt-4 w-full'>
                        <InfinityLogoScrolling logos={logos} speed={30} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero

