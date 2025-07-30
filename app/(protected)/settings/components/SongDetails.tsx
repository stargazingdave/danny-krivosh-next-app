'use client';

import { useEffect, useState } from 'react';
import type { SongData } from '@/app/types/SongData';

export function SongDetails({ song }: { song: SongData }) {
    const [lyricsText, setLyricsText] = useState<string | null>(null);

    useEffect(() => {
        if (song.lyrics) {
            fetch(song.lyrics)
                .then((res) => res.text())
                .then(setLyricsText)
                .catch(() => setLyricsText('Failed to load lyrics.'));
        } else {
            setLyricsText(null);
        }
    }, [song.lyrics, song]);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{song.title}</h2>
            {song.image && <img src={song.image} className="w-full max-w-sm rounded" />}
            <audio controls src={song.url} className="w-full" />
            {song.description && <p className="text-gray-300">{song.description}</p>}
            {song.genres?.length && song.genres.length > 0 && (
                <p className="text-sm text-gray-400">Genres: {song.genres.join(', ')}</p>
            )}
            {song.definition && (
                <p className="text-sm text-gray-400">Definition: {song.definition.toUpperCase()}</p>
            )}
            {lyricsText ? (
                <pre className="whitespace-pre-wrap bg-white/5 p-4 rounded text-sm text-gray-300">
                    {lyricsText}
                </pre>
            ) : (
                <p className="text-sm text-gray-500 italic">No lyrics available.</p>
            )}
        </div>
    );
}
