import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { del } from '@vercel/blob';
import { uploadFileToVercelBlob } from './functions/uploadFileToVercelBlob';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type ExtraBody = {
    operation?: 'upload' | 'delete';
    dir?: string;
    allowedContentTypes?: string[];
    addRandomSuffix?: boolean;
    clientPayload?: string;
    // for delete:
    url?: string;        // absolute Blob URL
    pathname?: string;   // e.g. "songs/abc123-file.wav"
};

function isBlobSdkPhase(body: any) {
    return body && typeof body === 'object' &&
        (body.type === 'blob.generate-client-token' || body.type === 'blob.upload-completed');
}

export async function POST(request: Request) {
    try {
        // 1) Blob SDK phases (token generation / upload completed) — no custom "operation"
        const json = await uploadFileToVercelBlob(request);

        return NextResponse.json(json);
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 400 }
        );
    }
}
