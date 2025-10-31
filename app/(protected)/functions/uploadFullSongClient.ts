'use client';

import { createClient } from '@supabase/supabase-js';
import { finalizeSongUpload } from '../actions/finalizeSongUpload';
import { initSongUpload } from '../actions/initSongUpload';

/**
 * Full flow from the client:
 * 1) Ask server for signed upload tokens/paths
 * 2) Upload files to those signed URLs
 * 3) Tell server to insert the DB row
 */
export async function uploadFullSongClient({
    title,
    description,
    genres,
    definition,
    lyrics,
    audioFile,
    imageFile,
}: {
    title: string;
    description: string;
    genres: string;
    definition: string;
    lyrics: string;
    audioFile: File;
    imageFile: File;
}) {
    // 1) Get signed upload tokens from server
    const initRes = await initSongUpload({
        audioName: audioFile.name,
        audioType: audioFile.type || 'application/octet-stream',
        imageName: imageFile.name,
        imageType: imageFile.type || 'application/octet-stream',
    });

    const {
        songId,
        audio: { path: audioPath, token: audioToken, contentType: audioContentType, publicUrl: audioPublicUrl },
        image: { path: imagePath, token: imageToken, contentType: imageContentType, publicUrl: imagePublicUrl },
    } = initRes;

    // 2) Upload using the *client* Supabase with ANON key
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Audio
    {
        const { error } = await supabase.storage
            .from('songs')
            .uploadToSignedUrl(audioPath, audioToken, audioFile, { contentType: audioContentType });
        if (error) {
            console.error('uploadToSignedUrl(audio) error:', error);
            throw new Error('Audio upload failed');
        }
    }

    // Image
    {
        const { error } = await supabase.storage
            .from('songs')
            .uploadToSignedUrl(imagePath, imageToken, imageFile, { contentType: imageContentType });
        if (error) {
            console.error('uploadToSignedUrl(image) error:', error);
            throw new Error('Image upload failed');
        }
    }

    // 3) Finalize in DB (uses server-side service role)
    const res = await finalizeSongUpload({
        songId,
        title,
        description,
        genres,
        definition,
        lyrics,
        audioUrl: audioPublicUrl,
        imageUrl: imagePublicUrl,
    });

    return res; // { success: true, id, ... }
}
