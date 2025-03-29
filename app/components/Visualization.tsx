import { FC, useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";

interface VisualizationProps {
    type?: "waveform" | "spectrum";
}

export const Visualization: FC<VisualizationProps> = ({ type = "waveform" }) => {
    const {
        currentSong,
        analyserRef,
        audioRef,
    } = useAppContext();

    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // ResizeObserver to track container size
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            setCanvasSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Main drawing effect
    useEffect(() => {
        if (!analyserRef.current || !localCanvasRef.current || !currentSong?.id) return;

        const analyser = analyserRef.current;
        const canvas = localCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        analyser.fftSize = 1024;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationFrameId: number;

        const draw = () => {
            if (type === "spectrum") {
                analyser.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const barWidth = canvas.width / bufferLength;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * canvas.height;
                    ctx.fillStyle = `rgb(${dataArray[i]}, ${255 - dataArray[i]}, 150)`;
                    // ctx.fillStyle = '#e7ddb0';
                    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
                }
            } else {
                analyser.getByteTimeDomainData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#e7ddb0";
                ctx.beginPath();

                const sliceWidth = canvas.width / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * canvas.height) / 2;

                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                    x += sliceWidth;
                }

                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        const waitForAudioToStart = () => {
            if (audioRef.current && !audioRef.current.paused) {
                draw();
            } else {
                requestAnimationFrame(waitForAudioToStart);
            }
        };

        waitForAudioToStart();

        return () => cancelAnimationFrame(animationFrameId);
    }, [currentSong?.id, canvasSize, type]);

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <canvas
                ref={localCanvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="absolute inset-0"
            />
        </div>
    );
};
