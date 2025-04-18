'use client';

import { FC, useRef, useState } from 'react';
import Image from 'next/image';
import Checkbox from './Checkbox';
import { Song } from './Song';
import { RecyclingBin } from './RecyclingBin';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { SongData } from '../types/SongData';

export const SongGrid: FC = () => {
    const {
        setOriginalOrder,
        setRandomOrder,
        isRandom,
        getPlaylistSongs,
        addSongToRecycle,
    } = useAppContext();

    const playlistId = 'all-songs';
    const songs = getPlaylistSongs(playlistId);

    const [touchGhost, setTouchGhost] = useState<{ x: number; y: number; song: SongData } | null>(null);
    const [isDraggingOverRecycleBin, setIsDraggingOverRecycleBin] = useState(false);
    const dragTimer = useRef<NodeJS.Timeout | null>(null);
    const currentDraggedSong = useRef<SongData | null>(null);
    const draggedSongId = useRef<string | null>(null);
    const binRef = useRef<HTMLDivElement>(null);

    const [shuffleKey, setShuffleKey] = useState(0);
    const [shuffling, setShuffling] = useState(false);
    const shuffleOffsetsRef = useRef<Record<string, { rotate: number; x: number; y: number }>>({});

    const handleTouchStart = (e: React.TouchEvent, song: SongData) => {
        if (e.touches.length !== 1) return;

        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        let moved = false;
        let dragActivated = false;

        const cancel = () => {
            clearTimeout(dragTimer.current!);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            setTouchGhost(null);
            setIsDraggingOverRecycleBin(false);
            currentDraggedSong.current = null;
        };

        const handleTouchMove = (moveEvent: TouchEvent) => {
            const moveTouch = moveEvent.touches[0];
            const dx = moveTouch.clientX - startX;
            const dy = moveTouch.clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (!dragActivated && distance > 5) {
                moved = true;
                cancel();
                return;
            }

            if (dragActivated) {
                moveEvent.preventDefault();
                setTouchGhost(prev => prev ? { ...prev, x: moveTouch.clientX, y: moveTouch.clientY } : null);

                const binElem = binRef.current;
                if (binElem) {
                    const binRect = binElem.getBoundingClientRect();
                    const isOver =
                        moveTouch.clientX >= binRect.left &&
                        moveTouch.clientX <= binRect.right &&
                        moveTouch.clientY >= binRect.top &&
                        moveTouch.clientY <= binRect.bottom;

                    setIsDraggingOverRecycleBin(isOver);
                }
            }
        };

        const handleTouchEnd = (endEvent: TouchEvent) => {
            clearTimeout(dragTimer.current!);
            if (dragActivated && currentDraggedSong.current?.url) {
                const touch = endEvent.changedTouches[0];
                const x = touch.clientX;
                const y = touch.clientY;

                const binElem = binRef.current;
                if (binElem) {
                    const binRect = binElem.getBoundingClientRect();
                    const isOver =
                        x >= binRect.left &&
                        x <= binRect.right &&
                        y >= binRect.top &&
                        y <= binRect.bottom;

                    if (isOver) {
                        addSongToRecycle(currentDraggedSong.current);
                    }
                }
            }

            cancel();
        };

        dragTimer.current = setTimeout(() => {
            if (!moved) {
                dragActivated = true;
                setTouchGhost({ x: startX, y: startY, song });
                currentDraggedSong.current = song;
            }
        }, 200);

        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);
    };

    const handleTouchCancel = () => {
        clearTimeout(dragTimer.current!);
        setTouchGhost(null);
        setIsDraggingOverRecycleBin(false);
        currentDraggedSong.current = null;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, song: SongData) => {
        e.dataTransfer.setData('song', JSON.stringify(song));
        draggedSongId.current = song.id;
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOverRecycleBin(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOverRecycleBin(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOverRecycleBin(false);
        const data = e.dataTransfer.getData('song');
        if (data) {
            const song: SongData = JSON.parse(data);
            if (song.url && song.id !== draggedSongId.current) {
                addSongToRecycle(song);
            }
            draggedSongId.current = null;
        }
    };

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

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="fixed bottom-16 right-0 w-full z-50 pointer-events-none"
            >
                <div className="pointer-events-auto w-fit">
                    <RecyclingBin isTouchDraggedOver={isDraggingOverRecycleBin} binRef={binRef} />
                </div>
            </div>

            <div className="flex gap-4 lg:hidden">
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

            <div className="w-full box-border relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 z-10">
                <AnimatePresence mode="popLayout">
                    {songs.map((song, index) => {
                        const offset = shuffleOffsetsRef.current[song.id] ?? { rotate: 0, x: 0, y: 0 };

                        return (
                            <div
                                key={`${song.id}-${shuffleKey}`}
                                draggable
                                onDragStart={e => handleDragStart(e, song)}
                                onTouchStart={e => handleTouchStart(e, song)}
                                onTouchCancel={handleTouchCancel}
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
                                    className="relative h-36 w-full rounded-lg overflow-hidden backdrop-blur-lg shadow-md transition-all duration-200 bg-white/10 hover:bg-neutral-500"
                                    style={{ boxShadow: '-1px -1px 4px 1px #77777777' }}
                                >
                                    {song.image && (
                                        <div className="absolute inset-0">
                                            <Image
                                                src={song.image}
                                                alt={song.title}
                                                fill
                                                className="opacity-40 object-cover"
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
                        );
                    })}
                </AnimatePresence>

                {touchGhost && (
                    <div
                        className="fixed pointer-events-none z-50"
                        style={{
                            top: touchGhost.y - 40,
                            left: touchGhost.x - 80,
                            width: 160,
                            opacity: 0.8,
                            transform: 'scale(0.95)',
                            transition: 'transform 0.05s linear',
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
