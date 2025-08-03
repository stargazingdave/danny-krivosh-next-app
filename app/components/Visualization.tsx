import { FC, useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";

interface VisualizationProps {
    type?: "waveform" | "spectrum";
    barCount?: number;
}

export const Visualization: FC<VisualizationProps> = ({ type = "waveform", barCount = 32 }) => {
    const {
        currentSong,
        analyserRef,
    } = useAppContext();

    const localCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
        const audioCtx = new AudioCtx();

        if (audioCtx.state === "suspended") {
            audioCtx.resume().catch((err) => {
                console.warn("AudioContext resume failed:", err);
            });
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            const resume = () => audioCtx.resume();
            window.addEventListener('click', resume, { once: true });
            return () => window.removeEventListener('click', resume);
        }
    }, []);

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

    useEffect(() => {
        if (!analyserRef.current || !localCanvasRef.current || !currentSong?.id) return;

        const analyser = analyserRef.current;
        const canvas = localCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasSize.width * dpr;
        canvas.height = canvasSize.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${canvasSize.width}px`;
        canvas.style.height = `${canvasSize.height}px`;

        const rawData = new Uint8Array(analyser.frequencyBinCount);
        let animationFrameId: number;

        const clampedBarCount = Math.max(barCount, 3);
        const previousHeights = new Array(clampedBarCount).fill(0);
        const decayFactor = 0.8;

        const draw = () => {
            ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

            if (type === "spectrum") {
                analyser.getByteFrequencyData(rawData);

                const barWidth = canvasSize.width / clampedBarCount;

                const getSkewedIndex = (
                    i: number,
                    total: number,
                    skewPower = 1.5,
                    minPercent = 0.05,
                    maxPercent = 0.7
                ) => {
                    const percent = i / (total - 1);
                    const skewed = 1 - Math.pow(1 - percent, skewPower);
                    const startBin = Math.floor(rawData.length * minPercent);
                    const endBin = Math.floor(rawData.length * maxPercent);
                    const usableBins = endBin - startBin;
                    return Math.min(
                        rawData.length - 1,
                        startBin + Math.round(skewed * usableBins)
                    );
                };

                ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

                for (let i = 0; i < clampedBarCount; i++) {
                    const index = getSkewedIndex(i, clampedBarCount);
                    const prevIndex = getSkewedIndex(i - 1, clampedBarCount);
                    const nextIndex = getSkewedIndex(i + 1, clampedBarCount);
                    const val = rawData[index]
                        ? (rawData[index] * 0.4 +
                            ((rawData[prevIndex] || 0) + (rawData[nextIndex] || 0)) / 2.3)
                        : 0;

                    const targetHeight = (val / 255) * canvasSize.height;
                    previousHeights[i] = Math.max(
                        targetHeight,
                        previousHeights[i] * decayFactor
                    );
                    const barHeight = previousHeights[i];

                    const hue = 0 + (i / clampedBarCount) * 50;
                    const saturation = 100;
                    const lightness = 50 + (val / 255) * 50;
                    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

                    ctx.fillRect(i * barWidth, canvasSize.height - barHeight, barWidth, barHeight);
                }
            } else {
                analyser.getByteTimeDomainData(rawData);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#e7ddb0";
                ctx.beginPath();

                const sliceWidth = canvasSize.width / rawData.length;
                let x = 0;

                for (let i = 0; i < rawData.length; i++) {
                    const v = rawData[i] / 128.0;
                    const y = (v * canvasSize.height) / 2;
                    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                    x += sliceWidth;
                }

                ctx.lineTo(canvasSize.width, canvasSize.height / 2);
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [analyserRef.current, currentSong?.id, canvasSize, type, barCount]);

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <canvas
                ref={localCanvasRef}
                className="absolute inset-0"
            />
        </div>
    );
};
