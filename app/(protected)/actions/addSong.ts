'use server';

import supabase from '@/lib/supabaseAdmin';
import { randomUUID } from 'crypto';

export async function addSong(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const genres = (formData.get('genres') as string)?.split(',').map(g => g.trim());
    const definition = formData.get('definition') as string;
    const lyrics = formData.get('lyrics') as string;


    const audio = formData.get('audio') as File;
    const image = formData.get('image') as File | null;

    const id = randomUUID();
    const uploads = [];

    // Upload audio
    const audioPath = `songs/${id}-${audio.name}`;
    uploads.push(
        supabase.storage.from('songs').upload(audioPath, await audio.arrayBuffer(), {
            contentType: audio.type,
        })
    );

    // Upload image
    let imageUrl = '';
    if (image) {
        const imagePath = `song_images/${id}-${image.name}`;
        uploads.push(
            supabase.storage.from('songs').upload(imagePath, await image.arrayBuffer(), {
                contentType: image.type,
            })
        );
        imageUrl = supabase.storage.from('songs').getPublicUrl(imagePath).data.publicUrl;
    }

    await Promise.all(uploads);

    const audioUrl = supabase.storage.from('songs').getPublicUrl(audioPath).data.publicUrl;

    const { data: maxData } = await supabase
        .from('songs')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

    const maxOrder = maxData?.[0]?.order ?? 0;

    await supabase.from('songs').insert({
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
}
