import { SongData } from "./SongData";

export interface Playlist {
    id: string;
    title: string;
    description: string;
    image?: string;
    songs: SongData[]; // Array of song IDs
    createdAt: string; // ISO date string
}