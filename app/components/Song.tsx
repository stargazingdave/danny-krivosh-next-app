import { FC, useRef, useState, useEffect } from "react";
import { IoIosPlay } from "react-icons/io";
import { NativeSong } from "../types/Song";
import { AudioPlayer } from "./AudioPlayer";

interface SongProps {
    song: NativeSong;
    activeSong: string | null;
    setActiveSong: (id: string) => void;
}

export const Song: FC<SongProps> = ({ song, activeSong, setActiveSong }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState<number | null>(null);


    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            const updateDuration = () => {
                setDuration(audioElement.duration);
                console.log("Duration Loaded:", audioElement.duration);
            };

            // Ensure the audio loads metadata
            audioElement.load(); // Force metadata to load
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
