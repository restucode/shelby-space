import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@aptos-labs/ts-sdk", "@shelby-protocol/sdk", "got", "aptos", "@telegram-apps/bridge"],
};

export default nextConfig;
