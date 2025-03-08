'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { IoIosPlay } from 'react-icons/io';
import { AudioPlayer } from './AudioPlayer';
import Image from 'next/image';

export interface Song {
    id: string;
    title: string;
    description: string;
    length: number;
    url: string;
    generes: string[];
    image?: string;
}

interface SongGridProps {
    songs: Song[];
}

export const SongGrid: FC<SongGridProps> = ({ songs }) => {
    const [activeSong, setActiveSong] = useState<string | null>(null);

    return (
        <div className="box-border relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="relative h-32 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden hover:bg-neutral-800 transition-all duration-300"
                    style={{
                        boxShadow: "-1px -1px 8px 0.5px #555555",
                    }}
                >
                    {/* Background Image */}
                    {
                        song.image &&
                        <div className="absolute inset-0">
                            <Image
                                src={song.image}
                                alt={song.title}
                                layout="fill"
                                objectFit="cover"
                                className="opacity-40"
                            />
                        </div>
                    }

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-2">
                        <h2 className="text-lg font-semibold text-white">{song.title}</h2>
                        <Song song={song} activeSong={activeSong} setActiveSong={setActiveSong} />
                    </div>
                </div>
            ))}
        </div>
    );
};

interface SongProps {
    song: Song;
    activeSong: string | null;
    setActiveSong: (id: string) => void;
}

const Song: FC<SongProps> = ({ song, activeSong, setActiveSong }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState<number | null>(null);


    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            // Get duration when metadata is loaded
            const updateDuration = () => setDuration(audioElement.duration);
            audioElement.addEventListener("loadedmetadata", updateDuration);

            return () => {
                audioElement.removeEventListener("loadedmetadata", updateDuration);
            };
        }
    }, [song.url]);

    return (
        <div>
            {activeSong === song.id ? (
                <div className="h-24 flex flex-col justify-between">
                    <p className="text-gray-300 text-sm">{song.description}</p>
                    <AudioPlayer src={song.url} />
                </div>
            ) : (
                <div className="flex flex-col h-24 items-center justify-center">
                    <audio ref={audioRef} src={song.url} />

                    {/* Display Song Duration */}
                    <p className='absolute top-8 left-2'>
                        {duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, "0")}` : "Loading..."}
                    </p>
                    <IoIosPlay
                        className="w-14 h-14 text-white opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveSong(song.id)}
                    />
                </div>
            )}
        </div>
    );
};
