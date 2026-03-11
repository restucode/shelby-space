"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export interface DappMetadata {
    id: string;
    name: string;
    creator: string;
    description: string;
    url: string;
    category: string;
    blobId: string;
    blobHash?: string;
    imageUrl?: string;
    is_approved?: boolean;
    createdAt?: string;
}

interface DappCardProps {
    dapp: DappMetadata;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; glow: string; from: string; to: string }> = {
    "DeFi":           { bg: "bg-neon-cyan/10",   text: "text-neon-cyan",   glow: "rgba(34,211,238,0.15)",  from: "#22d3ee", to: "#818cf8" },
    "NFT / Identity": { bg: "bg-neon-purple/10",  text: "text-neon-purple", glow: "rgba(192,132,252,0.15)", from: "#c084fc", to: "#f472b6" },
    "Social":         { bg: "bg-pink-500/10",     text: "text-pink-400",    glow: "rgba(244,114,182,0.15)", from: "#f472b6", to: "#c084fc" },
    "Infrastructure": { bg: "bg-blue-500/10",     text: "text-blue-400",    glow: "rgba(96,165,250,0.15)",  from: "#60a5fa", to: "#818cf8" },
    "Tooling":        { bg: "bg-amber-500/10",    text: "text-amber-400",   glow: "rgba(251,191,36,0.15)",  from: "#fbbf24", to: "#fb923c" },
    "Gaming":         { bg: "bg-green-500/10",    text: "text-green-400",   glow: "rgba(74,222,128,0.15)",  from: "#4ade80", to: "#22d3ee" },
    "Bridge":         { bg: "bg-orange-500/10",   text: "text-orange-400",  glow: "rgba(251,146,60,0.15)",  from: "#fb923c", to: "#fbbf24" },
};

function getCategoryStyle(category: string) {
    return CATEGORY_COLORS[category] ?? { bg: "bg-white/10", text: "text-gray-300", glow: "rgba(255,255,255,0.1)", from: "#ffffff", to: "#aaaaaa" };
}

export function DappCard({ dapp }: DappCardProps) {
    const cat = getCategoryStyle(dapp.category);
    const initials = dapp.name.slice(0, 2).toUpperCase();
    const avatarHue = (dapp.creator.charCodeAt(0) * 53) % 360;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group h-full"
        >
            {/* Outer glow on hover */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none -z-10"
                style={{ background: `radial-gradient(ellipse at center, ${cat.glow} 0%, transparent 70%)` }}
            />

            <div className="relative h-full glass-panel rounded-2xl overflow-hidden border border-white/8 group-hover:border-white/15 transition-all duration-500">

                {/* Header gradient band */}
                <div className="h-28 relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                        style={{
                            background: `linear-gradient(135deg, ${cat.from}22, ${cat.to}18, transparent)`,
                        }}
                    />
                    {/* Grid dot pattern */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(circle, ${cat.from}33 1px, transparent 1px)`,
                            backgroundSize: "18px 18px",
                        }}
                    />
                    {/* Large initials watermark */}
                    <div
                        className="absolute -right-3 -bottom-4 text-[80px] font-black leading-none select-none opacity-[0.06] group-hover:opacity-[0.1] transition-opacity"
                        style={{ color: cat.from }}
                    >
                        {initials}
                    </div>

                    {/* Pending badge */}
                    {dapp.is_approved === false && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-500/15 text-amber-400 text-[9px] uppercase font-black px-2.5 py-1 rounded-full border border-amber-500/25 backdrop-blur-sm z-10">
                            <Clock size={9} />
                            Pending Review
                        </div>
                    )}

                    {/* Category pill top-right */}
                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[9px] uppercase font-black tracking-wider border border-white/10 ${cat.bg} ${cat.text}`}>
                        {dapp.category}
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-3">
                    {/* Avatar + name */}
                    <div className="flex items-start gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-void shrink-0 shadow-inner"
                            style={{ background: `hsl(${avatarHue}, 65%, 58%)` }}
                        >
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-white text-sm leading-tight line-clamp-1 group-hover:text-glow transition-all">
                                {dapp.name}
                            </h3>
                            <p className="text-[11px] text-gray-600 mt-0.5 truncate">by {dapp.creator}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 min-h-[3.5rem]">
                        {dapp.description}
                    </p>

                    {/* Footer */}
                    <div className="pt-3 mt-auto border-t border-white/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <ShieldCheck size={12} className="text-neon-green shrink-0" />
                            <span
                                className="text-[10px] text-gray-600 font-mono truncate max-w-[80px]"
                                title={dapp.blobId}
                            >
                                {dapp.blobId?.length > 12
                                    ? `${dapp.blobId.slice(0, 6)}…${dapp.blobId.slice(-4)}`
                                    : dapp.blobId}
                            </span>
                        </div>

                        <Link
                            href={dapp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all duration-300 ${cat.bg} ${cat.text} border-current/20 hover:border-current/40`}
                        >
                            Launch <ExternalLink size={10} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
