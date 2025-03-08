'use client';

import { useRouter } from "next/navigation";
import { FC, useState } from "react";


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

    const tabs: Tab[] = [
        {
            name: "home",
            label: "Home",
            href: "/",
        },
        {
            name: "about",
            label: "About",
            href: "/about",
        },
    ];

    const onTabClick = (tab: Tab) => {
        setActiveTab(tab);
        router.push(tab.href);
    };

    return <div className="w-full">
        <nav className="flex justify-between items-center p-4">
            <div
                className="text-5xl font-light font-aguafina p-2 cursor-pointer"
                onClick={() => router.push("/")}
            >
                Danny Krivosh
            </div>
            <div className="flex gap-4">
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
        </nav>
    </div>
}