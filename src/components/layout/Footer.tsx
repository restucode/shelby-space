import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-linear-to-tr from-neon-purple to-neon-cyan flex items-center justify-center">
                            <span className="text-[10px] font-black text-void">S</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-500">
                            Shelby<span className="text-neon-cyan font-light">Space</span>
                        </span>
                        <span className="text-gray-700 text-xs hidden sm:inline">— Decentralized DApp Directory</span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-5 text-xs text-gray-600">
                        <Link href="/" className="hover:text-gray-300 transition-colors">Explore</Link>
                        <Link href="/submit" className="hover:text-gray-300 transition-colors">Submit</Link>
                        <Link href="/about" className="hover:text-gray-300 transition-colors">Manifesto</Link>
                        <a
                            href="https://docs.shelby.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-gray-300 transition-colors"
                        >
                            Shelby Docs <ExternalLink size={10} />
                        </a>
                    </nav>

                    {/* Network badge */}
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-700 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                        Shelby Testnet
                    </div>
                </div>
            </div>
        </footer>
    );
}
