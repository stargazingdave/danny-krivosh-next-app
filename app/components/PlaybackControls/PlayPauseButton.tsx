import { useAppContext } from "@/app/AppContext";
import { IoPause, IoPlay } from "react-icons/io5";

interface PlayPauseButtonProps {
    isActive: boolean;
    onClick?: () => void;
    size?: number;
    winampStyle?: boolean;
}

export const PlayPauseButton = ({
    isActive,
    onClick,
    size = 24,
    winampStyle = false,
}: PlayPauseButtonProps) => {
    const baseStyles = "text-4xl relative inline-block cursor-pointer transition-all";

    const handleClick = () => {
        onClick?.();
    }
    

    return (
        <button
            onClick={handleClick}
            className={baseStyles}
            style={
                winampStyle
                    ? {
                        border: "1px solid #444",
                        borderRadius: "4px",
                        boxShadow: "inset 0 0 1px #fff3, 0 1px 2px #000",
                        padding: "6px 8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "oklch(0.879 0.169 91.605)",
                    }
                    : {}
            }
        >
            {/* Icon with overlay */}
            <div style={{position: "relative", width: size, height: size}}>
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br mix-blend-screen opacity-80 rounded-md"
                    style={winampStyle
                        ? {
                            background: "linear-gradient(135deg, #ffaa00 0%, #ffdd55 100%)",
                            mixBlendMode: "multiply", // Try 'overlay', 'soft-light', or 'color-dodge' too
                            opacity: 0.8,
                        }
                        : {}}
                />
                <div className="absolute inset-0 z-0 flex items-center justify-center bg-transparent">
                    {isActive ? <IoPause className="w-full h-full" /> : <IoPlay className="w-full h-full" />}
                </div>
            </div>
        </button>
    );
};
