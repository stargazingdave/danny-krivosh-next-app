'use client';

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";
import { HiXMark } from "react-icons/hi2";

interface FastLyricsFinderProps { }

export const FastLyricsFinder: FC<FastLyricsFinderProps> = () => {
    const { currentSong } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [status, setStatus] = useState<'ready' | 'searching' | 'done' | 'show'>('ready');
    const [lyrics, setLyrics] = useState<string | null>(null);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClickFind = () => {
        setStatus('searching');
        const songId = currentSong?.id;

        songId && fetch(`/lyrics/${songId}.lrc`)
            .then(res => res.text())
            .then(raw => {
                const cleaned = raw
                    .split("\n")
                    .filter(line => !line.startsWith('#'))
                    .map(line => line.replace(/^\[\d{2}:\d{2}(?:\.\d{2})?\]\s?/, ''))
                    .join("\n");
                setLyrics(cleaned);
            })
            .catch(() => setLyrics(null));
    };

    return (
        <div>
            <div className="hidden sm:flex flex-col p-2 text-white text-2xl text-nowrap">
                <button
                    className="font-semibold hover:bg-gradient-to-b hover:from-yellow-500 hover:to-green-500 hover:bg-clip-text hover:text-transparent cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={!currentSong}
                >
                    F
                </button>
            </div>

            {/* Main Container */}
            {isOpen && (
                <div className='fixed bottom-14 left-[calc(50%-12rem)] w-96 max-w-5/6 z-50 border border-black text-black'>
                    <div className="flex p-1 gap-8 justify-between" style={{ backgroundColor: "#46a758c9", backdropFilter: "blur(10px)" }}>
                        <div>
                            <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
                                <HiXMark className="w-8 h-8" />
                            </button>
                        </div>
                        <h1 className="w-full text-2xl text-center font-bold">
                            Fast Lyrics Finder
                        </h1>
                    </div>

                    <div className="flex flex-col items-center h-96 overflow-auto gap-4" style={{ backgroundColor: "#46a758c9", backdropFilter: "blur(10px)" }}>
                        <p className="text-center text-lg mt-2">There may be lyrics available for this song. Click here!</p>

                        {status === 'ready' && (
                            <button
                                className="w-fit h-12 flex px-4 py-1 items-center justify-center bg-gray-400 font-semibold rounded-lg cursor-pointer tracking-widest hover:bg-black hover:text-white transition duration-300 ease-in-out"
                                onClick={handleClickFind}
                            >
                                FIND
                            </button>
                        )}

                        {status === 'searching' && <LyricsSearchMock setStatus={setStatus} />}

                        {status === 'done' && (
                            lyrics === null ? (
                                <div className="flex flex-col items-center h-96 overflow-auto gap-4">
                                    <p className="text-center text-lg mt-2">No lyrics found.</p>
                                    <button
                                        className="w-fit h-12 flex px-4 py-1 items-center justify-center bg-gray-400 font-semibold rounded-lg cursor-pointer tracking-widest hover:bg-black hover:text-white transition duration-300 ease-in-out"
                                        onClick={() => setStatus('ready')}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center h-96 overflow-auto gap-4">
                                    <p className="text-center text-lg mt-2">Lyrics found!</p>
                                    <button
                                        className="w-fit h-12 flex px-4 py-1 items-center justify-center bg-gray-400 font-semibold rounded-lg cursor-pointer tracking-widest hover:bg-black hover:text-white transition duration-300 ease-in-out"
                                        onClick={() => setStatus('show')}
                                    >
                                        Show Lyrics
                                    </button>
                                </div>
                            )
                        )}

                        {status === 'show' && (
                            <div className="flex flex-col items-center h-96 overflow-auto gap-4 px-4">
                                <div className="w-full h-full overflow-auto whitespace-pre-wrap leading-relaxed font-mono text-sm">
                                    {lyrics}
                                </div>
                            </div>
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
            <p className="text-center text-lg mt-2">Searching for lyrics in {site}...</p>
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
