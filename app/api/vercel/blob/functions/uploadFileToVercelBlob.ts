// app/api/blob/functions/uploadFileToVercelBlob.ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function uploadFileToVercelBlob(request: Request) {
    const body = (await request.json()) as HandleUploadBody & {
        dir?: string; allowedContentTypes?: string[]; addRandomSuffix?: boolean; clientPayload?: string;
    };

    const json = await handleUpload({
        body,
        request,
        token: process.env.SONGS_BLOB_READ_WRITE_TOKEN!, // or BLOB_READ_WRITE_TOKEN
        onBeforeGenerateToken: async (pathname) => {
            const prefix = body.dir?.replace(/^\/|\/$/g, '');
            const finalPath = prefix ? `${prefix}/${pathname}` : pathname;

            return {
                pathname: finalPath,
                allowedContentTypes: body.allowedContentTypes ?? [
                    'audio/wav', 'audio/mpeg', 'image/png', 'image/jpeg', 'image/webp'
                ],
                // ✅ set these on the server side:
                addRandomSuffix: true,          // or body.addRandomSuffix ?? true
                allowOverwrite: false,          // set to true if you want overwrites
                // cacheControlMaxAge: 31536000, // (optional) seconds, if you want
                tokenPayload: body.clientPayload ?? '',
            };
        },
        // no onUploadCompleted needed unless you want the webhook
    });

    return json;
}
