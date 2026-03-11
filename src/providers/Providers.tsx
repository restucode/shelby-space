"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";


export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    // Shelby SDK authentication:
    //
    // 1. RPC uploads (putBlob / multipart)  → requires a Shelby API key (format: AG-***)
    //    Get it from: geomi.dev → "API Resource" card → Shelbynet → "client key"
    //    Set as: NEXT_PUBLIC_SHELBY_API_KEY
    //
    // 2. Indexer (GraphQL getBlobs check)   → requires an Aptos Labs API key
    //    Get it from: build.aptoslabs.com → Create Project → API Keys
    //    Set as: NEXT_PUBLIC_APTOS_API_KEY
    //    The indexer.apiKey override takes priority over config.apiKey for indexer requests.
    //
    // Summary of what each key does in SDK internals:
    //   config.apiKey        → shared between RPC client AND indexer (as fallback)
    //   config.indexer.apiKey → ONLY for indexer GraphQL, overrides config.apiKey there
    const shelbyApiKey = process.env.NEXT_PUBLIC_SHELBY_API_KEY;    // AG-*** from geomi.dev
    const aptosLabsApiKey = process.env.NEXT_PUBLIC_APTOS_API_KEY;  // aptoslabs_*** from build.aptoslabs.com

    const [shelbyClient] = useState(() => new ShelbyClient({
        network: Network.SHELBYNET,
        // Top-level apiKey → used by ShelbyRPCClient for all upload requests
        ...(shelbyApiKey ? { apiKey: shelbyApiKey } : {}),
        // indexer.apiKey → overrides apiKey specifically for the GraphQL indexer endpoint
        ...(aptosLabsApiKey ? { indexer: { apiKey: aptosLabsApiKey } } : {}),
    }));

    return (
        <AptosWalletAdapterProvider autoConnect={true} optInWallets={["Petra"]}>
            <QueryClientProvider client={queryClient}>
                <ShelbyClientProvider client={shelbyClient}>
                    {children}
                </ShelbyClientProvider>
            </QueryClientProvider>
        </AptosWalletAdapterProvider>
    );
}
