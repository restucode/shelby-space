import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { name, creator, description, url, category, blobId } = data;

        if (!blobId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Server-side insertion into Supabase Index
        const { data: inserted, error } = await supabase
            .from('dapps')
            .insert([
                {
                    name,
                    creator,
                    description,
                    url,
                    category,
                    blob_id: blobId,  // Snake case in DB usually
                    is_approved: false, // Explicitly set to false pending admin review
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: inserted });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const adminMode = searchParams.get('admin') === 'true';
        const authHeader = req.headers.get('authorization');

        // Simple security: check for a secret token if requesting admin mode
        const isAdminAuthorized = authHeader === `Bearer ${process.env.ADMIN_SECRET}`;

        let query = supabase.from('dapps').select('*');

        // Only filter by approved if not in admin mode, OR if admin mode was requested but unauthorized
        if (!adminMode || !isAdminAuthorized) {
            query = query.eq('is_approved', true);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Map snake_case database schema to camelCase frontend schema
        const mappedData = data?.map(d => ({
            id: d.id,
            name: d.name,
            creator: d.creator,
            description: d.description,
            url: d.url,
            category: d.category,
            blobId: d.blob_id,
            is_approved: d.is_approved,
            blobHash: d.blob_hash,
            imageUrl: d.image_url,
            createdAt: d.created_at
        })) || [];

        return NextResponse.json({ dapps: mappedData });
    } catch (err: any) {
        if (err.message && typeof err.message === 'string' && err.message.includes("fetch failed")) {
            console.warn("⚠️ Local Network Block Detected: Returning MOCK data to unblock UI.");
            return NextResponse.json({
                dapps: [
                    {
                        id: "mock-1",
                        name: "Neon Swap (Mock)",
                        creator: "Shelby Builder",
                        description: "Dummy data karena firewall PC/VPN memblokir koneksi server (Node.js) ke Supabase. Matikan VPN/Kaspersky agar data asli muncul.",
                        url: "https://shelby.xyz",
                        category: "DeFi",
                        blobId: "0xMockData...",
                        is_approved: true,
                        createdAt: new Date().toISOString()
                    }
                ]
            });
        }
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        const { id, is_approved } = data;
        const authHeader = req.headers.get('authorization');

        // Verify simple admin secret
        if (!process.env.ADMIN_SECRET || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: updated, error } = await supabase
            .from('dapps')
            .update({ is_approved })
            .eq('id', id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: updated });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
