'use server';

import supabase from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

export async function updateSong(formData: FormData, songId: string) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const genres = (formData.get('genres') as string)?.split(',').map(g => g.trim());
    const definition = formData.get('definition') as string;
    const lyrics = formData.get('lyrics') as string;

    const audio = formData.get('audio') as File | null;
    const image = formData.get('image') as File | null;

    const updates: any = {
        title,
        description,
        genres,
        definition,
        lyrics,
    };

    if (audio) {
        const audioPath = `songs/${songId}-${randomUUID()}-${audio.name}`;
        await supabase.storage.from('songs').upload(audioPath, await audio.arrayBuffer(), {
            contentType: audio.type,
            upsert: true,
        });
        const audioUrl = supabase.storage.from('songs').getPublicUrl(audioPath).data.publicUrl;
        updates.audio_url = audioUrl;
    }

    if (image) {
        const imagePath = `song_images/${songId}-${randomUUID()}-${image.name}`;
        await supabase.storage.from('songs').upload(imagePath, await image.arrayBuffer(), {
            contentType: image.type,
            upsert: true,
        });
        const imageUrl = supabase.storage.from('songs').getPublicUrl(imagePath).data.publicUrl;
        updates.image_url = imageUrl;
    }

    const { error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', songId);

    if (error) throw error;
}
