"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Database, Zap, ArrowRight, Code2, Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-20 pb-24 max-w-4xl mx-auto pt-10 px-4">

            {/* ─── HERO ─── */}
            <section className="text-center space-y-5 pt-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-purple/25 bg-neon-purple/5 text-neon-purple text-[10px] font-black tracking-widest uppercase"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
                    Manifesto
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight"
                >
                    About{" "}
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-neon-cyan via-neon-blue to-neon-purple">
                        Shelby Space
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 font-light text-lg max-w-xl mx-auto leading-relaxed"
                >
                    Decentralizing discovery. A community-driven directory where every DApp's metadata is
                    immutably stored on the Shelby Protocol — no servers, no gatekeepers.
                </motion.p>
            </section>

            {/* ─── PILLARS ─── */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        icon: ShieldCheck,
                        color: "text-neon-cyan",
                        bg: "bg-neon-cyan/10 border-neon-cyan/15",
                        title: "Verifiable",
                        desc: "Every submission triggers an on-chain transaction. The resulting Blob ID is permanent, immutable proof of listing.",
                        delay: 0.1,
                    },
                    {
                        icon: Database,
                        color: "text-neon-purple",
                        bg: "bg-neon-purple/10 border-neon-purple/15",
                        title: "Decentralized",
                        desc: "The source of truth lives on the Shelby network, not a centralized backend. No single point of failure.",
                        delay: 0.2,
                    },
                    {
                        icon: Zap,
                        color: "text-amber-400",
                        bg: "bg-amber-500/10 border-amber-500/15",
                        title: "Community First",
                        desc: "Anyone with an Aptos wallet can submit. No registration, no gatekeepers — just open-source curation.",
                        delay: 0.3,
                    },
                ].map((item) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: item.delay }}
                        className="glass-panel p-6 rounded-2xl border border-white/8 flex flex-col gap-4 hover:border-white/15 transition-all duration-500"
                    >
                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${item.bg}`}>
                            <item.icon size={20} className={item.color} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <p className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-2">Protocol Flow</p>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        How it Works
                    </h2>
                </motion.div>

                <div className="relative space-y-3">
                    {/* Vertical connector */}
                    <div className="absolute left-4.5 top-8 bottom-8 w-px bg-linear-to-b from-neon-cyan/30 via-neon-purple/30 to-transparent" />

                    {[
                        {
                            icon: Globe,
                            step: "01",
                            title: "Connect via Petra Wallet",
                            desc: "Use Petra or any Aptos-compatible wallet. Your address becomes your identity — no email or password required.",
                        },
                        {
                            icon: Code2,
                            step: "02",
                            title: "Submit DApp Details",
                            desc: "Fill in your project's name, description, category, and URL. We auto-generate a structured JSON manifest.",
                        },
                        {
                            icon: Database,
                            step: "03",
                            title: "Upload to Shelby Network",
                            desc: "Your manifest is erasure-coded and uploaded as Blobs to the Shelby network. This requires a small APT + ShelbyUSD fee.",
                        },
                        {
                            icon: Lock,
                            step: "04",
                            title: "Admin Curation & Indexing",
                            desc: "The Blob ID and metadata are cached in our database for fast search. An admin reviews and approves the listing.",
                        },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.08, duration: 0.4 }}
                            className="flex gap-5 items-start pl-2"
                        >
                            <div className="relative shrink-0 w-9 h-9 rounded-xl bg-void-lighter border border-white/10 flex items-center justify-center z-10">
                                <item.icon size={15} className="text-gray-400" />
                            </div>
                            <div className="glass-panel flex-1 p-4 rounded-xl border border-white/8 hover:border-white/15 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Step {item.step}</span>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── CTA ─── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-panel rounded-2xl p-8 border border-neon-cyan/10 text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-linear-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />
                <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-2">Ready to list your DApp?</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                        Connect your wallet and permanently store your DApp metadata on the Shelby network.
                    </p>
                    <Link
                        href="/submit"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-neon-cyan to-neon-purple text-void font-black text-sm hover:opacity-90 transition-opacity"
                    >
                        Submit Your DApp <ArrowRight size={14} />
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
