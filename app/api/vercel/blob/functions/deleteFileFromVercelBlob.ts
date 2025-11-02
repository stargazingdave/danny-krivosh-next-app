import { del } from "@vercel/blob";

export async function deleteFileFromVercelBlob(identifier: any) {
    if (!identifier) {
        return { error: 'Missing url or pathname for delete' };
    }

    // del() accepts either a full URL or a pathname
    await del(identifier);

    return { ok: true };
}