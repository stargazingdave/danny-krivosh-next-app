'use client';

import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Checkbox from './Checkbox';
import { Song } from './Song';
import { RecyclingBin } from './RecyclingBin';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { SongData } from '../types/SongData';

const isTouchDevice = () => typeof window !== 'undefined' && 'ontouchstart' in window;

export const SongGrid: FC = () => {
    const {
        snakeOpen,
        setOriginalOrder,
        setRandomOrder,
        isRandom,
        getPlaylistSongs,
        addSongToRecycle,
    } = useAppContext();

    const gridRef = useRef<HTMLDivElement | null>(null);
    const [isDraggingOverRecycleBin, setIsDraggingOverRecycleBin] = useState(false);
    const [touchGhost, setTouchGhost] = useState<{ x: number; y: number; song: SongData } | null>(null);
    const touchGhostRef = useRef<HTMLDivElement | null>(null);
    const [dragReady, setDragReady] = useState(false);
    const dragTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();

            const touch = e.touches[0];
            setTouchGhost(prev => prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null);
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            const isOverRecycle = dropTarget?.id === 'recycle-bin-dropzone' || dropTarget?.closest('#recycle-bin-dropzone');

            setIsDraggingOverRecycleBin(!!isOverRecycle);
        };

        el.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            el.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const playlistId = 'all-songs';
    const songs = getPlaylistSongs(playlistId);

    const [longClickedSongId, setLongClickedSongId] = useState<string | null>(null);
    const [shuffleKey, setShuffleKey] = useState(0);
    const [shuffling, setShuffling] = useState(false);
    const shuffleOffsetsRef = useRef<Record<string, { rotate: number; x: number; y: number }>>({});

    const handleShuffle = () => {
        const newOffsets: typeof shuffleOffsetsRef.current = {};
        songs.forEach(song => {
            newOffsets[song.id] = {
                rotate: Math.random() * 10 - 5,
                x: Math.random() * 10 - 5,
                y: Math.random() * 10 - 5,
            };
        });
        shuffleOffsetsRef.current = newOffsets;

        setShuffling(true);
        setShuffleKey(prev => prev + 1);
        setRandomOrder(playlistId);
        setTimeout(() => setShuffling(false), 500);
    };

    const touchPosition = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, song: SongData) => {
        const x = e.touches[0].clientX;
        const y = e.touches[0].clientY;

        // Wait a moment before setting drag state
        dragTimer.current = setTimeout(() => {
            setDragReady(true);
            setTouchGhost({ x, y, song });
            setLongClickedSongId(song.id);
        }, 200); // long press threshold
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>, song: SongData) => {
        if (dragTimer.current) {
            clearTimeout(dragTimer.current);
            dragTimer.current = null;
        }

        if (dragReady) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            const isOverRecycleBin =
                dropTarget?.id === 'recycle-bin-dropzone' || dropTarget?.closest('#recycle-bin-dropzone');

            if (isOverRecycleBin && song.url) {
                addSongToRecycle(song);
            }
        }

        setDragReady(false);
        setTouchGhost(null);
        setIsDraggingOverRecycleBin(false);
        setLongClickedSongId(null);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {!snakeOpen && (
                <div className="fixed bottom-16 right-0 w-full z-50 pointer-events-none">
                    <div className="pointer-events-auto w-fit">
                        <RecyclingBin isTouchDraggedOver={isDraggingOverRecycleBin} />
                    </div>
                </div>
            )}

            <div className="flex gap-4 sm:hidden">
                <Checkbox
                    label="Original"
                    checked={!isRandom[playlistId]}
                    onChange={() => setOriginalOrder(playlistId)}
                />
                <Checkbox
                    label="Random"
                    checked={!!isRandom[playlistId]}
                    onChange={handleShuffle}
                />
            </div>

            <div
                className="w-full box-border relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 z-10"
                ref={gridRef}
            >
                <AnimatePresence mode="popLayout">
                    {songs.map((song, index) => {
                        const offset = shuffleOffsetsRef.current[song.id] ?? {
                            rotate: 0,
                            x: 0,
                            y: 0,
                        };

                        return (
                            <div
                                key={`${song.id}-${shuffleKey}`}
                                draggable
                                onDragStart={e => {
                                    if (!isTouchDevice()) {
                                        song.url && e.dataTransfer.setData('song', JSON.stringify(song));
                                        e.currentTarget.classList.add('opacity-50', 'scale-105');
                                    }
                                }}
                                onDragEnd={e => {
                                    if (!isTouchDevice()) {
                                        e.currentTarget.classList.remove('opacity-50', 'scale-105');
                                        setLongClickedSongId(null);
                                        touchPosition.current = null;
                                    }
                                }}
                                onTouchStart={e => handleTouchStart(e, song)}
                                onTouchEnd={e => handleTouchEnd(e, song)}
                                onMouseDown={e => {
                                    if (!isTouchDevice()) {
                                        const timer = setTimeout(() => setLongClickedSongId(song.id), 300);
                                        (e.currentTarget as HTMLElement).dataset.timer = String(timer);
                                    }
                                }}
                                onMouseUp={e => {
                                    if (!isTouchDevice()) {
                                        clearTimeout(Number((e.currentTarget as HTMLElement).dataset.timer));
                                        setLongClickedSongId(null);
                                    }
                                }}
                            >
                                <motion.div
                                    layout
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        rotate: shuffling ? offset.rotate : 0,
                                        x: shuffling ? offset.x : 0,
                                        y: shuffling ? offset.y : 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.015,
                                        easing: 'ease-in-out',
                                    }}
                                    className={`relative h-36 w-full rounded-lg overflow-hidden backdrop-blur-lg shadow-md transition-all duration-200 ${longClickedSongId === song.id
                                        ? 'bg-blue-800/50 border-2 border-blue-400 scale-105'
                                        : 'bg-white/10 hover:bg-neutral-500'
                                        }`}
                                    style={{ boxShadow: '-1px -1px 4px 1px #77777777' }}
                                >
                                    {song.image && (
                                        <div className="absolute inset-0">
                                            <Image
                                                src={song.image}
                                                alt={song.title}
                                                fill
                                                objectFit="cover"
                                                className="opacity-40"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <div className="relative z-10 flex flex-col h-full">
                                        <h2 className="text-lg font-semibold text-white p-2 pb-0">
                                            {song.title}
                                        </h2>
                                        {song.url ? (
                                            <Song song={song} />
                                        ) : (
                                            <p className="text-sm text-gray-300 px-2">Coming Soon</p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </AnimatePresence>
                {touchGhost && (
                    <div
                        ref={touchGhostRef}
                        className="fixed pointer-events-none z-50"
                        style={{
                            top: touchGhost.y - 40,
                            left: touchGhost.x - 80,
                            width: 160,
                            opacity: 0.7,
                            transform: 'scale(0.9)',
                            transition: 'transform 0.1s ease',
                        }}
                    >
                        <div className="rounded-lg overflow-hidden bg-white/20 backdrop-blur-md shadow-md border border-white/30">
                            <div className="relative h-20 w-full">
                                {touchGhost.song.image && (
                                    <Image
                                        src={touchGhost.song.image}
                                        alt={touchGhost.song.title}
                                        fill
                                        className="object-cover opacity-40"
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center px-2 text-white text-sm text-center z-10">
                                    {touchGhost.song.title}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
