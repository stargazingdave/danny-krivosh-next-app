'use client';

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { login } from "../actions/login";

export default function LoginIndex() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(password);
            router.push('/settings');
        } catch {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div className="w-full h-full min-h-[calc(100vh-13rem)] flex justify-center items-center">
            <div className="w-full max-w-md bg-white/10 rounded-xl shadow-md shadow-white/30 p-8">
                <h1 className="text-2xl font-bold mb-4">🔒 Protected Login</h1>
                <p className="text-gray-400 mb-6">Enter the password to access the settings page:</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-800"
                    />

                    <button
                        type="submit"
                        className="w-full bg-amber-800 text-white py-2 rounded-md hover:bg-amber-700 transition-colors cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                {error && (
                    <p className="text-red-600 mt-4 font-medium text-sm text-center">{error}</p>
                )}
            </div>
        </div>
    );
}