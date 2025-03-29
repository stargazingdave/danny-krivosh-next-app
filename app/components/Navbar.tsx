'use client';

import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { SnakeGame } from "./Snake/SnakeGame";
import { GiSnakeTongue } from "react-icons/gi";
import { useAppContext } from "../AppContext";
import { AudioPlayer } from "./AudioPlayer";
import Image from "next/image";

type Tab = {
    name: string;
    label: ReactNode;
    onClick: () => void;
};

export const Navbar: FC = () => {
    const {
        snakeOpen,
        setSnakeOpen
    } = useAppContext()
    const router = useRouter();
    const pathname = usePathname();


    const tabs: Tab[] = [
        { name: "snake", label: <GiSnakeTongue size={25} />, onClick: () => setSnakeOpen(true) },
        { name: "home", label: "Home", onClick: () => router.push('/') },
        { name: "about", label: "About", onClick: () => router.push('/about') },
    ];

    const onTabClick = (tab: Tab) => {
        tab.onClick();
    };

    // Disable scrolling when snake is active
    useEffect(() => {
        if (snakeOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [snakeOpen]);

    // Close game on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSnakeOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-full h-16">
            <nav className="flex justify-end items-center p-4">
                <div
                    className="fixed left-4 top-4 text-4xl sm:text-6xl font-light font-aguafina p-2 cursor-pointer z-50 w-32 h-8 sm:w-64 sm:h-16"
                    style={{
                        textShadow: "2px 2px 0px #000, 4px 4px 0px #000",
                    }}
                    onClick={() => router.push("/")}
                >
                    <Image
                        src={"/images/logo/logo.png"}
                        alt="Logo"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="flex gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`cursor-pointer border-transparent border-b hover:border-white transition-all duration-700 ${pathname === "/" && tab.name === "home"
                                ? "text-white text-2xl"
                                : pathname.split("/")[1] === tab.name
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
                {/* {snakeOpen ? <RevisedSnakeGame /> : ""} */}
                {snakeOpen ? <SnakeGame /> : ""}
            </nav>


        </div>
    );
};
