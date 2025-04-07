import { FC, useRef, useState, useEffect } from "react";
import { IoIosPlay } from "react-icons/io";
import { SongData } from "../types/SongData";
import { AudioPlayer } from "./AudioPlayer";
import { useAppContext } from "../AppContext";
import { Visualization } from "./Visualization";

interface SongProps {
    song: SongData;
}

export const Song: FC<SongProps> = ({ song }) => {
    const {
        currentSong,
        handlePlaySong,
    } = useAppContext();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [duration, setDuration] = useState<number | null>(null);


    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            const updateDuration = () => {
                setDuration(audioElement.duration);
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
        <div className="relative w-full h-full">
            {currentSong?.id === song.id ? (
                <div className="h-full flex flex-col justify-between">
                    <p className="text-gray-300 text-sm px-2">{song.description}</p>
                    <Visualization type="waveform" />
                </div>
            ) : (
                <div className="flex flex-col h-full items-center divide-y divide-gray-700">
                    <audio ref={audioRef} src={song.url} />

                    {/* Display Song Duration */}
                    <p className='w-full text-gray-300 text-sm p-2 pt-0'>
                        {duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, "0")}` : "Loading..."}
                    </p>
                    <div className="flex items-center justify-center w-full h-full relative">
                        <IoIosPlay
                            className="w-14 h-14 text-white opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer"
                            onClick={() => handlePlaySong(song, 'all-songs')}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
