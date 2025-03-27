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
    currentPlayList: Playlist;
    setCurrentPlayList: React.Dispatch<React.SetStateAction<Playlist>>;
    playlists: Playlist[];
    setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;

    setOriginalOrder: () => void;
    setRandomOrder: () => void;
    playNextSong: () => void;
    playPrevSong: () => void;
    addSongToRecycle: (song: SongData) => void;
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
    const [currentPlayList, setCurrentPlayList] = React.useState<Playlist>(initialPlaylists[0]);

    const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

    const setOriginalOrder = () => {
        setCurrentPlayList(playlists.find((p) => p.id === currentPlayList.id)!);
    }

    const setRandomOrder = () => {
        setCurrentPlayList((prev) => {
            const shuffledSongs = [...prev.songs].sort(() => Math.random() - 0.5);
            return { ...prev, songs: shuffledSongs };
        });
    };

    const playNextSong = () => {
        if (!currentSong) return;
        const currentIndex = currentPlayList.songs.findIndex((s) => s.id === currentSong.id);
        const nextSong = currentPlayList.songs[currentIndex + 1];
        if (nextSong) {
            setCurrentSong(nextSong);
        } else {
            setCurrentSong(null); // or loop to start?
        }
    };

    const playPrevSong = () => {
        if (!currentSong) return;
        const currentIndex = currentPlayList.songs.findIndex((s) => s.id === currentSong.id);
        const prevSong = currentPlayList.songs[currentIndex - 1];
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


    return (
        <AppContext.Provider value={{
            allSongs,
            snakeOpen,
            setSnakeOpen,
            currentSong,
            setCurrentSong,
            currentPlayList,
            setCurrentPlayList,
            playlists,
            setPlaylists,

            setOriginalOrder,
            setRandomOrder,
            playNextSong,
            playPrevSong,
            addSongToRecycle,
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