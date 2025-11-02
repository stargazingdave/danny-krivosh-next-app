'use server';

import supabaseAdmin from '@/lib/supabase/clients/supabaseAdmin';

export async function finalizeSongUpload(params: {
    songId: string;
    title: string;
    description: string;
    genres: string; // raw comma string from form
    definition: string;
    lyrics: string;
    audioUrl: string;
    imageUrl: string;
}) {
    const {
        songId,
        title,
        description,
        genres,
        definition,
        lyrics,
        audioUrl,
        imageUrl,
    } = params;

    // server-side validation
    if (!songId || !title || !audioUrl || !imageUrl) {
        throw new Error('Missing required fields');
    }

    // normalize genres to array like your old code
    const genresArr = genres
        ? genres
            .split(',')
            .map(g => g.trim())
            .filter(Boolean)
        : [];

    // get max order
    const { data: maxData, error: maxErr } = await supabaseAdmin
        .from('songs')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

    if (maxErr) {
        console.error('order fetch error:', maxErr);
        throw new Error('Failed to compute next order');
    }

    const maxOrder = maxData?.[0]?.order ?? 0;

    const { error: insertErr } = await supabaseAdmin.from('songs').insert({
        id: songId,
        title,
        description,
        genres: genresArr,
        definition,
        audio_url: audioUrl,
        image_url: imageUrl,
        lyrics,
        order: maxOrder + 1,
    });

    if (insertErr) {
        console.error('insert song error:', insertErr);
        throw new Error('Failed to insert song');
    }

    return {
        success: true,
        id: songId,
        audioUrl,
        imageUrl,
    };
}
