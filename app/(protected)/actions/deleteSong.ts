"use server";

import supabase from "@/lib/supabase/clients/supabaseAdmin";

export async function deleteSong(filename: string) {
    const { error } = await supabase.storage.from("songs").remove([`songs/${filename}`]);
    if (error) throw error;
}