'use client';

import { useState, useEffect } from 'react';
import AddSongForm from './components/AddSongForm';
import { logout } from '../actions/login';
import { SongData } from '@/app/types/SongData';
import { getAllSongs } from '../../../server/functions/getAllSongs'; // you’ll create this
import { updateSongOrder } from '../actions/updateSongOrder';
import { motion } from "motion/react";
import SongEditForm from './components/SongEditForm';

export default function SongManager() {
    const [songs, setSongs] = useState<SongData[]>([]);
    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [orderChanged, setOrderChanged] = useState(false);
    const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
    const [previousOrder, setPreviousOrder] = useState<SongData[] | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const selectedSong = songs.find((s) => s.id === selectedSongId);

    useEffect(() => {
        const fetchSongs = async () => {
            const all = await getAllSongs();
            setSongs(all);
        };
        fetchSongs();
    }, []);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id);
        setPreviousOrder(songs); // for undo
    };

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId || draggedId === targetId) return;

        const draggedIndex = songs.findIndex((s) => s.id === draggedId);
        const targetIndex = songs.findIndex((s) => s.id === targetId);
        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;

        const reordered = [...songs];
        const [moved] = reordered.splice(draggedIndex, 1);
        reordered.splice(targetIndex, 0, moved);

        setSongs(reordered);
        setDragOverId(targetId);
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedId) return;

        setDraggedId(null);
        setDragOverId(null);
        setOrderChanged(true);

        setSaving("saving");
        updateSongOrder(songs.map((s) => s.id)).then(() => {
            setSaving("saved");
            setTimeout(() => setSaving("idle"), 1000);
            setOrderChanged(false);
        });
    };

    return (
        <div className="h-full w-full flex flex-col overflow-auto bg-black text-white">
            <div className="w-full flex justify-end px-6 py-2">
                <button
                    onClick={logout}
                    className="bg-white/10 px-4 py-1 rounded hover:bg-white/20 transition text-sm"
                >
                    Log Out
                </button>
                {saving === "saving" && <p className="text-xs text-yellow-400">Saving...</p>}
                {saving === "saved" && <p className="text-xs text-green-500">Saved!</p>}
                {orderChanged && (
                    <button
                        onClick={() => {
                            if (previousOrder) {
                                setSongs(previousOrder);
                                setOrderChanged(false);
                                setSaving("idle");
                            }
                        }}
                        className="text-xs text-red-400 hover:underline mt-1"
                    >
                        Undo
                    </button>
                )}
            </div>

            <div className="flex w-full h-[calc(100vh-13rem)] overflow-hidden border-t border-white/10">
                {/* Sidebar */}
                <aside className="w-80 shrink-0 border-r border-white/10 bg-white/5 p-4 flex flex-col gap-4">
                    <button
                        onClick={() => {
                            setSelectedSongId(null);
                            setAdding(true);
                        }}
                        className="w-full py-2 bg-amber-800 rounded hover:bg-amber-700 transition"
                    >
                        + Add Song
                    </button>

                    <div className="flex flex-col gap-2 overflow-y-auto">
                        {songs.map((song, index) => (
                            <motion.div
                                key={song.id}
                                layout="position"
                                transition={{ easing: "ease-in-out", duration: 0.25 }}
                                onDragOver={(e) => handleDragOver(e, song.id)}
                                onDrop={(e) => handleDrop(e, song.id)}
                                onClick={() => {
                                    setSelectedSongId(song.id);
                                    setAdding(false);
                                }}
                                className={`flex items-center gap-3 p-2 rounded hover:bg-white/10 transition
                                    ${selectedSongId === song.id ? 'bg-white/10' : ''}
                                    ${draggedId === song.id ? 'opacity-50' : ''}
                                    ${dragOverId === song.id ? 'border-t-2 border-amber-500' : ''}`}
                            >
                                {/* DRAG HANDLE */}
                                <div
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, song.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="cursor-grab active:cursor-grabbing text-lg px-2 select-none"
                                    title="Drag to reorder"
                                >
                                    ☰
                                </div>

                                {/* IMAGE */}
                                <img
                                    src={song.image || '/placeholder.jpg'}
                                    alt={song.title}
                                    className="w-12 h-12 rounded object-cover bg-white/10"
                                />

                                {/* DETAILS */}
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-medium truncate">{song.title}</span>
                                    <div className="flex gap-2 mt-1 text-xs text-gray-400">
                                        <span>{song.genres?.join(', ')}</span>
                                        {song.definition && (
                                            <span className="text-amber-500">{song.definition.toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-full flex-1 p-6 overflow-y-auto">
                    {adding && (
                        <div className="w-full max-w-2xl">
                            <h2 className="text-xl font-bold mb-4">Add New Song</h2>
                            <AddSongForm onUpload={() => {
                                setAdding(false);
                                setSelectedSongId(null);
                                getAllSongs().then(setSongs);
                            }} />
                        </div>
                    )}

                    {selectedSong && (
                        <div className="max-w-2xl">
                            <SongEditForm
                                song={selectedSong}
                                onUpdated={() => {
                                    setSelectedSongId(null);
                                    getAllSongs().then(setSongs);
                                }}
                            />
                        </div>
                    )}

                    {!adding && !selectedSong && (
                        <div className="text-gray-500 italic">Select a song or click “Add Song”</div>
                    )}
                </main>
            </div>
        </div>
    );
}
