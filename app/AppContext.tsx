'use client';

import React from 'react';
import { SongData } from './types/SongData';
import { Playlist } from './types/Playlist';

interface AppContextProps {
    allSongs: SongData[];

    snakeOpen: boolean;
    setSnakeOpen: React.Dispatch<React.SetStateAction<boolean>>;

    currentSong: SongData | null;
    setCurrentSong: React.Dispatch<React.SetStateAction<SongData | null>>;
    currentPlaylist: Playlist;
    setCurrentPlaylist: React.Dispatch<React.SetStateAction<Playlist>>;
    isPlaying: boolean;
    // setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    duration: number;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    analyserRef: React.RefObject<AnalyserNode | null>;

    togglePlay: () => void;
    handleTimeUpdate: () => void;
    handleLoadedMetadata: () => void;
    handleSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;

    playlists: Playlist[];
    setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;

    setOriginalOrder: () => void;
    setRandomOrder: () => void;
    playNextSong: () => void;
    playPrevSong: () => void;
    addSongToRecycle: (song: SongData) => void;
    startPlaylist: (playlistId: string, startIndex?: number) => void;
}

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
    children: React.ReactNode;
    allSongs: SongData[];
    initialPlaylists: Playlist[];
}

export const AppProvider: React.FC<AppProviderProps> = ({
    children,
    allSongs,
    initialPlaylists,
}) => {
    const [snakeOpen, setSnakeOpen] = React.useState<boolean>(false);

    const [currentSong, setCurrentSong] = React.useState<SongData | null>(null);
    const [currentPlaylist, setCurrentPlaylist] = React.useState<Playlist>(initialPlaylists[0]);
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);

    const [playlists, setPlaylists] = React.useState<Playlist[]>(initialPlaylists);

    const audioRef = React.useRef<HTMLAudioElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const audioCtxRef = React.useRef<AudioContext | null>(null);
    const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null);
    const analyserRef = React.useRef<AnalyserNode | null>(null);

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio || sourceRef.current) return;

        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();

        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;

        const resumeAudio = () => {
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }
        };

        window.addEventListener("click", resumeAudio);
        return () => window.removeEventListener("click", resumeAudio);
    }, []);

    // Set the audio source when the current song changes
    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                console.warn("Autoplay failed, user interaction required.");
            });
        }
    }, [currentSong]);

    const playNextSong = () => {
        if (!currentSong) return;
        const currentIndex = currentPlaylist.songs.findIndex((s) => s.id === currentSong.id);
        const nextSong = currentPlaylist.songs[currentIndex + 1];
        if (nextSong) {
            setCurrentSong(nextSong);
        } else {
            setCurrentSong(null); // or loop to start?
        }
    };

    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener('ended', playNextSong);
        return () => audio.removeEventListener('ended', playNextSong);
    }, [playNextSong]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio && audio.duration && !isNaN(audio.duration)) {
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(event.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(Number(event.target.value));
        }
    };

    const setOriginalOrder = () => {
        setCurrentPlaylist(playlists.find((p) => p.id === currentPlaylist.id)!);
    }

    const setRandomOrder = () => {
        setCurrentPlaylist((prev) => {
            const shuffledSongs = [...prev.songs].sort(() => Math.random() - 0.5);
            return { ...prev, songs: shuffledSongs };
        });
    };

    const playPrevSong = () => {
        if (!currentSong) return;
        const currentIndex = currentPlaylist.songs.findIndex((s) => s.id === currentSong.id);
        const prevSong = currentPlaylist.songs[currentIndex - 1];
        if (prevSong) {
            setCurrentSong(prevSong);
        } else {
            setCurrentSong(null); // or loop to end?
        }
    };

    const addSongToRecycle = (song: SongData) => {
        setPlaylists((prev) => {
            const recyclePlaylist = prev.find((p) => p.id === 'recycle');
            if (recyclePlaylist) {
                return prev.map((p) =>
                    p.id === 'recycle' ? { ...p, songs: [...p.songs, song] } : p
                );
            }
            return prev;
        });
    };

    const startPlaylist = (playlistId: string, startIndex?: number) => {
        const playlist = playlists.find((p) => p.id === playlistId);
        if (playlist) {
            setCurrentPlaylist(playlist);
            setCurrentSong(playlist.songs[startIndex || 0]);
        }
    };


    return (
        <AppContext.Provider value={{
            allSongs,
            snakeOpen,
            setSnakeOpen,
            currentSong,
            setCurrentSong,
            currentPlaylist,
            setCurrentPlaylist,
            isPlaying,
            // setIsPlaying,
            progress,
            setProgress,
            duration,
            setDuration,
            audioRef,
            canvasRef,
            analyserRef,

            togglePlay,
            handleTimeUpdate,
            handleLoadedMetadata,
            handleSeek,

            playlists,
            setPlaylists,

            setOriginalOrder,
            setRandomOrder,
            playNextSong,
            playPrevSong,
            addSongToRecycle,
            startPlaylist,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};