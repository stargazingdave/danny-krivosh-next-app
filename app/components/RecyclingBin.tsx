'use client';

import { FC, useEffect, useRef, useState } from "react";
import { SongData } from "../types/SongData";
import { TbTrashXFilled } from "react-icons/tb";
import { FaPause, FaPlay, FaShuffle, FaWindowMinimize } from "react-icons/fa6";
import { useAppContext } from "../AppContext";
import { PlayPauseButton } from "./PlayPauseButton";

interface RecyclingBinProps { }

export const RecyclingBin: FC<RecyclingBinProps> = ({ }) => {
    const {
        addSongToRecycle,
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
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const dragTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);

        // Clear any previous timeout to prevent premature reset
        if (dragTimeout.current) {
            clearTimeout(dragTimeout.current);
        }

        // Set a new timeout to reset isDraggedOver if no drag events occur for a short time
        dragTimeout.current = setTimeout(() => {
            setIsDraggedOver(false);
        }, 200);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const songData = e.dataTransfer.getData("song");
        if (!songData) return;

        const droppedSong: SongData = JSON.parse(songData);
        addSongToRecycle(droppedSong); // Add song to parent component
        setIsDraggedOver(false);
    };

    if (!isOpen) {
        return (
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <TbTrashXFilled
                    className="w-16 h-16 text-white shadow-md rounded-full m-8 p-2 bg-black cursor-pointer transition-all duration-300 ease-in-out"
                    style={{ boxShadow: isDraggedOver ? "rgb(255 0 0) 0px 0px 24px 1px" : "" }}
                    onClick={() => setIsOpen(true)}
                />
            </div>
        );
    }

    const onShuffleClick = () => {
        setPlaylists(playlists.map(playlist => {
            if (playlist.id === 'recycle') {
                const shuffledSongs = [...playlist?.songs].sort(() => Math.random() - 0.5);
                return { ...playlist, songs: shuffledSongs };
            }
            return playlist;
        }
        ));
        setRandomOrder('recycle');
    };

    const handleListPlayPause = () => {
        if (currentPlaylist.id === "recycle") {
            togglePlay();
        } else {
            startPlaylist("recycle");
        }
    };

    const handleSongPlayPause = (song: SongData) => {
        if (currentPlaylist.id === "recycle" && currentSong?.id === song.id) {
            togglePlay();
        } else {
            startPlaylist("recycle", playlists[1].songs.findIndex(s => s.id === song.id));
        }
    }

    return (
        <div className='fixed bottom-4 left-4 w-1/3 z-50'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex flex-col p-1 gap-8 bg-black">
                <div className="flex gap-2 items-center">
                    <FaWindowMinimize className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                    <FaShuffle className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={onShuffleClick} />
                    <PlayPauseButton onClick={() => handleListPlayPause()} isPlaying={isPlaying && currentPlaylist.id === "recycle"} />
                </div>

                <h1 className="text-4xl px-2">YOUR RECYCLING BIN</h1>
            </div>

            <div className="flex flex-col h-64 overflow-auto bg-black">
                {
                    playlists[1].songs.length === 0 &&
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white">No songs in the bin</p>
                    </div>
                }
                {
                    playlists[1].songs.map((song, index) =>
                        <div key={index} className="font-light flex gap-1 p-2 shadow-md">
                            <div className="flex justify-between w-full">
                                <div className="flex gap-3">
                                    <p>{`${index + 1}.`}</p>
                                    <p>{song.title}</p>
                                </div>
                                <PlayPauseButton onClick={() => handleSongPlayPause(song)} isPlaying={isPlaying && currentPlaylist.id === "recycle" && currentSong?.id === song.id} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
