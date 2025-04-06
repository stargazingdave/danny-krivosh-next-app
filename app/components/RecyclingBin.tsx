'use client';

import { FC, useEffect, useRef, useState } from "react";
import { SongData } from "../types/SongData";
import { TbTrashXFilled } from "react-icons/tb";
import { FaPause, FaPlay, FaShuffle, FaWindowMinimize } from "react-icons/fa6";
import { useAppContext } from "../AppContext";
import { PlayPauseButton } from "./PlaybackControls/PlayPauseButton";
import Image from "next/image";
import { HiOutlineTrash } from "react-icons/hi2";

const widthUnit = 13;
const heightUnit = 12;

interface RecyclingBinProps { }

export const RecyclingBin: FC<RecyclingBinProps> = ({ }) => {
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
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }

    useEffect(() => {
        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize); // Add event listener
        return () => {
            window.removeEventListener("resize", handleResize); // Cleanup event listener
        };
    }, []);
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
                id="recycle-bin-dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <Image
                    src="/images/recycle-bin-icon.png"
                    alt="Recycle Bin"
                    width={isDraggedOver ? 210 : 200}
                    height={isDraggedOver ? 150 : 135}
                    className="p-2 cursor-pointer transition-all duration-300 ease-in-out"
                    style={{
                        filter: isDraggedOver ? "drop-shadow(0 0 24px rgb(255 0 0))" : "drop-shadow(0 0.5rem 0.5rem rgb(0 0 0))",
                        // objectFit: "fill", // <-- this allows distorting the aspect ratio
                        width: widthUnit * (isDraggedOver ? 12 : 10),
                        height: heightUnit * (isDraggedOver ? 12 : 10),
                        margin: isMobile ? "0" : "2rem",
                    }}
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

    const recyclePlaylist = playlists.find(playlist => playlist.id === "recycle");
    if (!recyclePlaylist) return null; // Ensure recycle playlist exists

    const handleDeleteAllSongs = () => {
        if (playlists[1].songs.length > 0) {
            removeSongsFromRecycle(recyclePlaylist.songs); // Remove all songs from recycle bin
        }
        setPlaylists(playlists.map(playlist => {
            if (playlist.id === 'recycle') {
                return { ...playlist, songs: [] };
            }
            return playlist;
        }));
    };

    return (
        <div id="recycle-bin-dropzone"
            className='fixed bottom-16 left-4 w-fit min-w-64 z-50'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div
                className="flex p-1 gap-8 justify-between bg-black"
                style={{
                    backgroundColor: "#000000b0",
                    backdropFilter: "blur(10px)",
                }}
            >
                <div className="flex gap-2 items-center">
                    <FaWindowMinimize className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                    <FaShuffle className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={onShuffleClick} />
                    <PlayPauseButton onClick={() => handleListPlayPause()} isPlaying={isPlaying && currentPlaylist.id === "recycle"} />
                    <HiOutlineTrash className="w-8 h-8 text-white cursor-pointer" onClick={handleDeleteAllSongs} />
                </div>

                <h1 className="w-fit text-2xl">DUMPSTER 3000</h1>
            </div>

            <div
                className="flex flex-col h-64 overflow-auto bg-black"
                style={{
                    backgroundColor: "#000000b0",
                    backdropFilter: "blur(10px)",
                }}
            >
                {
                    playlists[1].songs.length === 0 &&
                    <div className="flex justify-center items-center h-full">
                        <p className="text-white">Dump Here</p>
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
