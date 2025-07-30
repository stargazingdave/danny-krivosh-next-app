export type SongData = {
    id: string;
    title: string;
    description?: string;
    url?: string; // audio file URL
    image?: string; // cover image URL
    genres?: string[]; // fixed typo
    definition?: 'hd' | 'sd';
    lyrics?: string; // raw lyrics content as string (loaded from file)
    createdAt?: string; // optional timestamp
};
