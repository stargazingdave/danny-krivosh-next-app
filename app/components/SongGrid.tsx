'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { IoIosPlay } from 'react-icons/io';
import { AudioPlayer } from './AudioPlayer';
import Image from 'next/image';
import { FaRandom } from 'react-icons/fa';
import Checkbox from './Checkbox';
import Dropdown from './Dropdown';
import { NativeSong, YouTubeSong, Song as SongType } from '../types/Song';
import { Song } from './Song';
import { RecyclingBin } from './RecyclingBin';



interface SongGridProps {
    nativeSongs: NativeSong[];
}

export const SongGrid: FC<SongGridProps> = ({ nativeSongs }) => {
    const [songs, setSongs] = useState<SongType[]>([
        ...nativeSongs.map((song) => ({ ...song, type: 'native' as const })),
    ]);
    const [activeSong, setActiveSong] = useState<string | null>(null);
    const [random, setRandom] = useState(false);

    const [recycledSongs, setRecycledSongs] = useState<SongType[]>([]);

    const addSongToRecycle = (song: SongType) => {
        setRecycledSongs([...recycledSongs, song]);
    }

    const setOriginalOrder = () => {
        setSongs([
            ...nativeSongs.map((song) => ({ ...song, type: 'native' as const })),
        ]);
        setRandom(false);
    };

    const setRandomOrder = () => {
        setSongs([...songs].sort(() => Math.random() - 0.5));
        setRandom(true);
    };

    return <div className='flex flex-col items-center justify-center'>
        <div className='fixed bottom-0 right-0 w-full z-50'>
            <RecyclingBin initSongs={recycledSongs} addSong={addSongToRecycle} />
        </div>
        <div className='flex gap-4'>
            <Checkbox label="Original" checked={!random} onChange={() => setOriginalOrder()} />
            <Checkbox label="Random" checked={random} onChange={() => setRandomOrder()} />
        </div>
        <div className="w-full box-border relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 z-10">
            {songs.map((song, index) => {
                if (song.type === 'native') {
                    return <div
                        key={song.id}
                        className="relative min-h-32 sm:min-h-44 md:min-h-50 w-full bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden hover:bg-neutral-500 transition-all duration-300"
                        style={{
                            boxShadow: "-1px -1px 4px 1px #77777777",
                        }}
                        draggable="true"
                        onDragStart={(e) => e.dataTransfer.setData("song", JSON.stringify(song))}
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
                            {
                                song.url
                                ? <Song song={song} activeSong={activeSong} setActiveSong={setActiveSong} />
                                : <p className="text-sm text-gray-300">Coming Soon</p>
                            }
                            
                        </div>
                    </div>
                } else if (song.type === 'youtube') {
                    return <div
                        key={song.id}
                        className="relative h-32 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden hover:bg-neutral-800 transition-all duration-300"
                        style={{
                            boxShadow: "-1px -1px 4px 1px #77777777",
                        }}
                    >
                        <div
                            className="relative w-full aspect-video"
                            dangerouslySetInnerHTML={{ __html: song.embbed }}
                        />
                    </div>
                }
            })}
        </div>
    </div>
};

