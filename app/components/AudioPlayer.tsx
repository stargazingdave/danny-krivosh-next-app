'use client';

import { FC } from "react";
import { useAppContext } from "../AppContext";
import { FullPlaybackControls } from "./PlaybackControls/FullPlaybackControls";
import { Visualization } from "./Visualization";
import { RiHdFill, RiHdLine } from "react-icons/ri";
import { FastLyricsFinder } from "./FastLyricsFinder";

export const AudioPlayer: FC = () => {
    const {
        isPlaying,
        currentSong,
        progress,
        duration,
        audioRef,
        handleSeek,
        handleTimeUpdate,
        handleLoadedMetadata,
        playNextSong,
        playPrevSong,
        togglePlay,
    } = useAppContext();


    return (
        <div className="relative flex items-center gap-2 p-4 w-full">
            {/* Fast Lyrics Finder */}
            <FastLyricsFinder />

            {/* Playback Controls */}
            <FullPlaybackControls
                songActive={isPlaying}
                onNext={playNextSong}
                onPrevious={playPrevSong}
                onPlayPause={togglePlay}
            />

            {/* Current Time */}
            <p className="text-white text-sm text-nowrap">
                {audioRef?.current && duration
                    ? `${Math.floor(audioRef.current.currentTime / 60)}:${Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, "0")}`
                    : "--:--"}
            </p>

            {/* Progress Bar */}
            <input
                type="range"
                className="w-full h-1 rounded-lg cursor-pointer accent-gray-900"
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
            <p className="text-white text-sm text-nowrap">
                {duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, "0")}` : "--:--"}
            </p>

            {/* HD Icon */}
            {
                currentSong?.definition === "hd" &&
                <RiHdLine size={50} />
            }

            {/* Visualization Component */}
            <div className="fixed left-0 top-0 w-full h-16 -z-10 opacity-10">
                <Visualization type="spectrum" barCount={64} />
            </div>

            {/* Song Details */}
            <div className="hidden sm:flex flex-col p-2 text-white text-sm text-nowrap">
                <p className="font-semibold">{currentSong?.title}</p>
            </div>
        </div>
    );
};
