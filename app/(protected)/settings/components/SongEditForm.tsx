'use client';

import { useState, FormEvent, useEffect } from 'react';
import { SongData } from '@/app/types/SongData';
import { updateSong } from '../../actions/updateSong';

interface SongEditFormProps {
    song: SongData;
    onUpdated?: () => void;
}

export default function SongEditForm({ song, onUpdated }: SongEditFormProps) {
    const [title, setTitle] = useState(song.title);
    const [description, setDescription] = useState(song.description || '');
    const [genres, setGenres] = useState((song.genres || []).join(', '));
    const [definition, setDefinition] = useState<'hd' | '-'>(song.definition || '-');
    const [lyrics, setLyrics] = useState(song.lyrics || '');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setTitle(song.title);
        setDescription(song.description || '');
        setGenres((song.genres || []).join(', '));
        setDefinition(song.definition || '-');
        setLyrics(song.lyrics || '');
        setAudioFile(null);
        setImageFile(null);
    }, [song]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title) {
            alert('Title is required');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('genres', genres);
        formData.append('definition', definition);
        formData.append('lyrics', lyrics);

        if (audioFile) formData.append('audio', audioFile);
        if (imageFile) formData.append('image', imageFile);

        await updateSong(formData, song.id);
        alert('Song updated!');
        onUpdated?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
            {/* Title */}
            <div>
                <label className="block text-sm mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-white/20 rounded bg-white/10"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 resize-none"
                />
            </div>

            {/* Genres */}
            <div>
                <label className="block text-sm mb-1">Genres (comma separated)</label>
                <input
                    type="text"
                    value={genres}
                    onChange={(e) => setGenres(e.target.value)}
                    className="w-full px-4 py-2 border border-white/20 rounded bg-white/10"
                />
            </div>

            {/* Definition */}
            <div>
                <label className="block text-sm mb-1">HD</label>
                <select
                    value={definition}
                    onChange={(e) => setDefinition(e.target.value as 'hd' | '-')}
                    className="w-full px-4 py-2 border border-white/20 rounded bg-white/10"
                >
                    <option className='bg-black/80 text-white' value="hd">HD</option>
                    <option className='bg-black/80 text-white' value="-">-</option>
                </select>
            </div>

            {/* Lyrics */}
            <div>
                <label className="block text-sm mb-1">Lyrics</label>
                <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-2 border border-white/20 rounded bg-white/10 resize-y"
                />
            </div>

            {/* Files */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm mb-1">Audio File (replace optional)</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-white bg-white/10 rounded file:bg-amber-800 file:text-white file:border-0 file:px-3 file:py-1.5 file:rounded hover:file:bg-amber-700 cursor-pointer"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Image (replace optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-white bg-white/10 rounded file:bg-amber-800 file:text-white file:border-0 file:px-3 file:py-1.5 file:rounded hover:file:bg-amber-700 cursor-pointer"
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="bg-amber-800 px-6 py-2 rounded text-white hover:bg-amber-700 transition"
            >
                Save Changes
            </button>
        </form>
    );
}
