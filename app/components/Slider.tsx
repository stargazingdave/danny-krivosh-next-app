'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CustomSliderProps {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    onChange?: (value: number) => void;
    label?: string;
    thumbShape?: 'square' | 'circle';
    trackColor?: string;
    thumbColor?: string;
    className?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
    min = 0,
    max = 100,
    step = 1,
    value = 0,
    onChange,
    label,
    thumbShape = 'square',
    trackColor = '#6f6f6f',
    thumbColor = '#d0d0d0',
    className = '',
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const percent = ((value - min) / (max - min)) * 100;

    const handleMove = (clientX: number) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let ratio = x / rect.width;
        ratio = Math.max(0, Math.min(1, ratio));
        const newValue = Math.round((min + ratio * (max - min)) / step) * step;
        onChange?.(newValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleMove(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (isDragging) handleMove(e.touches[0].clientX);
    };

    const stopDragging = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', stopDragging);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', stopDragging);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', stopDragging);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', stopDragging);
        };
    }, [isDragging]);

    return (
        <div className={`text-white select-none ${className}`}>
            {label && <div className="text-sm mb-1">{label}</div>}
            <div
                ref={trackRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="relative h-4 w-full rounded"
                style={{
                    background: `
                        repeating-linear-gradient(
                        -45deg,
                        #2c2c2c 0px,
                        #2c2c2c 2px,
                        #242424 2px,
                        #242424 4px
                        ),
                        linear-gradient(to right, ${trackColor} ${percent}%, #222 ${percent}%)
                    `,
                    border: '1px solid #111',
                    boxShadow: 'inset 0 1px 2px #0008, inset 0 -1px 1px #fff2',
                    touchAction: 'none',
                }}
            >
                <div
                    className="absolute transition-transform duration-75"
                    style={{
                        top: '50%',
                        left: `${percent}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 18,
                        height: 18,
                        background: `
                            repeating-linear-gradient(
                                to bottom,
                                ${thumbColor},
                                ${thumbColor} 3px,
                                #aaa 3px,
                                #aaa 4px
                            )
                        `,
                        borderRadius: thumbShape === 'circle' ? '50%' : '2px',
                        border: '1px solid #000',
                    }}
                />
            </div>
            <div className="text-xs text-right mt-1 text-gray-400">{value}</div>
        </div>
    );
};

export default CustomSlider;
