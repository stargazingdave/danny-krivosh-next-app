import { FC } from "react";
import {
    IoPause,
    IoPlay,
    IoPlaySkipBack,
    IoPlaySkipForward,
} from "react-icons/io5";
import { PlayPauseButton } from "./PlayPauseButton";

interface FullPlaybackControlsProps {
    onPlayPause?: () => void;
    songActive: boolean;
    onNext: () => void;
    onPrevious: () => void;
}

export const FullPlaybackControls: FC<FullPlaybackControlsProps> = ({
    onPlayPause,
    songActive,
    onNext,
    onPrevious,
}) => {
    return (
        <div className="flex items-center gap-2 p-2">
            <button
                onClick={onPrevious}
                className="text-white text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!songActive}
            >
                <IoPlaySkipBack />
            </button>
            <PlayPauseButton isActive={songActive} size={26} onClick={onPlayPause} />
            <button
                onClick={onNext}
                className="text-white text-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!songActive}
            >
                <IoPlaySkipForward />
            </button>
        </div>
    );
}

