import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shelby Space | Web3 DApp Directory",
  description: "A decentralized directory for the Shelby Protocol ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-void text-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <Providers>
          {/* Base Ambient Background */}
          <div className="fixed inset-0 z-[-10] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-void-border via-void to-void"></div>

          {/* Animated Aurora Blobs */}
          <div className="fixed inset-0 z-[-9] overflow-hidden pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-neon-purple/30 blur-[120px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-neon-cyan/20 blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[150px] animate-blob animation-delay-4000"></div>
          </div>

          {/* Noise Texture Overlay */}
          <div className="fixed inset-0 z-[-8] bg-noise pointer-events-none mix-blend-overlay opacity-30"></div>

          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8 mt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
