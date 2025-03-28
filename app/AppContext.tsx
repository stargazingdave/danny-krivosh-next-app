'use client';

import React from 'react';
import { SongData } from './types/SongData';
import { Playlist } from './types/Playlist';

interface AppContextProps {
    snakeOpen: boolean;
    setSnakeOpen: React.Dispatch<React.SetStateAction<boolean>>;

    currentSong: SongData | null;
    setCurrentSong: React.Dispatch<React.SetStateAction<SongData | null>>;
    currentPlaylist: Playlist;
    setCurrentPlaylistId: React.Dispatch<React.SetStateAction<string>>;
    isPlaying: boolean;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    duration: number;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    isRandom: Record<string, boolean>;

    audioRef: React.RefObject<HTMLAudioElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    analyserRef: React.RefObject<AnalyserNode | null>;

    togglePlay: () => void;
    handleTimeUpdate: () => void;
    handleLoadedMetadata: () => void;
    handleSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;

    playlists: Playlist[];
    setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;

    setOriginalOrder: (playlistId: string) => void;
    setRandomOrder: (playlistId: string) => void;
    getPlaylistSongs: (playlistId: string) => SongData[];
    playNextSong: () => void;
    playPrevSong: () => void;
    addSongToRecycle: (song: SongData) => void;
    startPlaylist: (playlistId: string, startIndex?: number) => void;
}

const AppContext = React.createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
    children: React.ReactNode;
    initialPlaylists: Playlist[];
}

export const AppProvider: React.FC<AppProviderProps> = ({
    children,
    initialPlaylists,
}) => {
    const [snakeOpen, setSnakeOpen] = React.useState<boolean>(false);

    const [currentSong, setCurrentSong] = React.useState<SongData | null>(null);
    const [currentPlaylistId, setCurrentPlaylistId] = React.useState<string>('all-songs');
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [isRandom, setIsRandom] = React.useState<Record<string, boolean>>({
        home: false,
        recycle: false,
    });

    const [originalOrders, setOriginalOrders] = React.useState<Record<string, SongData[]>>({});
    const [shuffledOrders, setShuffledOrders] = React.useState<Record<string, SongData[]>>({});
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

    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                console.warn("Autoplay failed, user interaction required.");
            });
        }
    }, [currentSong]);

    const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId) || playlists[0];

    const getPlaylistSongs = (playlistId: string) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return [];
        if (isRandom[playlistId] && shuffledOrders[playlistId]) {
            return shuffledOrders[playlistId];
        }
        return playlist.songs;
    };


    const getCurrentPlaylistSongs = () => {
        if (isRandom[currentPlaylist.id] && shuffledOrders[currentPlaylist.id]) {
            return shuffledOrders[currentPlaylist.id];
        }
        return currentPlaylist.songs;
    };

    const playNextSong = () => {
        const songs = getCurrentPlaylistSongs();
        if (!currentSong) return;
        const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
        const nextSong = songs[currentIndex + 1];
        setCurrentSong(nextSong ?? null);
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

    const setOriginalOrder = (playlistId: string) => {
        setIsRandom(prev => ({ ...prev, [playlistId]: false }));
        if (currentSong && originalOrders[playlistId]) {
            setCurrentSong(originalOrders[playlistId].find(s => s.id === currentSong.id) ?? originalOrders[playlistId][0]);
        }
    };

    const setRandomOrder = (playlistId: string) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        setOriginalOrders(prevOriginal => ({
            ...prevOriginal,
            [playlistId]: playlist.songs
        }));

        const shuffled = [...playlist.songs];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setShuffledOrders(prevShuffled => ({
            ...prevShuffled,
            [playlistId]: shuffled
        }));

        if (currentSong) {
            setCurrentSong(shuffled.find(s => s.id === currentSong.id) ?? shuffled[0]);
        }

        setIsRandom(prev => ({ ...prev, [playlistId]: true }));
    };

    const playPrevSong = () => {
        const songs = getCurrentPlaylistSongs();
        if (!currentSong) return;
        const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
        const prevSong = songs[currentIndex - 1];
        setCurrentSong(prevSong ?? null);
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
            setCurrentPlaylistId(playlist.id);
            const songs = isRandom[playlist.id] && shuffledOrders[playlist.id] ? shuffledOrders[playlist.id] : playlist.songs;
            setCurrentSong(songs[startIndex || 0]);
        }
    };

    return (
        <AppContext.Provider value={{
            snakeOpen,
            setSnakeOpen,
            currentSong,
            setCurrentSong,
            currentPlaylist,
            setCurrentPlaylistId,
            isPlaying,
            progress,
            setProgress,
            duration,
            setDuration,
            isRandom,

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
            getPlaylistSongs,
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