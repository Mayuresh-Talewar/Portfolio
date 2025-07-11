"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconHome,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { SignupFormDemo } from "../Contact";
import CustomModal from "../ui/CustomModal";

export const FloatingDock = ({
  desktopClassName,
}: {
  desktopClassName?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-700" />,
      href: "/",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-700" />,
      href: "https://github.com/mayuresh-talewar",
    },
    {
      title: "Contact",
      icon: <MdOutlineConnectWithoutContact className="h-full w-full text-neutral-700" />,
      href: "#",
      onClick: () => setIsModalOpen(true),
    },
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedin className="h-full w-full text-neutral-700" />,
      href: "https://www.linkedin.com/in/mayuresh-talewar/",
    },
  ];

  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
      />
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SignupFormDemo />
      </CustomModal>
    </>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto h-16 items-start gap-4 rounded-2xl backdrop-brightness-60 backdrop-blur-xs px-4 p-3 flex",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          {...item}
        />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const width = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), { mass: 0.1, stiffness: 150, damping: 12 });
  const widthIconSpring = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), { mass: 0.1, stiffness: 150, damping: 12 });
  const heightIconSpring = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center text-black rounded-full dark:bg-[#eef8ce]"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 110, x: "-50%" }}
              animate={{ opacity: 1, y: 140, x: "-50%" }}
              exit={{ opacity: 0, y: 110, x: "-50%" }}
              className="absolute -top-10 left-1/2 w-fit rounded-md border border-[#eef8ce] text-[#eef8ce] px-2 py-0.5 text-xs whitespace-pre dark:bg-neutral-800"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIconSpring, height: heightIconSpring }}
          className="flex items-center justify-center text-black dark:text-neutral-300"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}