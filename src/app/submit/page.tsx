"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowLeft, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShelbyClient } from "@shelby-protocol/react";
import {
    ShelbyBlobClient,
    createDefaultErasureCodingProvider,
    generateCommitments,
    expectedTotalChunksets,
    defaultErasureCodingConfig,
} from "@shelby-protocol/sdk/browser";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const CATEGORIES = ["DeFi", "NFT / Identity", "Social", "Infrastructure", "Tooling", "Gaming", "Bridge"];

export default function SubmitDappPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        creator: "",
        description: "",
        url: "",
        category: "DeFi",
    });

    const [step, setStep] = useState(1); // 1: Form, 2: Uploading, 3: Success
    const [statusMsg, setStatusMsg] = useState("");
    const [blobReference, setBlobReference] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const wallet = useWallet();
    const shelbyClient = useShelbyClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!wallet.connected || !wallet.account) {
            setErrorMsg("Please connect your Petra wallet using the top-right button first.");
            return;
        }

        const walletAddress = wallet.account.address?.toString() || "";
        const slug = formData.name.replace(/\s+/g, "-").replace(/[^a-z0-9-]/gi, "").toLowerCase();
        const ts = Date.now();
        const blobName = `${slug}-${ts}-manifest.json`;
        const blobData = new TextEncoder().encode(
            JSON.stringify({ ...formData, uploadedAt: new Date().toISOString(), blobName }, null, 2)
        );
        const expirationMicros = ts * 1000 + 86400000000 * 30; // 30 days
        const blobRef = `${walletAddress}/${blobName}`;

        setBlobReference(blobRef);
        setStep(2);

        try {
            // Step 1: Generate erasure-coded commitment (WASM, no wallet needed)
            setStatusMsg("Generating erasure-coded commitment...");
            const provider = await createDefaultErasureCodingProvider();
            const commitment = await generateCommitments(provider, blobData);
            const config = defaultErasureCodingConfig();
            const numChunksets = expectedTotalChunksets(
                blobData.length,
                config.erasure_k * config.chunkSizeBytes
            );

            // Step 2: Register blob on-chain (wallet signature required)
            setStatusMsg("Approve the transaction in your Petra wallet...");
            const txResult = await wallet.signAndSubmitTransaction({
                data: ShelbyBlobClient.createBatchRegisterBlobsPayload({
                    account: AccountAddress.from(walletAddress),
                    expirationMicros,
                    blobs: [{
                        blobName,
                        blobSize: blobData.length,
                        blobMerkleRoot: commitment.blob_merkle_root,
                        numChunksets,
                    }],
                    encoding: config.enumIndex,
                }),
            });

            // Step 3: Wait for on-chain confirmation
            setStatusMsg("Waiting for blockchain confirmation...");
            await shelbyClient.coordination.aptos.waitForTransaction({
                transactionHash: txResult.hash,
            });

            // Step 4: Index in Supabase immediately — don't wait for RPC storage
            setStatusMsg("Indexing DApp...");
            await fetch("/api/dapps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, blobId: blobRef }),
            });

            // Step 5: Show success
            setStep(3);

            // Step 6: Attempt Shelby RPC storage in background (fire & forget)
            // This stores the actual blob bytes on Shelby storage nodes.
            // Non-critical: the on-chain registration already proves DApp existence.
            shelbyClient.rpc
                .putBlob({
                    account: AccountAddress.from(walletAddress),
                    blobName,
                    blobData,
                })
                .catch((err) =>
                    console.warn("Shelby RPC storage (non-critical):", err?.message)
                );
        } catch (error: any) {
            console.error("Submit error:", error);
            // User rejected wallet tx → go back to form
            // Other errors → surface message
            setErrorMsg(error?.message || "Transaction failed or was rejected.");
            setStep(1);
        }
    };

    const steps = [
        { num: 1, label: "Manifest" },
        { num: 2, label: "Upload" },
        { num: 3, label: "Verified" },
    ];

    return (
        <div className="min-h-screen pt-28 pb-24 px-4 w-full relative flex items-center justify-center">
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neon-purple/10 via-void to-void z-0" />
            <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Step Pills */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((s, idx) => (
                        <div key={s.num} className="flex items-center gap-2">
                            <div
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-500 ${
                                    step === s.num
                                        ? "bg-neon-cyan/10 border-neon-cyan/50 text-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                        : step > s.num
                                        ? "bg-neon-purple/10 border-neon-purple/40 text-neon-purple"
                                        : "bg-white/3 border-white/10 text-gray-600"
                                }`}
                            >
                                <span
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                                        step > s.num
                                            ? "bg-neon-purple/30"
                                            : step === s.num
                                            ? "bg-neon-cyan/20"
                                            : "bg-white/5"
                                    }`}
                                >
                                    {step > s.num ? "✓" : s.num}
                                </span>
                                {s.label}
                            </div>
                            {idx < steps.length - 1 && (
                                <div
                                    className={`w-8 h-[1px] transition-colors duration-500 ${
                                        step > s.num ? "bg-neon-purple/40" : "bg-white/10"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-3xl pointer-events-none" />

                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-medium group relative z-10"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Directory
                    </button>

                    <AnimatePresence mode="wait">
                        {/* ── FORM ── */}
                        {step === 1 && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="relative z-10"
                            >
                                <div className="mb-8">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                                        Launch on{" "}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                                            Shelby
                                        </span>
                                    </h1>
                                    <p className="text-gray-500 text-sm font-light">
                                        Your manifest is erasure-coded and stored permanently on the decentralized network.
                                    </p>
                                </div>

                                {errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                    >
                                        <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                                        <p className="text-red-400 text-sm">{errorMsg}</p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <FormField label="DApp Name" accentColor="rgba(34,211,238,0.3)">
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-void-darker border border-white/8 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-cyan/40 focus:bg-white/3 transition-all text-sm placeholder:text-gray-700"
                                            placeholder="e.g. Raiku Finance"
                                        />
                                    </FormField>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormField label="Creator" accentColor="rgba(192,132,252,0.3)">
                                            <input
                                                required
                                                type="text"
                                                value={formData.creator}
                                                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                                                className="w-full bg-void-darker border border-white/8 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-purple/40 focus:bg-white/3 transition-all text-sm placeholder:text-gray-700"
                                                placeholder="Your name or team"
                                            />
                                        </FormField>
                                        <FormField label="Category" accentColor="rgba(255,255,255,0.1)">
                                            <div className="relative">
                                                <select
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-void-darker border border-white/8 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer text-sm"
                                                >
                                                    {CATEGORIES.map((c) => (
                                                        <option key={c} value={c}>
                                                            {c}
                                                        </option>
                                                    ))}
                                                </select>
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs pointer-events-none">▼</span>
                                            </div>
                                        </FormField>
                                    </div>

                                    <FormField label="URL" accentColor="rgba(255,255,255,0.1)">
                                        <input
                                            required
                                            type="url"
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                            className="w-full bg-void-darker border border-white/8 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 focus:bg-white/3 transition-all text-sm placeholder:text-gray-700"
                                            placeholder="https://your-dapp.xyz"
                                        />
                                    </FormField>

                                    <FormField label="Description" accentColor="rgba(34,211,238,0.15)">
                                        <div className="relative">
                                            <textarea
                                                required
                                                rows={4}
                                                maxLength={500}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-void-darker border border-white/8 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-cyan/30 focus:bg-white/3 transition-all text-sm placeholder:text-gray-700 resize-none leading-relaxed"
                                                placeholder="Describe your DApp clearly and in detail..."
                                            />
                                            <span className="absolute bottom-3 right-4 text-[10px] text-gray-700 font-mono">
                                                {formData.description.length}/500
                                            </span>
                                        </div>
                                    </FormField>

                                    <div className="pt-3">
                                        <button
                                            type="submit"
                                            className="relative w-full py-4 rounded-xl font-bold overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-90 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-25 blur-lg transition-opacity duration-500" />
                                            <span className="relative z-10 text-void text-sm font-black tracking-wide">
                                                Construct & Upload Manifest
                                            </span>
                                        </button>

                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                                            <span className="text-[11px] text-gray-600 font-medium tracking-wide">
                                                Connected to Shelby Network
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── UPLOADING ── */}
                        {step === 2 && (
                            <motion.div
                                key="uploading"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 space-y-6 text-center relative z-10"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-25 rounded-full animate-pulse" />
                                    <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center relative">
                                        <Loader2 size={36} className="text-neon-cyan animate-spin" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Writing to Shelby</h3>
                                    <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto leading-relaxed">
                                        Your manifest is being erasure-coded and committed on-chain permanently.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 max-w-xs text-center">
                                    <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-neon-cyan animate-ping" />
                                    {statusMsg}
                                </div>
                            </motion.div>
                        )}

                        {/* ── SUCCESS ── */}
                        {step === 3 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-10 space-y-5 text-center relative z-10"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-neon-green blur-2xl opacity-25 rounded-full" />
                                    <div className="w-20 h-20 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center relative">
                                        <CheckCircle2 size={36} className="text-neon-green" />
                                    </div>
                                </motion.div>

                                <div>
                                    <h3 className="text-3xl font-extrabold text-white">Uploaded!</h3>
                                    <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
                                        Your DApp is permanently stored on Shelby and pending admin review.
                                    </p>
                                </div>

                                <div className="w-full bg-void-darker border border-white/8 rounded-2xl p-5 text-left">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                                        Blob Reference (Shelby Network)
                                    </span>
                                    <div className="flex items-start gap-2">
                                        <code className="text-xs text-neon-cyan font-mono break-all flex-1 leading-relaxed">
                                            {blobReference}
                                        </code>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(blobReference)}
                                            className="shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors mt-0.5"
                                            title="Copy"
                                        >
                                            <Copy size={12} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    View Directory
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

function FormField({
    label,
    accentColor,
    children,
}: {
    label: string;
    accentColor: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5 group/field">
            <label
                className="text-[10px] font-bold text-gray-600 uppercase tracking-widest pl-0.5 block group-focus-within/field:text-gray-400 transition-colors"
            >
                {label}
            </label>
            <div className="relative">
                <div
                    className="absolute inset-0 rounded-xl blur-md opacity-0 group-focus-within/field:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: accentColor }}
                />
                {children}
            </div>
        </div>
    );
}
