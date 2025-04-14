'use client';

import { FC, useEffect, useRef, useState } from "react";
import { SongData } from "../types/SongData";
import { FaShuffle, FaWindowMinimize } from "react-icons/fa6";
import { HiOutlineTrash } from "react-icons/hi2";
import { useAppContext } from "../AppContext";
import { PlayPauseButton } from "./PlaybackControls/PlayPauseButton";
import Image from "next/image";

const widthUnit = 13;
const heightUnit = 12;

const MiniEqualizer: FC = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            width: '22px',
            height: '18px',
            marginLeft: '4px',
        }}
    >
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                style={{
                    width: '3px',
                    background: 'linear-gradient(to top, #ffc400, transparent)',
                    height: `${6 + Math.random() * 10}px`,
                    animation: `eqAnim .3s ease-in-out ${i * 0.1}s infinite alternate`,
                    borderRadius: '2px',
                }}
            />
        ))}
    </div>
);

if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes eqAnim {
      0% { transform: scaleY(0.5); opacity: 0.4; }
      50% { transform: scaleY(1.8); opacity: 1; }
      100% { transform: scaleY(0.7); opacity: 0.6; }
    }
  `;
    document.head.appendChild(style);
}

interface RecyclingBinProps {
    isTouchDraggedOver?: boolean;
}

export const RecyclingBin: FC<RecyclingBinProps> = ({ isTouchDraggedOver = false }) => {
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

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    const dragTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggedOver(true);
        if (dragTimeout.current) clearTimeout(dragTimeout.current);
        dragTimeout.current = setTimeout(() => setIsDraggedOver(false), 200);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const songData = e.dataTransfer.getData("song");
        if (!songData) return;
        const droppedSong: SongData = JSON.parse(songData);
        addSongToRecycle(droppedSong);
        setIsDraggedOver(false);
    };

    if (!isOpen) {
        return (
            <div id="recycle-bin-dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
                <Image
                    src="/images/recycle-bin-icon.png"
                    alt="Recycle Bin"
                    width={(isDraggedOver || isTouchDraggedOver) ? 210 : 200}
                    height={(isDraggedOver || isTouchDraggedOver) ? 150 : 135}
                    className="p-2 cursor-pointer transition-all duration-300 ease-in-out"
                    style={{
                        filter: (isDraggedOver || isTouchDraggedOver)
                            ? "drop-shadow(0 0 18px #e0b300)"
                            : "drop-shadow(0 0.5rem 0.5rem rgba(0,0,0,0.5))",
                        width: widthUnit * ((isDraggedOver || isTouchDraggedOver) ? 12 : 10),
                        height: heightUnit * ((isDraggedOver || isTouchDraggedOver) ? 12 : 10),
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
                const shuffledSongs = [...playlist.songs].sort(() => Math.random() - 0.5);
                return { ...playlist, songs: shuffledSongs };
            }
            return playlist;
        }));
        setRandomOrder('recycle');
    };

    const handleListPlayPause = () => {
        if (currentPlaylist.id === "recycle") togglePlay();
        else startPlaylist("recycle");
    };

    const handleSongPlayPause = (song: SongData) => {
        if (currentPlaylist.id === "recycle" && currentSong?.id === song.id) togglePlay();
        else startPlaylist("recycle", playlists[1].songs.findIndex(s => s.id === song.id));
    };

    const recyclePlaylist = playlists.find(p => p.id === "recycle");
    if (!recyclePlaylist) return null;

    const handleDeleteAllSongs = () => {
        if (playlists[1].songs.length > 0) removeSongsFromRecycle(recyclePlaylist.songs);
        setPlaylists(playlists.map(p => p.id === 'recycle' ? { ...p, songs: [] } : p));
    };

    return (
        <div id="recycle-bin-dropzone" className='fixed bottom-14 left-0 w-[28rem] min-w-64 z-50' onDragOver={handleDragOver} onDrop={handleDrop}>
            {/* Toolbar */}
            <div
                className="flex p-1 gap-8 justify-between items-center"
                style={{
                    background: "linear-gradient(to right, #0a0a0a, #1a1a1a)",
                    borderBottom: "1px solid #aa8800",
                    boxShadow: "inset 0 -1px 2px #e3b80055, 0 1px 3px #000",
                    fontFamily: "Tahoma, sans-serif",
                    textTransform: "uppercase",
                    padding: "6px 10px",
                }}
            >
                <div className="flex gap-2 items-center">
                    {[{
                        icon: <FaWindowMinimize />,
                        onClick: () => setIsOpen(false)
                    }, {
                        icon: <FaShuffle />,
                        onClick: onShuffleClick
                    }, {
                        icon: <HiOutlineTrash />,
                        onClick: handleDeleteAllSongs
                    }].map(({ icon, onClick }, idx) => (
                        <button
                            key={idx}
                            onClick={onClick}
                            style={{
                                background: "linear-gradient(to bottom, #222, #111)",
                                border: "1px solid #444",
                                borderRadius: "3px",
                                boxShadow: "inset 0 0 1px #fff3, 0 1px 2px #000",
                                padding: "4px 6px",
                                color: "#f3c400",
                                transition: "all 0.2s",
                                cursor: "pointer",
                            }}
                            onMouseOver={(e) => {
                                (e.currentTarget.style.background = "linear-gradient(to bottom, #333, #1b1b1b)");
                            }}
                            onMouseOut={(e) => {
                                (e.currentTarget.style.background = "linear-gradient(to bottom, #222, #111)");
                            }}
                        >
                            {icon}
                        </button>
                    ))}
                    {/* <PlayPauseButton onClick={handleListPlayPause} isPlaying={isPlaying && currentPlaylist.id === "recycle"} /> */}
                </div>
                <h1 style={{
                    fontSize: "26px",
                    fontWeight: "bold",
                    color: "#f3c400",
                    textShadow: "0 0 4px #000, 0 0 8px #e3b80055",
                    fontFamily: "Impact, Tahoma, sans-serif",
                    letterSpacing: "2.5px"
                }}>
                    DUMPSTER 3000
                </h1>
            </div>

            {/* Song list */}
            <div
                className="flex flex-col h-64 overflow-auto"
                style={{
                    background: "repeating-linear-gradient(to bottom, #101010 0px, #181818 2px, #101010 4px)",
                    borderTop: "1px solid #aa880022",
                    boxShadow: "inset 0 0 10px #aa880033",
                    padding: "6px",
                    color: "#f0eac7",
                    fontFamily: "Courier New, monospace",
                    fontSize: "18px",
                }}
            >
                {playlists[1].songs.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <p style={{ fontFamily: "Tahoma", fontSize: "14px", color: "#888" }}>
                            Dump Here
                        </p>
                    </div>
                )}
                {playlists[1].songs.map((song, index) => {
                    const isActive = isPlaying && currentPlaylist.id === "recycle" && currentSong?.id === song.id;
                    return (
                        <div
                            key={index}
                            className="flex justify-between items-center gap-2 mb-1 px-3 py-2"
                            style={{
                                background: "#1b1b1b",
                                border: "1px solid #aa880022",
                                borderRadius: "4px",
                                boxShadow: "inset 0 0 6px #e3b80033",
                            }}
                        >
                            <div className="flex gap-3 items-center">
                                <p style={{ fontWeight: 'bold' }}>{`${index + 1}.`}</p>
                                <p style={{ fontWeight: 'bold' }}>{song.title}</p>
                            </div>
                            <div className="flex gap-8 items-center">
                                {isActive && <MiniEqualizer />}
                                <PlayPauseButton onClick={() => handleSongPlayPause(song)} isPlaying={isActive} winampStyle size={18}/>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
