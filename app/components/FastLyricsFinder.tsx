'use client';

import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";
import { HiXMark } from "react-icons/hi2";
import { FaWindowMinimize } from "react-icons/fa6";
import CustomSlider from "./Slider";

interface FastLyricsFinderProps {}

export const FastLyricsFinder: FC<FastLyricsFinderProps> = () => {
  const { currentSong } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState<"ready" | "searching" | "done">("ready");
  const [lyrics, setLyrics] = useState<string[] | null>(null);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5 * 16);

  useEffect(() => {
    if (currentSong) {
      if (currentSong.id === currentSongId) return;
      setCurrentSongId(currentSong.id);
      setStatus("ready");
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
    setLineHeight(newSize * 1.5);
  };

  const handleClickFind = () => {
    if (!currentSongId) return;
    setStatus("searching");

    fetch(`/lyrics/${currentSongId}.lrc`)
      .then((res) => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
      })
      .then((raw) => {
        const cleanedLines = raw
          .split("\n")
          .filter((line) => !line.startsWith("#"))
          .map((line) =>
            line.replace(/^\[\d{2}:\d{2}(?:\.\d{2})?\]\s?/, "")
          );
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
        <div className="fixed bottom-14 left-[calc(50%-12rem)] resize-x overflow-auto w-96 min-w-96 max-w-[90vw] z-50 bg-gradient-to-br from-[#1b2735] via-[#1f3b4d] to-[#233e52] text-white border border-[#3a5a78] shadow-[4px_4px_0px_#0008] rounded-xl">
          <div className="flex p-1 gap-4 justify-between items-center bg-gradient-to-b from-[#2a4a66] to-[#1f3a55] border-b border-[#3a5a78] shadow-[inset_0_1px_1px_#ffffff20] rounded-t-xl">
            <FaWindowMinimize
              className="w-7 h-7 text-[#cceeff] p-1 border border-[#5a7b96] hover:bg-[#2f4c66] hover:shadow-inner cursor-pointer rounded-sm"
              onClick={() => setIsOpen(!isOpen)}
            />
            <h1 className="w-full text-xl text-center font-bold text-[#c9e7ff] drop-shadow-sm tracking-wide">
              🌙 FAST LYRICS FINDER
            </h1>
          </div>

          <div className="flex flex-col items-center h-96 overflow-auto gap-4 px-3 py-3 bg-gradient-to-b from-[#263c4f] to-[#1c2c3b] rounded-b-xl">
            <p className="text-center text-sm text-[#a6c9e2] italic">
              This might be the lyrics cloud you’re looking for ☁️
            </p>

            {status === "ready" && (
              <button
                className="px-5 py-1.5 bg-gradient-to-b from-[#2c5277] to-[#1e3b5a] border border-[#517a9f] text-[#c9e7ff] font-bold text-sm rounded-md shadow-[inset_0_2px_4px_#ffffff20] hover:brightness-110 hover:shadow-[inset_0_1px_1px_#ffffff10]"
                onClick={handleClickFind}
              >
                FIND LYRICS
              </button>
            )}

            {status === "searching" && <LyricsSearchMock setStatus={setStatus} />}

            {status === "done" &&
              (lyrics === null ? (
                <p className="text-sm text-gray-400">
                  No lyrics found. Probably an instrumental! ✨
                </p>
              ) : (
                <div className="flex flex-col items-center h-96 overflow-auto gap-2 w-full px-2 py-1 bg-[#1d2e3d] border border-[#466e8c] rounded-lg shadow-[inset_0_1px_3px_#111,inset_0_-1px_3px_#000]">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[#7ca0c9] text-lg">-</p>
                    <p className="text-sm text-[#c0dfff] font-mono">
                      Font Size
                    </p>
                    <p className="text-[#7ca0c9] text-lg">+</p>
                  </div>

                  <CustomSlider
                    min={10}
                    max={40}
                    step={1}
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="w-full"
                    thumbColor="#99cfff"
                    thumbShape="square"
                  />

                  <div
                    className="w-full h-full overflow-auto font-mono bg-[#0e1a24] bg-opacity-90 backdrop-blur-md p-2 rounded border border-[#355069] text-[#bcd6ee] shadow-[inset_0_0_4px_#1a2d3a]"
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: `${lineHeight}px`,
                    }}
                  >
                    {lyrics.map((line, i) => (
                      <p
                        key={i}
                        className="whitespace-pre-wrap"
                        dir={isHebrew(line) ? "rtl" : "ltr"}
                        style={{
                          textAlign: isHebrew(line) ? "right" : "left",
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FastLyricsFinderMockProps {
  setStatus: (status: "ready" | "searching" | "done") => void;
}

const LyricsSearchMock: FC<FastLyricsFinderMockProps> = ({ setStatus }) => {
  const stages: ReactNode[] = [
    "lyricsaz.com",
    "lyrics635.com",
    "subtitleseeker.com",
    "lyricsfreak.tw",
    "wordpalace.cz",
    "Retrieving...",
  ].map((site) => (
    <div className="flex flex-col items-center h-96 overflow-auto gap-4">
      <p className="text-sm text-[#c9e7ff]">Searching for lyrics in {site}...</p>
    </div>
  ));

  const [currentStage, setCurrentStage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentStage < stages.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStage((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
      setStatus("done");
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentStage, setStatus]);

  return stages[currentStage];
};
