'use client';

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";
import { HiXMark } from "react-icons/hi2";
import { FaWindowMinimize } from "react-icons/fa6";
import CustomSlider from "./Slider";

interface FastLyricsFinderProps { }

export const FastLyricsFinder: FC<FastLyricsFinderProps> = () => {
    const { currentSong } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [status, setStatus] = useState<'ready' | 'searching' | 'done'>('ready');
    const [lyrics, setLyrics] = useState<string[] | null>(null);
    const [currentSongId, setCurrentSongId] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState(16); // Default font size
    const [lineHeight, setLineHeight] = useState(1.5 * 16); // Default line height

    useEffect(() => {
        if (currentSong) {
            if (currentSong.id === currentSongId) return;
            setCurrentSongId(currentSong.id);
            setStatus('ready');
            setLyrics(null);
        }
    }, [currentSong]);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isHebrew = (text: string) => {
        const firstChar = text.trim().charAt(0);
        return /[֐-׿]/.test(firstChar);
    };

    const handleFontSizeChange = (newSize: number) => {
        setFontSize(newSize);
        const newLineHeight = newSize * 1.5; // Adjust line height based on font size
        setLineHeight(newLineHeight);
    };

    const handleClickFind = () => {
        if (!currentSongId) return;
        setStatus('searching');

        currentSongId &&
            fetch(`/lyrics/${currentSongId}.lrc`)
                .then(res => {
                    if (!res.ok) throw new Error('File not found');
                    return res.text();
                })
                .then(raw => {
                    const cleanedLines = raw
                        .split("\n")
                        .filter(line => !line.startsWith('#'))
                        .map(line => line.replace(/^\[\d{2}:\d{2}(?:\.\d{2})?\]\s?/, ''));
                    setLyrics(cleanedLines);
                })
                .catch(() => setLyrics(null));
    };

    return (
        <div>
            <div className="flex flex-col p-2 text-white text-2xl text-nowrap">
                <button
                    className={`find-button ${!isOpen ? 'sparkle' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={!currentSong}
                    onMouseEnter={e => e.currentTarget.classList.remove('sparkle')}
                    onMouseLeave={e => {
                        if (!isOpen) e.currentTarget.classList.add('sparkle');
                    }}
                >
                    <span className="sparkle-letter">F</span>
                </button>
            </div>

            {isOpen && (
                <div className='fixed bottom-14 left-[calc(50%-12rem)] resize-x overflow-auto w-96 min-w-96 max-w-[90vw] z-50 border border-gray-600 bg-black text-white shadow-[4px_4px_0px_#000]'>
                    <div className="flex p-1 gap-4 justify-between items-center bg-black border-b border-gray-700">
                        <FaWindowMinimize className="w-8 h-8 text-white p-2 border cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
                        <h1 className="w-full text-xl text-center text-white">FAST LYRICS FINDER</h1>
                    </div>

                    <div className="flex flex-col items-center h-96 overflow-auto gap-4 px-2 py-2 bg-black">
                        <p className="text-center text-sm text-gray-300">There may be lyrics available for this song. Click here!</p>

                        {status === 'ready' && (
                            <button
                                className="px-4 py-1 bg-gray-800 border border-gray-700 shadow-[inset_1px_1px_0px_#333] text-sm font-semibold text-white hover:bg-gray-700"
                                onClick={handleClickFind}
                            >
                                FIND
                            </button>
                        )}

                        {status === 'searching' && <LyricsSearchMock setStatus={setStatus} />}

                        {status === 'done' && (
                            lyrics === null ? (
                                <p className="text-sm text-gray-400">none found... probably an instrumental :)</p>
                            ) : (
                                <div className="flex flex-col items-center h-96 overflow-auto gap-2 w-full px-2 py-1 bg-black border border-gray-700 shadow-inner">
                                    <div className="flex justify-between items-center w-full">
                                        <p>-</p>
                                        <p className="text-sm text-gray-400">Font Size</p>
                                        <p>+</p>
                                    </div>

                                    <CustomSlider
                                        min={10}
                                        max={40}
                                        step={1}
                                        value={fontSize}
                                        onChange={handleFontSizeChange}
                                        className="w-full touch-none" // <- touch-none for smoother mobile use
                                        thumbColor="#d0d0d0"
                                        thumbShape="square"
                                    />
                                    <div className="w-full h-full overflow-auto leading-relaxed font-mono"
                                        style={{
                                            color: "#979c61",
                                            fontSize: `${fontSize}px`,
                                            lineHeight: `${lineHeight}px`,
                                        }}>
                                        {lyrics.map((line, i) => (
                                            <p
                                                key={i}
                                                className="whitespace-pre-wrap"
                                                dir={isHebrew(line) ? 'rtl' : 'ltr'}
                                                style={{ textAlign: isHebrew(line) ? 'right' : 'left' }}
                                            >
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

interface FastLyricsFinderMockProps {
    setStatus: (status: 'ready' | 'searching' | 'done') => void;
}

const LyricsSearchMock: FC<FastLyricsFinderMockProps> = ({ setStatus }) => {
    const stages: ReactNode[] = [
        "lyricsaz.com",
        "lyrics635.com",
        "subtitleseeker.com",
        "lyricsfreak.tw",
        "wordpalace.cz",
        "Retrieving..."
    ].map(site => (
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-sm text-white">Searching for lyrics in {site}...</p>
        </div>
    ));

    const [currentStage, setCurrentStage] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (currentStage < stages.length - 1) {
            intervalRef.current = setInterval(() => {
                setCurrentStage(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current!);
            setStatus('done');
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentStage, setStatus]);

    return stages[currentStage];
};