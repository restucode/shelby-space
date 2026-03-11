"use client";

import { motion } from "framer-motion";
import { DappCard, DappMetadata } from "@/components/dapps/DappCard";
import { useQuery } from "@tanstack/react-query";
import { Search, Layers, Zap, Database, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES = ["All", "DeFi", "NFT / Identity", "Social", "Infrastructure", "Tooling", "Gaming", "Bridge"];

const CATEGORY_ACTIVE: Record<string, string> = {
    "DeFi": "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
    "NFT / Identity": "text-neon-purple border-neon-purple/40 bg-neon-purple/10",
    "Social": "text-pink-400 border-pink-400/40 bg-pink-400/10",
    "Infrastructure": "text-blue-400 border-blue-400/40 bg-blue-400/10",
    "Tooling": "text-amber-400 border-amber-400/40 bg-amber-400/10",
    "Gaming": "text-green-400 border-green-400/40 bg-green-400/10",
    "Bridge": "text-orange-400 border-orange-400/40 bg-orange-400/10",
};

export default function Home() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const { data: dapps = [], isLoading } = useQuery<DappMetadata[]>({
        queryKey: ["dapps"],
        queryFn: async () => {
            const res = await fetch("/api/dapps");
            if (!res.ok) throw new Error("Failed to fetch dapps");
            const data = await res.json();
            return data.dapps || [];
        },
    });

    const filteredDapps = dapps.filter((dapp) => {
        const matchesSearch =
            dapp.name.toLowerCase().includes(search.toLowerCase()) ||
            dapp.description?.toLowerCase().includes(search.toLowerCase()) ||
            dapp.creator?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || dapp.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const totalApproved = dapps.length;
    const categoryCount = new Set(dapps.map((d) => d.category)).size;

    return (
        <div className="flex flex-col gap-0 pb-24">

            {/* ─────────────────── HERO ─────────────────── */}
            <section className="pt-20 pb-16 md:pt-28 md:pb-20 flex flex-col items-center justify-center text-center relative overflow-hidden">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-neon-purple/12 blur-[140px] rounded-full pointer-events-none -z-10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent" />

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/25 bg-neon-cyan/5 text-neon-cyan text-[10px] font-black tracking-widest uppercase mb-8 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    Shelby Network · Decentralized Storage
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05] relative z-10 mb-5"
                >
                    The{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-neon-cyan via-neon-blue to-neon-purple">
                        Ecosystem
                    </span>
                    <br className="hidden md:block" />
                    {" "}Hub
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-base md:text-lg text-gray-500 max-w-xl font-light leading-relaxed px-4 mb-10"
                >
                    Discover DApps built on the Shelby network. Every listing is{" "}
                    <span className="text-gray-300 font-medium">permanently verified on-chain</span> via erasure coding.
                </motion.p>

                {/* Search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="w-full max-w-md relative group z-10"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-void-lighter/60 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3.5 group-focus-within:border-white/20 transition-all">
                        <Search className="text-gray-600 mr-3 shrink-0" size={17} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search DApps, creators, categories..."
                            className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600 text-sm"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-gray-600 hover:text-white transition-colors text-xs ml-2"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Live stats */}
                {!isLoading && totalApproved > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-5 mt-8 text-xs text-gray-600"
                    >
                        <div className="flex items-center gap-1.5">
                            <Layers size={11} className="text-neon-cyan" />
                            <span>
                                <b className="text-gray-300">{totalApproved}</b> DApps Listed
                            </span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <Database size={11} className="text-neon-purple" />
                            <span>
                                <b className="text-gray-300">{categoryCount}</b> Categories
                            </span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-1.5">
                            <Zap size={11} className="text-amber-400" />
                            <span>Shelby Testnet</span>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* ─────────────────── HOW IT WORKS ─────────────────── */}
            <section className="relative py-16 px-4 max-w-5xl mx-auto w-full">
                <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/4 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <p className="text-[10px] font-black text-neon-purple uppercase tracking-widest mb-1.5">Protocol</p>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            How it{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan">
                                Works
                            </span>
                        </h2>
                    </div>
                    <Link
                        href="/about"
                        className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors font-medium group mb-1"
                    >
                        Learn more{" "}
                        <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            step: "01",
                            title: "Connect Wallet",
                            desc: "Link your Aptos Petra wallet. No email, no account — your wallet is your identity.",
                            icon: "🔗",
                        },
                        {
                            step: "02",
                            title: "Build Manifest",
                            desc: "Fill in your DApp metadata. We auto-generate a structured JSON schema ready for on-chain storage.",
                            icon: "📝",
                        },
                        {
                            step: "03",
                            title: "Deploy to Shelby",
                            desc: "One-click erasure coding. Your manifest is permanently etched on-chain and verified forever.",
                            icon: "🚀",
                        },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="relative glass-panel p-6 rounded-2xl group hover:border-white/15 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute -bottom-4 -right-2 text-[90px] font-black text-white/[0.025] select-none leading-none">
                                {item.step}
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-void/80 border border-white/10 flex items-center justify-center text-xl group-hover:border-white/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">
                                        Step {item.step}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─────────────────── DIRECTORY ─────────────────── */}
            <section className="flex flex-col gap-5 relative z-10 max-w-7xl mx-auto w-full px-4 pt-4">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <p className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-1">On-chain verified</p>
                        <h2 className="text-2xl font-black text-white tracking-tight">Explore Directory</h2>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-void-lighter/80 border border-white/8 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                        {filteredDapps.length} result{filteredDapps.length !== 1 ? "s" : ""}
                    </div>
                </motion.div>

                {/* Category filter tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 ${
                                activeCategory === cat
                                    ? cat === "All"
                                        ? "bg-white/10 border-white/20 text-white"
                                        : CATEGORY_ACTIVE[cat] ?? "bg-white/10 border-white/20 text-white"
                                    : "bg-transparent border-white/8 text-gray-600 hover:border-white/15 hover:text-gray-400"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[270px] glass-panel rounded-2xl overflow-hidden border border-white/5 animate-pulse"
                            >
                                <div className="h-28 bg-white/3" />
                                <div className="p-5 space-y-3">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-9 h-9 rounded-xl bg-white/8" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3 rounded bg-white/8 w-2/3" />
                                            <div className="h-2.5 rounded bg-white/5 w-1/3" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2.5 rounded bg-white/5 w-full" />
                                        <div className="h-2.5 rounded bg-white/5 w-4/5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredDapps.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredDapps.map((dapp, i) => (
                            <motion.div
                                key={dapp.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                                className="h-full"
                            >
                                <DappCard dapp={dapp} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-20 glass-panel rounded-2xl border border-white/5"
                    >
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-gray-400 font-semibold">No DApps found</p>
                        <p className="text-gray-600 text-sm mt-1">
                            {search
                                ? `No results for "${search}"`
                                : "Be the first to submit a DApp!"}
                        </p>
                        {!search && (
                            <Link
                                href="/submit"
                                className="mt-5 px-5 py-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-bold hover:bg-neon-cyan/15 transition-colors"
                            >
                                Submit Your DApp →
                            </Link>
                        )}
                    </motion.div>
                )}
            </section>
        </div>
    );
}
