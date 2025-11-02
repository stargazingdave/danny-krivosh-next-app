'use client';

import { upload } from '@vercel/blob/client';
import { finalizeSongUpload } from '../actions/finalizeSongUpload';

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
    if (!audioFile || !imageFile) throw new Error('Audio and image are required');

    const songId = crypto.randomUUID();

    // AUDIO
    const audioBlob = await upload(`${songId}-${audioFile.name}`, audioFile, {
        access: 'public',
        handleUploadUrl: '/api/vercel/blob',
        multipart: true,
        contentType: audioFile.type || 'application/octet-stream',
        dir: 'songs',
        allowedContentTypes: ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm'],
        clientPayload: JSON.stringify({ kind: 'audio', songId }),
    } as any);

    // IMAGE
    const imageBlob = await upload(`${songId}-${imageFile.name}`, imageFile, {
        access: 'public',
        handleUploadUrl: '/api/vercel/blob',
        multipart: true,
        contentType: imageFile.type || 'application/octet-stream',
        dir: 'song_images',
        allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp'],
        clientPayload: JSON.stringify({ kind: 'image', songId }),
    } as any);

    // Finalize in DB (same action you already have)
    return await finalizeSongUpload({
        songId,
        title,
        description,
        genres,
        definition,
        lyrics,
        audioUrl: audioBlob.url,
        imageUrl: imageBlob.url,
    });
}
