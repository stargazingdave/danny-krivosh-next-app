'use client';

import { FC, useState } from "react";
import { IconType } from "react-icons";

type LinkIconData = {
    icon: IconType;
    link: string;
    color: string;
    hoverColor: string;
};

interface SocialLinkIconsProps {
    data: LinkIconData[];
}

export const SocialLinkIcons: FC<SocialLinkIconsProps> = ({ data }) => {
    return (
        <div className="flex w-full p-4 gap-8 justify-center">
            {data.map((item, index) => {
                const Icon = item.icon;
                return <HoverColorIcon key={index} Icon={Icon} color={item.color} hoverColor={item.hoverColor} link={item.link} />;
            })}
        </div>
    );
};

const HoverColorIcon = ({
    Icon,
    color,
    hoverColor,
    link,
}: {
    Icon: IconType;
    color: string;
    hoverColor: string;
    link: string;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Icon
                className="text-6xl cursor-pointer transition-colors duration-300"
                style={{ color: isHovered ? hoverColor : color }}
            />
        </a>
    );
};