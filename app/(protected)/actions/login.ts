'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';  // for optional redirects

export async function login(password: string) {
    const validPassword = process.env.DANNY_PASSWORD;
    if (password === validPassword) {
        const cookieStore = await cookies(); // 👈 FIXED
        // Set an HttpOnly cookie to authenticate the user (expires in 12 hours)
        cookieStore.set({
            name: 'danny_auth',
            value: 'true',
            httpOnly: true,    // not accessible via JavaScript
            secure: true,      // only sent over HTTPS (disable or set to false for localhost dev if needed)
            path: '/',         // cookie valid for entire site (or use '/protected' to scope it)
            maxAge: 60 * 60 * 12  // 12 hours in seconds
        });
        // (Optionally, could return a success flag or redirect directly here)
        return true;
    } else {
        // Invalid password: throw an error to be caught by the calling code
        throw new Error('Invalid password');
    }
}

export async function logout() {
    const cookieStore = await cookies(); // 👈 FIXED
    // Remove the auth cookie by setting it to expire immediately
    cookieStore.set({
        name: 'danny_auth',
        value: '',
        path: '/',       // ensure the path matches the cookie to be removed
        maxAge: 0
    });
    // Redirect the user to the login page after logging out
    redirect('/login');
}
