'use server';

import { cookies } from 'next/headers';

export async function login(password: string) {
    if (password === process.env.DANNY_PASSWORD) {
        const cookieStore = await cookies(); // 👈 FIXED
        cookieStore.set('danny_auth', 'true', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 12, // 12 hours
        });
        return { success: true };
    }
    return { success: false };
}
