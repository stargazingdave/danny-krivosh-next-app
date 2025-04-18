'use client';

import { FC, useState } from 'react';
import { SongData } from '../types/SongData';
import { useAppContext } from '../AppContext';
import Image from 'next/image';
import { PlayPauseButton } from './PlaybackControls/PlayPauseButton';
import { FaShuffle, FaWindowMinimize } from 'react-icons/fa6';
import { HiOutlineTrash } from 'react-icons/hi2';

interface RecyclingBinProps {
    isTouchDraggedOver?: boolean;
    binRef?: React.RefObject<HTMLDivElement | null>;
}

export const RecyclingBin: FC<RecyclingBinProps> = ({ isTouchDraggedOver = false, binRef }) => {
    const {
        addSongToRecycle,
        removeSongsFromRecycle,
        playlists,
        setPlaylists,
        setRandomOrder,
        startPlaylist,
        isPlaying,
        currentPlaylist,
        togglePlay,
        currentSong,
    } = useAppContext();

    const [isOpen, setIsOpen] = useState(false);
    const recyclePlaylist = playlists.find(p => p.id === 'recycle');

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const songData = e.dataTransfer.getData('song');
        if (!songData) return;
        const droppedSong: SongData = JSON.parse(songData);
        if (!droppedSong.url) return;
        addSongToRecycle(droppedSong);
    };

    const shuffleRecycle = () => {
        if (!recyclePlaylist) return;
        const shuffled = [...recyclePlaylist.songs].sort(() => Math.random() - 0.5);
        setPlaylists(playlists.map(p => p.id === 'recycle' ? { ...p, songs: shuffled } : p));
        setRandomOrder('recycle');
    };

    const clearRecycle = () => {
        if (!recyclePlaylist) return;
        removeSongsFromRecycle(recyclePlaylist.songs);
        setPlaylists(playlists.map(p => p.id === 'recycle' ? { ...p, songs: [] } : p));
    };

    if (!recyclePlaylist) return null;

    return (
        <div
            ref={binRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={isOpen ? 'fixed bottom-14 left-0 w-[28rem] max-w-full z-50' : ''}
        >
            {!isOpen ? (
                <div className="flex justify-center items-center w-32 h-full overflow-visible">
                    <Image
                        src="/images/recycle-bin-icon.png"
                        alt="Recycle Bin"
                        width={isTouchDraggedOver ? 170 : 120}
                        height={isTouchDraggedOver ? 150 : 135}
                        className="p-2 cursor-pointer transition-all duration-300 ease-in-out"
                        style={{
                            filter: isTouchDraggedOver
                                ? 'drop-shadow(0 0 18px #e31919)'
                                : 'drop-shadow(0 0.5rem 0.5rem rgba(0,0,0,0.5))',
                        }}
                        onClick={() => setIsOpen(true)}
                    />
                </div>
            ) : (
                <div className="relative rounded-md p-1 border-4 border-[#2a2a2a] shadow-[inset_0_0_12px_#000] bg-[#0b0b0b] overflow-hidden">
                    {/* Texture Overlays */}
                    <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/noise.png')] mix-blend-overlay opacity-[0.04] bg-repeat" />
                    <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/scanlines.png')] animate-scanlines mix-blend-soft-light opacity-[0.08] bg-repeat bg-[length:100%_4px]" />
                    <div className="pointer-events-none absolute inset-0 z-0 backdrop-blur-[0.4px] opacity-[0.03]" />

                    {/* Header */}
                    <div className="z-10 relative flex justify-between items-center px-3 py-1.5 bg-[#1a1a1a] border-b border-yellow-500 shadow-[inset_0_1px_0_#333,inset_0_-1px_0_#000]">
                        <div className="flex gap-1">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="border border-yellow-600 bg-[#111] px-2 py-1 text-yellow-300 text-sm shadow-[2px_2px_0_#000] hover:bg-yellow-700 hover:text-black active:shadow-[inset_2px_2px_2px_#000] transition-all"
                            >
                                <FaWindowMinimize />
                            </button>
                            <button
                                onClick={shuffleRecycle}
                                className="border border-yellow-600 bg-[#111] px-2 py-1 text-yellow-300 text-sm shadow-[2px_2px_0_#000] hover:bg-yellow-700 hover:text-black active:shadow-[inset_2px_2px_2px_#000] transition-all"
                            >
                                <FaShuffle />
                            </button>
                            <button
                                onClick={clearRecycle}
                                className="border border-red-700 bg-[#111] px-2 py-1 text-red-400 text-sm shadow-[2px_2px_0_#000] hover:bg-red-600 hover:text-black active:shadow-[inset_2px_2px_2px_#000] transition-all flex items-center gap-1"
                            >
                                <HiOutlineTrash className="scale-[1.4]" />
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_#ff0000]" />
                            </button>
                        </div>
                        <h2 className="text-lg font-bold tracking-wide uppercase text-yellow-300 drop-shadow-[1px_1px_0_#000]">Dumpster 3000</h2>
                    </div>

                    {/* Song List */}
                    <div className="z-10 relative h-64 overflow-y-auto bg-black bg-opacity-90 px-3 py-2 text-yellow-100 text-[13px] leading-tight">
                        {recyclePlaylist.songs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-60 tracking-wider">
                                <Image
                                    src="/images/recycle-bin-icon.png"
                                    alt="Recycle Bin"
                                    width={130}
                                    height={130}
                                    className="w-[130px] h-[130px] object-contain mb-2 drop-shadow-[0_0_12px_rgba(255,255,0,0.3)]"
                                />
                                <div>DUMP HERE</div>
                            </div>
                        ) : <div className="relative h-full">
                            <div className="absolute flex flex-col items-center justify-center h-full w-full opacity-60 tracking-wider">
                                <Image
                                    src="/images/recycle-bin-icon.png"
                                    alt="Recycle Bin"
                                    width={130}
                                    height={130}
                                    className="w-[130px] h-[130px] object-contain mb-2 drop-shadow-[0_0_12px_rgba(255,255,0,0.3)] opacity-30"
                                />
                            </div>
                            {recyclePlaylist.songs.map((song, idx) => {
                                const isActive =
                                    isPlaying &&
                                    currentPlaylist.id === 'recycle' &&
                                    currentSong?.id === song.id;
                                return (
                                    <div
                                        key={song.id}
                                        className="relative flex justify-between items-center py-1 border-b border-yellow-900/40"
                                    >
                                        <div className={isActive ? 'text-white font-bold' : ''}>
                                            {String(idx + 1).padStart(2, '0')}. {song.title}
                                        </div>
                                        <PlayPauseButton
                                            isPlaying={isActive}
                                            onClick={() =>
                                                isActive ? togglePlay() : startPlaylist('recycle', idx)
                                            }
                                            winampStyle
                                            size={16}
                                        />
                                    </div>
                                );
                            })}
                        </div>}
                    </div>
                </div>
            )}
        </div>
    );
};
