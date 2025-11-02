import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/clients/supabaseAdmin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "100mb",
    },
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const genresStr = formData.get("genres") as string | null;
        const definition = formData.get("definition") as string | null;
        const lyrics = formData.get("lyrics") as string | null;
        const audio = formData.get("audio") as File | null;
        const image = formData.get("image") as File | null;

        // ✅ Validation
        if (!title || !audio || !image)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        if (!audio.type.startsWith("audio/"))
            return NextResponse.json({ error: "Invalid audio file" }, { status: 400 });

        if (!image.type.startsWith("image/"))
            return NextResponse.json({ error: "Invalid image file" }, { status: 400 });

        const genres = genresStr
            ? genresStr.split(",").map((g) => g.trim()).filter(Boolean)
            : [];

        const id = randomUUID();
        const uploads: Promise<any>[] = [];

        // 🎵 Upload audio
        const audioPath = `songs/${id}-${audio.name}`;
        uploads.push(
            supabase.storage.from("songs").upload(audioPath, await audio.arrayBuffer(), {
                contentType: audio.type,
            })
        );

        // 🖼 Upload image
        const imagePath = `song_images/${id}-${image.name}`;
        uploads.push(
            supabase.storage.from("songs").upload(imagePath, await image.arrayBuffer(), {
                contentType: image.type,
            })
        );

        await Promise.all(uploads);

        const audioUrl = supabase.storage.from("songs").getPublicUrl(audioPath).data.publicUrl;
        const imageUrl = supabase.storage.from("songs").getPublicUrl(imagePath).data.publicUrl;

        // 🧮 Determine new order
        const { data: maxData } = await supabase
            .from("songs")
            .select("order")
            .order("order", { ascending: false })
            .limit(1);

        const maxOrder = maxData?.[0]?.order ?? 0;

        // 💾 Insert into DB
        const { error: insertError } = await supabase.from("songs").insert({
            id,
            title,
            description,
            genres,
            definition,
            audio_url: audioUrl,
            image_url: imageUrl,
            lyrics,
            order: maxOrder + 1,
        });

        if (insertError)
            return NextResponse.json({ error: insertError.message }, { status: 500 });

        return NextResponse.json({ success: true, id, audioUrl, imageUrl });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
