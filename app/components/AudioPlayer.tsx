import { useEffect, useRef, useState } from "react";
import { IoPlay, IoPause } from "react-icons/io5";
import { useAppContext } from "../AppContext";

export const AudioPlayer = ({ src }: { src: string }) => {
    const { 
        currentSong, 
        playNextSong
    } = useAppContext();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Set the audio source when the current song changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                console.warn("Autoplay failed, user interaction required.");
            });
        }
    }, [currentSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener('ended', playNextSong);
        return () => audio.removeEventListener('ended', playNextSong);
    }, [playNextSong]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(event.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(Number(event.target.value));
        }
    };

    return (
        <div className="flex items-center gap-2 p-4 w-full">
            {/* Play/Pause Button */}
            <button onClick={togglePlay} className="text-white text-2xl cursor-pointer">
                {isPlaying ? <IoPause /> : <IoPlay />}
            </button>

            {/* Current Time */}
            <p className="text-white text-sm">
                {audioRef.current ? `${Math.floor(audioRef.current.currentTime / 60)}:${Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, "0")}` : "Loading..."}
            </p>

            {/* Progress Bar */}
            <input
                type="range"
                className="w-full h-1 rounded-lg cursor-pointer accent-black"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
            />

            {/* Audio Element */}
            <audio
                ref={audioRef}
                src={currentSong?.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            />

            {/* Total Duration */}
            <p className="text-white text-sm">
                {duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, "0")}` : "Loading..."}
            </p>
        </div>
    );
};
