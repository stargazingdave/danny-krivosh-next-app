'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import Checkbox from './Checkbox';
import { Song } from './Song';
import { RecyclingBin } from './RecyclingBin';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';

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
                <div className='fixed bottom-16 right-0 w-full z-50 pointer-events-none'>
                    <div className='pointer-events-auto w-fit'>
                        <RecyclingBin />
                    </div>
                </div>
            )}

            <div className='flex gap-4 sm:hidden'>
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

            <div className="w-full box-border relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 z-10">
                <AnimatePresence mode="popLayout">
                    {songs.map((song, index) => (
                        <div
                            key={index}
                            draggable="true"
                            onDragStart={(e) => {
                                e.dataTransfer.setData("song", JSON.stringify(song));
                                e.currentTarget.classList.add("opacity-50", "scale-105");
                            }}
                            onDragEnd={(e) => {
                                e.currentTarget.classList.remove("opacity-50", "scale-105");
                                setLongClickedSongId(null);
                            }}
                        >
                            <motion.div suppressHydrationWarning 
                                key={song.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95, rotate: Math.random() * 10 - 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.95, rotate: Math.random() * 10 - 5 }}
                                transition={{ duration: 0.6 }}
                                className="relative h-36 w-full rounded-lg overflow-hidden backdrop-blur-lg shadow-md"
                                style={{ boxShadow: '-1px -1px 4px 1px #77777777' }}
                            >
                                {song.image && (
                                    <div className="absolute inset-0">
                                        <Image
                                            src={song.image}
                                            alt={song.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="opacity-40"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
