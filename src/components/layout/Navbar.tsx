"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WalletConnect } from "./WalletConnect";
import { Plus } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Explore" },
        { href: "/about", label: "Manifesto" },
    ];

    return (
        <header className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[96%] max-w-5xl">
            <div className="glass-pill rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-neon-purple via-blue-500 to-neon-cyan flex items-center justify-center p-[1.5px] shadow-[0_0_12px_rgba(192,132,252,0.35)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-500">
                        <div className="w-full h-full bg-void rounded-full flex items-center justify-center">
                            <span className="text-sm font-black bg-clip-text text-transparent bg-linear-to-br from-neon-cyan to-white">
                                S
                            </span>
                        </div>
                    </div>
                    <span className="font-bold tracking-tight text-white/85 group-hover:text-white transition-colors text-sm hidden sm:block">
                        Shelby<span className="text-neon-cyan font-light">Space</span>
                    </span>
                </Link>

                {/* Nav links */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    isActive
                                        ? "text-white bg-white/8 border border-white/10"
                                        : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                }`}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute inset-0 rounded-full bg-white/6 border border-white/10 -z-10"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <WalletConnect />

                    <Link
                        href="/submit"
                        className="relative group flex items-center gap-1.5 px-4 py-2 rounded-full overflow-hidden text-sm font-bold"
                    >
                        {/* Gradient bg */}
                        <div className="absolute inset-0 bg-linear-to-r from-neon-cyan to-neon-purple" />
                        {/* Hover shine */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <Plus size={13} className="relative z-10 text-void" />
                        <span className="relative z-10 text-void hidden sm:inline">Submit</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
