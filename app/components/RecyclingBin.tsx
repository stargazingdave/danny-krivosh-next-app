'use client';

import { FC, useEffect, useRef, useState } from "react";
import { NativeSong, Song as SongType } from "../types/Song";
import { TbTrashXFilled } from "react-icons/tb";
import { Modal } from "./Modal";
import { FaPause, FaPlay, FaShuffle, FaWindowMinimize } from "react-icons/fa6";

interface RecyclingBinProps {
    initSongs: SongType[];
    addSong: (song: SongType) => void;
}

export const RecyclingBin: FC<RecyclingBinProps> = ({ initSongs, addSong }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [random, setRandom] = useState(false);
    const [songs, setSongs] = useState<SongType[]>([]);
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const dragTimeout = useRef<NodeJS.Timeout | null>(null);

    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

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

        const droppedSong: SongType = JSON.parse(songData);
        addSong(droppedSong); // Add song to parent component
        setSongs((prevSongs) => [...prevSongs, droppedSong]); // Add song to bin
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
        setSongs([...songs].sort(() => Math.random() - 0.5));
        setRandom(true);
    };

    const playFirstSong = () => {
        // Stop all currently playing songs
        audioRefs.current.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        // Play the first song
        if (audioRefs.current[0]) {
            audioRefs.current[0].play();
        }
    };

    return (
        <div className='fixed bottom-4 left-4 w-1/3 z-50'
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex flex-col p-1 gap-8 bg-black">
                <div className="flex gap-2 items-center">
                    <FaWindowMinimize className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                    <FaShuffle className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={onShuffleClick} />
                    <FaPlay className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={playFirstSong} />
                </div>

                <h1 className="text-4xl px-2">YOUR RECYCLING BIN</h1>
            </div>

            <div className="flex flex-col h-64 overflow-auto bg-black">
                {
                    songs.length === 0 && (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-white">No songs in the bin</p>
                        </div>
                    )
                }
                {songs.map((song, index) => (
                    <div key={index} className="font-light flex gap-1 p-2 shadow-md">
                        {song.type === 'native'
                            ? <SongContent song={song as NativeSong} index={index} audioRefs={audioRefs} />
                            : (
                                <div
                                    dangerouslySetInnerHTML={{ __html: song.embbed }}
                                    className="w-32 h-32"
                                />
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SongContent: FC<{ song: NativeSong; index: number; audioRefs: React.MutableRefObject<(HTMLAudioElement | null)[]> }> = ({ song, index, audioRefs }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            audioRefs.current[index] = audioRef.current;
        }
    }, [index]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex justify-between w-full">
            <div className="flex gap-3">
                <p>{`${index + 1}.`}</p>
                <p>{song.title}</p>
                <audio src={song.url} ref={audioRef} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />
            </div>
            <button onClick={togglePlayPause} className="w-8 h-8 text-white p-2 border">
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
        </div>
    );
};
