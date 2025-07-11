"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import Image from "next/image";
import emailjs from "emailjs-com";

export function SignupFormDemo() {
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    emailjs
      .sendForm(
        "service_jucjgyy",    // Replace with your EmailJS service ID
        "template_c3emmmc",   // Replace with your EmailJS template ID
        form,
        "Qd37QzeAOkIsPkmQV"   // Replace with your EmailJS public key
      )
      .then(
        () => {
          setStatus("success");
          form.reset();
        },
        () => {
          setStatus("error");
        }
      );
  };

  return (
    <div className="shadow-input relative flex flex-row gap-5 w-full rounded-none md:rounded-2xl md:p-8 dark:bg-neutral-800">
      <div className="z-30 w-full">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Contact Me
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Let’s connect — I’d love to hear about your project or opportunity!
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" name="firstname" placeholder="John" type="text" required />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" name="lastname" placeholder="Doe" type="text" required />
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="+91 9876543210" type="tel" required />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" placeholder="john.doe@example.com" type="email" required />
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              name="message"
              placeholder="Write your message here..."
              type="text"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm text-black dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Send &rarr;
            <BottomGradient />
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md bg-[#eef8ce] text-neutral-900  animate-fade-in">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Message sent successfully!</span>
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-fade-in">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed to send message. Please try again.</span>
          </div>
        )}
      </div>

      <Image
        src="/image/bg.png"
        alt="Background"
        width={600}
        height={600}
        className="z-10 absolute top-0 left-0 w-full h-full"
        priority
      />
    </div>
  );
}

// Subcomponents
const BottomGradient = () => (
  <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#eef8ce] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);