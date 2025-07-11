"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function CustomModal({ isOpen, onClose, children }: CustomModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 h-full w-full  flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal Content */}
      <div className="relative rounded-lg  w-full  max-w-md mx-auto">
        {children}
        <button
          onClick={onClose}
          className="absolute top-5 z-50 right-6 text-gray-500 hover:text-[#eef8ce] text-3xl"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
}
