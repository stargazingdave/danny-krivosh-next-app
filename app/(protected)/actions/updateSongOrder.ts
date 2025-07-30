"use server";

import supabase from "@/lib/supabaseAdmin";

export async function updateSongOrder(idsInOrder: string[]) {
    for (let index = 0; index < idsInOrder.length; index++) {
        const id = idsInOrder[index];
        const { error } = await supabase
            .from("songs")
            .update({ order: index })
            .eq("id", id);

        if (error) throw error;
    }
}
