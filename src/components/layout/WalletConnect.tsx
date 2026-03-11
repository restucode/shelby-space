"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, LogOut, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export function WalletConnect() {
    const { account, connected, connect, disconnect, wallets } = useWallet();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    // Only run standard mounting trick for hydration errors if needed
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative z-50">
            {!connected ? (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                        try {
                            const targetWallet = wallets?.find((w) => w.name.includes("Petra")) || wallets?.[0];
                            if (targetWallet) {
                                // If ready state is NotDetected, suggest installing
                                if (targetWallet.readyState === "NotDetected") {
                                    alert("Petra Wallet extension is not installed or not detected. Please install Petra Wallet to connect.");
                                    window.open("https://petra.app/", "_blank");
                                    return;
                                }
                                await connect(targetWallet.name);
                            } else {
                                alert("No Aptos wallet found. Please install the Petra extension.");
                            }
                        } catch (error) {
                            console.error("Failed to connect wallet:", error);
                            alert("Connection rejected or failed. Please try again.");
                        }
                    }}
                    className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all duration-300 hover:border-white/20 hover:text-white flex items-center gap-2"
                >
                    <Wallet size={16} />
                    <span>Connect Wallet</span>
                </motion.button>
            ) : (
                <>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleDropdown}
                        className="px-4 py-2 rounded-md bg-gradient-to-r gap-2 from-void-lighter to-void border border-neon-cyan/30 text-sm font-medium transition-all duration-300 hover:border-neon-cyan/60 hover:text-white flex items-center shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span>
                            {account?.address?.toString().slice(0, 6)}...{account?.address?.toString().slice(-4)}
                        </span>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/10 shadow-xl overflow-hidden py-1"
                            >
                                <div className="px-4 py-3 border-b border-white/5">
                                    <p className="text-xs text-gray-400">Connected to</p>
                                    <p className="text-sm font-semibold text-white truncate max-w-full">
                                        Petra Wallet
                                    </p>
                                </div>

                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            if (account?.address) {
                                                navigator.clipboard.writeText(account.address.toString());
                                            }
                                            setIsOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors rounded-lg"
                                    >
                                        <Copy size={16} /> Copy Address
                                    </button>
                                    <button
                                        onClick={() => {
                                            disconnect();
                                            setIsOpen(false);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors rounded-lg"
                                    >
                                        <LogOut size={16} /> Disconnect
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}
