'use server';

import supabase from '@/lib/supabaseAdmin';
import { SongData } from '@/app/types/SongData';

export async function getAllSongs(): Promise<SongData[]> {
    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching songs:', error);
        return [];
    }

    return data.map((song) => ({
        id: song.id,
        title: song.title,
        description: song.description,
        genres: song.genres,
        definition: song.definition,
        url: song.audio_url,
        image: song.image_url,
        lyrics: song.lyrics,
        createdAt: song.created_at,
    }));
}
