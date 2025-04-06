

'use client';

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";
import { HiXMark } from "react-icons/hi2";


interface FastLyricsFinderProps { }

export const FastLyricsFinder: FC<FastLyricsFinderProps> = ({ }) => {
    const {
        currentSong,
    } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [searchClicked, setSearchClicked] = useState(false);

    const handleResize = () => {
        if (window.innerWidth <= 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }

    useEffect(() => {
        handleResize(); // Set initial state
        window.addEventListener("resize", handleResize); // Add event listener
        return () => {
            window.removeEventListener("resize", handleResize); // Cleanup event listener
        };
    }, []);


    if (!isOpen) {
        return (
            <div className="hidden sm:flex flex-col p-2 text-white text-2xl text-nowrap">
                <button
                    className="font-semibold hover:bg-gradient-to-b hover:from-yellow-500 hover:to-green-500 hover:bg-clip-text hover:text-transparent cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    F
                </button>
            </div>
        );
    }



    return (
        <div className='fixed bottom-14 left-[calc(50%-12rem)] w-96 max-w-5/6 z-50 border border-black text-black'>
            <div
                className="flex p-1 gap-8 justify-between"
                style={{
                    backgroundColor: "#46a758c9",
                    backdropFilter: "blur(10px)",
                }}
            >
                <div>
                    <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
                        <HiXMark className="w-8 h-8" />
                    </button>
                </div>
                <h1 className="w-full text-2xl text-center font-bold">
                    Fast Lyrics Finder
                </h1>
            </div>

            <div
                className="flex flex-col items-center h-96 overflow-auto gap-4"
                style={{
                    backgroundColor: "#46a758c9",
                    backdropFilter: "blur(10px)",
                }}
            >
                <p className="text-center text-lg mt-2">
                    There may be lyrics available for this song. Click here!
                </p>
                {
                    searchClicked
                        ? <LyricsSearchMock />
                        : <button
                            className="w-fit h-12 flex px-4 py-1 items-center justify-center bg-gray-400 font-semibold rounded-lg cursor-pointer tracking-widest hover:bg-black hover:text-white transition duration-300 ease-in-out"
                            onClick={() => setSearchClicked(true)}
                        >
                            FIND
                        </button>
                }

            </div>
        </div>
    );
};

interface FastLyricsFinderMockProps { }

const LyricsSearchMock: FC<FastLyricsFinderMockProps> = ({ }) => {
    const stages: ReactNode[] = [
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-center text-lg mt-2">Searching for lyrics in lyricsaz.com...</p>
        </div>,
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-center text-lg mt-2">Searching for lyrics in lyrics635.com...</p>
        </div>,
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-center text-lg mt-2">Searching for lyrics in subtitleseeker.com...</p>
        </div>,
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-center text-lg mt-2">Searching for lyrics in lyricsfreak.tw...</p>
        </div>,
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-center text-lg mt-2">Searching for lyrics in wordpalace.cz...</p>
        </div>,
        <div className="flex flex-col items-center h-96 overflow-auto gap-4">
            <p className="text-center text-lg mt-2">Retrieving...</p>
        </div>,
    ];

    const [currentStage, setCurrentStage] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (currentStage < stages.length - 1) {
            intervalRef.current = setInterval(() => {
                setCurrentStage((prev) => prev + 1);
            }, 1000); // Change stage every second
        } else {
            clearInterval(intervalRef.current!);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentStage, stages.length]);

    return <div className="flex flex-col items-center h-96 overflow-auto gap-4">
        {stages[currentStage]}
        {
            
        }
    </div>;
}