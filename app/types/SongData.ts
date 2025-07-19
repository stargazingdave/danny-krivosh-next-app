export interface SongData {
    id: string;
    title: string;
    description: string;
    url?: string;
    generes: string[];
    image?: string;
    definition?: 'hd' | 'sd';
}
