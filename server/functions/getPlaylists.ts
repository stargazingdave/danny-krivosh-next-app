import { Playlist } from "@/app/types/Playlist";
import { SongData } from "@/app/types/SongData";

export const getPlaylists = async (allSongs: SongData[]) => {
    const playlists: Playlist[] = [
        {
            id: 'all-songs',
            title: 'All Songs',
            description: 'All Songs',
            songs: allSongs,
            createdAt: new Date().toISOString(),
        },
        {
            id: 'recycle',
            title: 'Recycle Bin',
            description: 'Songs you decided to throw away but not really',
            songs: [],
            createdAt: new Date().toISOString(),
        }
    ];
    return playlists;
};
