'use client';

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import SnakeGame from "./Snake/SnakeGame";

type Tab = {
    name: string;
    label: string;
    href: string;
};

export const Navbar: FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>({
        name: "home",
        label: "Home",
        href: "/",
    });

    const [snakeActive, setSnakeActive] = useState(false);

    const tabs: Tab[] = [
        { name: "home", label: "Home", href: "/" },
        { name: "about", label: "About", href: "/about" },
    ];

    const onTabClick = (tab: Tab) => {
        setActiveTab(tab);
        router.push(tab.href);
    };

    // Disable scrolling when snake is active
    useEffect(() => {
        if (snakeActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [snakeActive]);

    // Close game on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSnakeActive(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-full h-16">
            <nav className="flex justify-end items-center p-4">
                <div
                    className="fixed left-4 top-4 text-4xl sm:text-6xl font-light font-aguafina p-2 cursor-pointer shadow-md"
                    onClick={() => router.push("/")}
                >
                    Danny Krivosh
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSnakeActive(true)} className="text-green text-lg">
                        S
                    </button>
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`cursor-pointer border-transparent border-b hover:border-white transition-all duration-700 ${activeTab.name === tab.name
                                ? tab.name === "home"
                                    ? "text-white text-2xl"
                                    : "text-white text-3xl"
                                : "text-gray-500"
                                }`}
                            onClick={() => onTabClick(tab)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overlay for Snake Game */}
                {snakeActive ? (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
                        onClick={() => setSnakeActive(false)} // Clicking outside closes the game
                    >
                        <div className="relative p-4 bg-gray-900 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setSnakeActive(false)}
                                className="absolute top-2 right-2 text-white text-lg font-bold"
                            >
                                ✕
                            </button>
                            <SnakeGame />
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </nav>


        </div>
    );
};
