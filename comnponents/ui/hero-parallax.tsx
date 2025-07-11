"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import Image from "next/image";


const products = [
    {
      title: "Shadow Monarchs Code Review",
      link: "https://shadow-monarchs-code-review-frontend.onrender.com/",
      thumbnail:
        "/image/Shadow Monarch's Code Review.png",
    },
    {
      title: "Sk-Filmproduction - (Mr. Shahrukh Khan)",
      link: "https://www.skfilmproductions.co.uk/",
      thumbnail:
        "/image/Sk-Filmproduction.png",
    },
    {
      title: "Technology Agriculture Creater - (Sahil R. Vaidya)",
      link: "https://technologyagriculturecreater.com/",
      thumbnail:
        "/image/Technology Agriculture Creater.png",
    },
   
    {
      title: "Get Epoxy Floor Solution",
      link: "https://www.getepoxy.in/",
      thumbnail:
        "/image/Get Epoxy Floor Solutions.png",
    },
    {
      title: "Urhan Treaders - (Mr. Shahrukh Khan)",
      link: "https://import-export-mayuresh.netlify.app/",
      thumbnail:
        "/image/Urhan Treaders Website.png",
    },
    {
      title: "RoboMeet",
      link: "https://superlative-mayuresh-robomeet.netlify.app/",
      thumbnail:
        "/image/RoboMeet.png",
    }
   
  ];
export const HeroParallax = () => {
  const firstRows = products.slice(0, 3);
  const firstRow = [...firstRows,... firstRows];
  const secondRows = products.slice(3, 6);
  const secondRow = [...secondRows, ...secondRows];
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.05, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-400, 100]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="max-h-[200vh] h-full w-full  pb-40   antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse  space-x-5 mb-15">
          {firstRow.map((product,index) => (
            <ProductCard
              product={product}
              translate={translateX}
 key={`${product.title}-${index}`}

            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-5 ">
          {secondRow.map((product,index) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
 key={`${product.title}-${index}`}
            />
          ))}
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl  mx-auto py-10  text-center flex flex-wrap flex-col md:py-32 px-2 sm:px-4 w-full ">
   <h1 className="text-5xl  md:text-7xl w-full leading-18 font-bold dark:text-white ">
  Featured  Work
</h1>
<p className="text-wrap  max-w-[1000px] w-full  mx-auto  text-center  text-sm sm:text-base md:text-xl font-light mt-4 sm:mt-6 md:mt-8 dark:text-white">
  Explore a collection of projects I've built using modern technologies like React, Node.js, MongoDB, and more. From scalable web apps to intuitive user interfaces, each project reflects my passion for clean, functional, and impactful development.
</p>

  </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 rounded-lg  "
    >
      <a
        href={product.link}
        target="_blank"
        className="block group-hover/product:shadow-2xl "
      >
  {/* Custom color overlay (e.g., yellow) */}
  {/* <div className="absolute inset-0 bg-[#eef8ce] z-10 opacity-80 group-hover/product:opacity-0 transition-opacity duration-500"></div> */}

  {/* Image */}
  <Image
    src={product.thumbnail}
    height={600}
    width={600}
    alt={product.title}
    className="object-cover object-left-top absolute h-full w-full inset-0 z-0 mix-blend-multiply "
  />

      </a>
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-neutral-600 via-[#eef8ce] to-neutral-600 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-50 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none transition-opacity duration-500 z-30">
</div>

      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white z-40 ">
        {product.title}
      </h2>
    </motion.div>
  );
};
