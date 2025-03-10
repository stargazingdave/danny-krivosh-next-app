export interface NativeSong {
    id: string;
    title: string;
    description: string;
    length: number;
    url: string;
    generes: string[];
    image?: string;
}

export interface YouTubeSong {
    id: string;
    embbed: string;
}

export type Song = (NativeSong & { type: 'native' }) | (YouTubeSong & { type: 'youtube' });