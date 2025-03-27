import { FC } from "react";
import { useAppContext } from "../AppContext";
import { PlayPauseButton } from "./PlayPauseButton";

export const AudioPlayer: FC = () => {
    const { 
        currentSong, 
        isPlaying,
        progress,
        duration,
        audioRef,
        togglePlay,
        handleSeek,
        handleTimeUpdate,
        handleLoadedMetadata,
    } = useAppContext();
    

    return (
        <div className="flex items-center gap-2 p-4 w-full">
            {/* Play/Pause Button */}
            <PlayPauseButton isPlaying={isPlaying} onClick={togglePlay} />

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
