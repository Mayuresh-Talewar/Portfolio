import React from 'react'
import Image from 'next/image'
import InfinityLogoScrolling from './ui/InfinityLogoScrolling'
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

function About() {
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
    return (
        <section className='w-full h-full flex flex-col md:flex-row items-start justify-center py-10 overflow-hidden pb-14 -md:ml-10'>
            <div className='max-w-[700px] w-full hidden md:block h-full max-h-[700px]'>
                <Image
                    src="/image/Mayuresh-photo.png"
                    alt="Mayuresh Talewar photo"
                    width={600}
                    height={600}
                    className="rounded-full -mt-10 drop-shadow-[0_1px_5px_#eef8ce] w-[75%] md:w-[600px] mx-auto"
                />

            </div>
            <div className='md:w-1/2 w-full px-5 h-full  md:pt-10 flex flex-col gap-4 items-start justify-end'>
                <div className="flex flex-col gap-2 h-full ">
                    <h1 className=' text-4xl font-bold text-[#eef8ce]'>About Me</h1>
                    <p className='text-white md:text-lg text-sm'>
                        I am a <span className='text-[#eef8ce]'>MERN Stack Developer</span>  with practical experience building fast, user-friendly, and scalable web applications using MongoDB, Express.js, React.js, and
                        Node.js. I’ve worked on multiple real-world projects, delivering clean UI/UX and performance-optimized features that improved user retention and
                        engagement. Skilled in RESTful API integration, reusable component design, and agile teamwork — I thrive in fast-paced startup environments where
                        shipping high-quality features matters.
                    </p>
                </div>

                <div className="flex flex-col w-full gap-2 mt-6 h-full overflow-hidden bg-[#1a1a1a] p-4 rounded-lg shadow-[0_1px_5px_#eef8ce]">
                    <h1 className='text-4xl font-bold text-[#eef8ce]'>Skills</h1>
                    <div className="flex flex-row gap-2">
                        <p className='text-white md:text-lg text-sm'>MongoDB, Express.js, React.js, Node.js, Tailwind CSS, Bootstrap, JavaScript, TypeScript, Git, GitHub.</p>
                    </div>
                    <div className='max-w-[750px] overflow-hidden  md:mt-0 w-full'>
                        <InfinityLogoScrolling logos={logos} speed={30} />
                    </div>
                </div>
               
            </div>
        </section>
    )
}

export default About