import { FC } from "react";
import {
    IoPause,
    IoPlay,
    IoPlaySkipBack,
    IoPlaySkipForward,
} from "react-icons/io5";
import { PlayPauseButton } from "./PlayPauseButton";

interface FullPlaybackControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export const FullPlaybackControls: FC<FullPlaybackControlsProps> = ({
    isPlaying,
    onPlayPause,
    onNext,
    onPrevious,
}) => {
    return (
        <div className="flex items-center gap-2 p-2">
            <button onClick={onPrevious} className="text-white text-2xl cursor-pointer">
                <IoPlaySkipBack />
            </button>
            <PlayPauseButton isPlaying={isPlaying} onClick={onPlayPause} />
            <button onClick={onNext} className="text-white text-2xl cursor-pointer">
                <IoPlaySkipForward />
            </button>
        </div>
    );
}

