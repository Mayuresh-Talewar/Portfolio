"use client";
import React, { useState } from "react";
import CustomModal from "./ui/CustomModal";
import { SignupFormDemo } from "./Contact";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <footer className="w-full bg-neutral-900 text-white py-6 px-4 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Text */}
        <span className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Mayuresh Talewar. All rights reserved.
        </span>

        {/* Socials + Contact */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mayuresh-talewar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#eef8ce] transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/mayuresh-talewar-06242223a/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#eef8ce] transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          
          <a
            href="mailto:mtalewar2002@gmail.com"
            className="hover:text-[#eef8ce] transition-colors"
            aria-label="Email"
          >
            <FaEnvelope size={20} />
          </a>
          <button
            onClick={() => setModalIsOpen(true)}
            className="ml-2 text-sm underline underline-offset-2 hover:text-[#eef8ce] transition-colors"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <CustomModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <SignupFormDemo />
      </CustomModal>
    </footer>
  );
};

export default Footer;
