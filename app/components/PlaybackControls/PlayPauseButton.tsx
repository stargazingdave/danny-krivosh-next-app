import { IoPause, IoPlay } from "react-icons/io5";

export const PlayPauseButton = ({
    isPlaying,
    onClick,
}: {
    isPlaying: boolean;
    onClick: () => void;
}) => {
    return (
        <button onClick={onClick} className="text-white text-4xl cursor-pointer">
            {isPlaying ? <IoPause /> : <IoPlay />}
        </button>
    );
}