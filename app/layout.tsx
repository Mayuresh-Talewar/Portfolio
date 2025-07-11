import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingDock } from "@/comnponents/ui/floating-dock";
import Footer from "@/comnponents/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mayuresh's Portfolio",
  description: "Mayuresh's Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      
      <div className="flex sticky top-5  items-center z-50 justify-center w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
       
      />
    </div>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
      </html>
    
      
      <Footer/>

    </>
  );
}
