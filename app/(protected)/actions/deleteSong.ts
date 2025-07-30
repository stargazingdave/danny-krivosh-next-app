"use server";

import supabase from "@/lib/supabaseAdmin";

export async function deleteSong(filename: string) {
    const { error } = await supabase.storage.from("songs").remove([`songs/${filename}`]);
    if (error) throw error;
}