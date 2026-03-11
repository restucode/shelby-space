"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Shield, RefreshCw, Lock, CheckCircle2, Clock, Layers, AlertTriangle } from "lucide-react";
import { DappMetadata } from "@/components/dapps/DappCard";

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved">("all");
    const queryClient = useQueryClient();

    const { data: dapps = [], isLoading, isError, refetch } = useQuery<DappMetadata[]>({
        queryKey: ["admin-dapps"],
        queryFn: async () => {
            const res = await fetch("/api/dapps?admin=true", {
                headers: { Authorization: `Bearer ${password}` },
            });
            if (!res.ok) throw new Error("Unauthorized or failed to fetch");
            const data = await res.json();
            return data.dapps || [];
        },
        enabled: isAuthenticated,
        retry: false,
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true);
        setTimeout(() => refetch(), 100);
    };

    const toggleApprove = useMutation({
        mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
            const res = await fetch("/api/dapps", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${password}`,
                },
                body: JSON.stringify({ id, is_approved }),
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-dapps"] });
            queryClient.invalidateQueries({ queryKey: ["dapps"] });
        },
    });

    const pending = dapps.filter((d) => !d.is_approved);
    const approved = dapps.filter((d) => d.is_approved);
    const filtered =
        filterStatus === "pending" ? pending : filterStatus === "approved" ? approved : dapps;

    /* ─── LOGIN SCREEN ─── */
    if (!isAuthenticated || isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-neon-purple/5 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mb-5 mx-auto">
                            <Shield size={22} className="text-neon-cyan" />
                        </div>
                        <h1 className="text-xl font-bold text-white text-center mb-1">Admin Access</h1>
                        <p className="text-xs text-gray-600 text-center mb-7">Enter your admin secret to continue</p>

                        {isError && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4">
                                <AlertTriangle size={13} className="text-red-400 shrink-0" />
                                <p className="text-red-400 text-xs">Invalid secret or connection error.</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-3">
                            <input
                                type="password"
                                placeholder="Enter admin secret..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-void-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-cyan/40 transition-colors placeholder:text-gray-700"
                            />
                            <button
                                type="submit"
                                className="w-full bg-white/90 hover:bg-white text-void font-bold py-3 rounded-xl transition-colors text-sm"
                            >
                                Unlock Dashboard
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ─── DASHBOARD ─── */
    return (
        <div className="flex flex-col gap-6 pb-20 pt-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-black text-neon-purple uppercase tracking-widest mb-1">Admin</p>
                    <h1 className="text-2xl font-black text-white tracking-tight">DApp Curation</h1>
                    <p className="text-gray-600 text-sm mt-1">Review and approve DApp submissions</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="p-2.5 rounded-xl bg-void-lighter/80 border border-white/8 text-gray-500 hover:text-white hover:border-white/15 transition-all"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => { setIsAuthenticated(false); setPassword(""); }}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-void-lighter/80 hover:bg-red-500/10 border border-white/8 hover:border-red-500/20 rounded-xl text-xs text-gray-500 hover:text-red-400 transition-all font-medium"
                    >
                        <Lock size={12} /> Lock
                    </button>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total", value: dapps.length, icon: Layers, color: "text-gray-300", bg: "bg-white/5", border: "border-white/10" },
                    { label: "Pending", value: pending.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/8", border: "border-amber-500/15" },
                    { label: "Approved", value: approved.length, icon: CheckCircle2, color: "text-neon-green", bg: "bg-green-500/8", border: "border-green-500/15" },
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass-panel rounded-xl p-4 border ${stat.border} ${stat.bg} flex flex-col gap-1`}
                    >
                        <div className="flex items-center gap-1.5">
                            <stat.icon size={12} className={stat.color} />
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {(["all", "pending", "approved"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilterStatus(f)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all capitalize ${
                            filterStatus === f
                                ? "bg-white/10 border-white/20 text-white"
                                : "bg-transparent border-white/8 text-gray-600 hover:text-gray-400 hover:border-white/15"
                        }`}
                    >
                        {f === "all" ? `All (${dapps.length})` : f === "pending" ? `Pending (${pending.length})` : `Approved (${approved.length})`}
                    </button>
                ))}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <RefreshCw className="text-neon-cyan animate-spin" size={24} />
                </div>
            ) : (
                <div className="glass-panel rounded-2xl border border-white/8 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center text-gray-600 text-sm">
                            No DApps in this filter.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] text-gray-600 uppercase tracking-widest">
                                        <th className="px-5 py-3.5 font-bold">DApp</th>
                                        <th className="px-5 py-3.5 font-bold hidden md:table-cell">Category</th>
                                        <th className="px-5 py-3.5 font-bold hidden lg:table-cell">Blob Reference</th>
                                        <th className="px-5 py-3.5 font-bold">Status</th>
                                        <th className="px-5 py-3.5 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filtered.map((dapp) => (
                                            <motion.tr
                                                key={dapp.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-white text-sm leading-tight">{dapp.name}</div>
                                                    <div className="text-[11px] text-gray-600 mt-0.5">by {dapp.creator}</div>
                                                </td>
                                                <td className="px-5 py-4 hidden md:table-cell">
                                                    <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                                                        {dapp.category}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 hidden lg:table-cell">
                                                    <code className="text-[10px] text-neon-cyan/70 font-mono max-w-40 block truncate">
                                                        {dapp.blobId}
                                                    </code>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {dapp.is_approved ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/15 uppercase tracking-wide">
                                                            <Check size={10} /> Live
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/15 uppercase tracking-wide">
                                                            <Clock size={10} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    {!dapp.is_approved ? (
                                                        <button
                                                            onClick={() => toggleApprove.mutate({ id: dapp.id, is_approved: true })}
                                                            disabled={toggleApprove.isPending}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 rounded-lg border border-green-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                                                        >
                                                            <Check size={11} /> Approve
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => toggleApprove.mutate({ id: dapp.id, is_approved: false })}
                                                            disabled={toggleApprove.isPending}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                                                        >
                                                            <X size={11} /> Revoke
                                                        </button>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
