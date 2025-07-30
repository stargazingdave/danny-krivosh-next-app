"use server";

import supabase from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function uploadSong(formData: FormData) {
    const file = formData.get("file") as File;

    if (!file || !file.name) return;

    const arrayBuffer = await file.arrayBuffer();
    const filename = file.name;

    const { error } = await supabase.storage
        .from("songs")
        .upload(filename, arrayBuffer, {
            contentType: file.type,
            upsert: true,
        });

    if (error) throw error;

    revalidatePath("/dashboard");
}
