'use client';

import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { SnakeGame } from "./Snake/SnakeGame";
import { GiSnakeTongue } from "react-icons/gi";
import { useAppContext } from "../AppContext";
import Image from "next/image";
import { IoHomeSharp } from "react-icons/io5";
import { BsQuestionLg } from "react-icons/bs";
import Checkbox from "./Checkbox";

type Tab = {
    name: string;
    label: ReactNode;
    onClick: () => void;
};

export const Navbar: FC = () => {
    const {
        snakeOpen,
        setSnakeOpen,
        isRandom,
        setOriginalOrder,
        setRandomOrder,
    } = useAppContext()
    const router = useRouter();
    const pathname = usePathname();


    const tabs: Tab[] = [
        { name: "snake", label: <Image className="m-1" src={"/images/snake/snakexl-logo.svg"} alt="snake" width={30} height={30} />, onClick: () => setSnakeOpen(true) },
        { name: "home", label: <IoHomeSharp size={30} />, onClick: () => router.push('/') },
        { name: "about", label: <BsQuestionLg size={32}/>, onClick: () => router.push('/about') },
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

    const playlistId = 'all-songs';

    return (
        <div className="w-full h-full">
            <nav className="relative flex justify-end items-center h-full">
                <div
                    className="absolute left-2 top-0 cursor-pointer w-[22rem] z-55 h-[5rem]"
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
                <div className='absolute top-4 w-64 justify-center gap-4 hidden sm:flex' style={{ left: 'calc(50% - 8rem)' }}>
                    <Checkbox
                        label="Original"
                        checked={!isRandom[playlistId]}
                        onChange={() => setOriginalOrder(playlistId)}
                    />
                    <Checkbox
                        label="Random"
                        checked={!!isRandom[playlistId]}
                        onChange={() => setRandomOrder(playlistId)}
                    />
                </div>

                <Tabs
                    tabs={tabs}
                    onTabClick={onTabClick}
                    pathname={pathname}
                />

                {/* Overlay for Snake Game */}
                {/* {snakeOpen ? <RevisedSnakeGame /> : ""} */}
                {snakeOpen ? <SnakeGame /> : ""}
            </nav>


        </div>
    );
};

interface TabProps {
    tabs: Tab[];
    onTabClick: (tab: Tab) => void;
    pathname: string;
}

const Tabs: FC<TabProps> = ({ tabs, onTabClick, pathname }) => {
    return <div className="flex gap-4">
        {tabs.map((tab) => (
            <button
                key={tab.name}
                className={`cursor-pointer border-transparent border-b hover:border-white transition-all duration-700 ${pathname === "/" && tab.name === "home"
                    ? "text-white text-2xl"
                    : pathname.split("/")[1] === tab.name
                        ? "text-white text-2xl"
                        : "text-white"
                    }`}
                onClick={() => onTabClick(tab)}
            >
                {tab.label}
            </button>
        ))}
    </div>
}

