'use server';

import { randomUUID } from 'crypto';
import supabaseAdmin from '@/lib/supabase/clients/supabaseAdmin';

/**
 * Creates signed *upload* tokens for audio + image in bucket "songs".
 * Tokens are ~2h valid (Supabase default). No expires param supported here.
 */
export async function initSongUpload(args: {
    audioName: string;  // e.g. "track.mp3"
    audioType: string;  // e.g. "audio/mpeg"
    imageName: string;  // e.g. "cover.png"
    imageType: string;  // e.g. "image/png"
}) {
    const { audioName, audioType, imageName, imageType } = args;
    if (!audioName || !audioType || !imageName || !imageType) {
        throw new Error('Missing file metadata');
    }

    const songId = randomUUID();

    // same bucket, different prefixes
    const audioPath = `songs/${songId}-${audioName}`;
    const imagePath = `song_images/${songId}-${imageName}`;

    // ✅ createSignedUploadUrl(path, { upsert })
    const { data: audioSig, error: audioErr } =
        await supabaseAdmin.storage.from('songs').createSignedUploadUrl(audioPath, { upsert: false });
    if (audioErr) {
        console.error('createSignedUploadUrl(audio) error:', audioErr);
        throw new Error('Failed to create audio upload token');
    }

    const { data: imageSig, error: imageErr } =
        await supabaseAdmin.storage.from('songs').createSignedUploadUrl(imagePath, { upsert: false });
    if (imageErr) {
        console.error('createSignedUploadUrl(image) error:', imageErr);
        throw new Error('Failed to create image upload token');
    }

    // Public URLs (work after upload)
    const audioPublicUrl = supabaseAdmin.storage.from('songs').getPublicUrl(audioPath).data.publicUrl;
    const imagePublicUrl = supabaseAdmin.storage.from('songs').getPublicUrl(imagePath).data.publicUrl;

    return {
        songId,
        audio: {
            path: audioPath,
            token: audioSig.token,
            contentType: audioType,
            publicUrl: audioPublicUrl,
        },
        image: {
            path: imagePath,
            token: imageSig.token,
            contentType: imageType,
            publicUrl: imagePublicUrl,
        },
    };
}
