'use client'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

function About() {
  return (
    <section className="w-full flex flex-col md:flex-row justify-center md:gap-10 min-h-screen h-full px-3 py-10">
      
      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-fit flex h-full items-start justify-center"
      >
        <div className="w-full mb-10 md:pb-0 rounded-lg relative bg-neutral-800 drop-shadow-[0px_1px_5px_#eef8ce] sm:h-72 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
          <Image
            src="/image/Mayuresh-photo.png"
            alt="Mayuresh Talewar photo"
            width={600}
            height={600}
            className="z-50 object-cover w-full h-full"
            priority
          />
          <Image
            src="/image/bg.png"
            alt="Background"
            width={600}
            height={600}
            className="z-10 absolute top-0 left-0 w-full h-full"
            priority
          />
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="w-full max-w-[800px] md:mt-5 px-2 sm:px-5 h-full md:pt-10 flex flex-col gap-4 items-center justify-start tracking-wide"
      >
        <div className="flex flex-col items-start justify-start gap-2 h-full border-b-2 pb-5 border-[#eef8ce]">
          <h1 className="sm:text-2xl text-lg text-[#eef8ce]">Who am I?</h1>
          <p className="text-white sm:text-4xl text-xl leading-8 sm:leading-12 font-semibold">
            I'm Mayuresh Talewar, a Full Stack Developer (MERN Stack).
          </p>
          <p className="text-white text-sm sm:text-base font-thin sm:leading-8 leading-6">
            I build fast, scalable web apps using MongoDB, Express, React, and Node.js. I've worked on platforms for farmers and businesses, and I’m skilled in REST APIs, JWT, Tailwind CSS, and Redux. I enjoy writing reusable components, optimizing performance, and leading development teams. I'm open to freelance or full-time roles where I can create impactful digital solutions.
          </p>
        </div>

        <div className="w-full py-5 flex flex-col items-center sm:items-start">
  <ul className="text-white w-full grid grid-cols-1 sm:grid-cols-2 text-sm sm:text-base font-thin sm:leading-8 leading-6 gap-y-4 gap-x-8">
    <li className="flex flex-row gap-2"><strong>Name:</strong> Mayuresh Talewar</li>
    <li className="flex flex-row gap-2"><strong>From:</strong> Nagpur, Maharashtra, India</li>
    <li className="flex flex-row gap-2"><strong>Age:</strong> 23</li>
    <li className="flex flex-row gap-2"><strong>Email:</strong> mtalewar2002@gmail.com</li>
  </ul>

  <div className="w-full flex justify-start ">
    <button className="bg-[#eef8ce] text-black cursor-pointer px-6 py-2 mt-8 text-lg rounded-[2px] hover:bg-[#dbe8a5] transition">
      Contact Me
    </button>
  </div>
</div>

      </motion.div>
    </section>
  )
}

export default About
