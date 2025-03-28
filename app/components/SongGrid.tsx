'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Checkbox from './Checkbox';
import { Song } from './Song';
import { RecyclingBin } from './RecyclingBin';
import { useAppContext } from '../AppContext';

interface SongGridProps { }

export const SongGrid: FC<SongGridProps> = () => {
    const {
        snakeOpen,
        playlists,
        setOriginalOrder,
        setRandomOrder,
        isRandom,
        getPlaylistSongs,
    } = useAppContext();

    const [longClickedSongId, setLongClickedSongId] = useState<string | null>(null);
    const playlistId = 'all-songs';
    const songs = getPlaylistSongs(playlistId);


    return (
        <div className='flex flex-col items-center justify-center'>
            {!snakeOpen && (
                <div className='fixed bottom-16 right-0 w-full z-50'>
                    <RecyclingBin />
                </div>
            )}

            <div className='flex gap-4'>
                <Checkbox
                    label="Original"
                    checked={!isRandom[playlistId]}
                    onChange={() => setOriginalOrder(playlistId)}
                />
                <Checkbox
                    label="Random"
                    checked={!!isRandom[playlistId]}
                    onChange={() => setRandomOrder(playlistId)}
                />
            </div>

            <div className="w-full box-border relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 z-10">
                {songs.map((song, index) => (
                    <div
                        key={song.id}
                        className={`relative min-h-32 sm:min-h-44 md:min-h-50 w-full rounded-lg overflow-hidden transition-all duration-300
                            ${longClickedSongId === song.id ? "bg-blue-800/50 border-2 border-blue-400 scale-105" : "bg-white/10 hover:bg-neutral-500"}
                            backdrop-blur-lg`}
                        style={{ boxShadow: "-1px -1px 4px 1px #77777777" }}
                        draggable="true"
                        onMouseDown={(e) => {
                            const timer = setTimeout(() => setLongClickedSongId(song.id), 300);
                            (e.currentTarget as HTMLElement).dataset.timer = String(timer);
                        }}
                        onMouseUp={(e) => {
                            clearTimeout(Number((e.currentTarget as HTMLElement).dataset.timer));
                            setLongClickedSongId(null);
                        }}
                        onDragEnd={() => setLongClickedSongId(null)}
                        onDragStart={(e) => {
                            e.dataTransfer.setData("song", JSON.stringify(song));
                        }}
                    >
                        {song.image && (
                            <div className="absolute inset-0">
                                <Image
                                    src={song.image}
                                    alt={song.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="opacity-40"
                                />
                            </div>
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            <h2 className="text-lg font-semibold text-white p-2 pb-0">{song.title}</h2>
                            {song.url ? (
                                <Song song={song} />
                            ) : (
                                <p className="text-sm text-gray-300 px-2">Coming Soon</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
