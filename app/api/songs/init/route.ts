// app/api/songs/init/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import supabase from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        // We only need file names + MIME types, not the actual file data
        const { audioName, audioType, imageName, imageType } = await req.json();

        if (!audioName || !audioType || !imageName || !imageType) {
            return NextResponse.json(
                { error: "Missing file metadata" },
                { status: 400 }
            );
        }

        // We'll generate a song id now so paths are deterministic
        const id = randomUUID();

        const audioPath = `songs/${id}-${audioName}`;
        const imagePath = `song_images/${id}-${imageName}`;

        // We want to let the browser upload directly to these paths.
        // Supabase Storage supports "upload()" via the client SDK using a service role OR anon key
        // BUT anon key normally cannot write unless you open RLS on the bucket.
        //
        // Two approaches:
        // A. If bucket is public + INSERT allowed for anon (you add policy): the browser can just call supabase.from('songs').upload(...)
        // B. If bucket is locked: you generate signed upload URLs from the server.
        //
        // Supabase Storage does not natively create *signed PUT URLs* via the standard JS client yet in a simple one-liner.
        // Easiest practical path for you right now (and super common):
        // - Make the bucket "authenticated upload allowed".
        // - Use the public anon client in the browser to call `supabase.storage.from('songs').upload(path, file)`
        //
        // We'll return just the paths and you will upload using the PUBLIC supabase client in the browser (not the admin one).

        // Also prep public URLs (what we'll later save in DB)
        const audioPublicUrl = supabase
            .storage
            .from("songs")
            .getPublicUrl(audioPath).data.publicUrl;

        const imagePublicUrl = supabase
            .storage
            .from("songs")
            .getPublicUrl(imagePath).data.publicUrl;

        return NextResponse.json({
            id,
            audioPath,
            imagePath,
            audioPublicUrl,
            imagePublicUrl,
        });
    } catch (err) {
        console.error("init error:", err);
        return NextResponse.json({ error: "Internal" }, { status: 500 });
    }
}
