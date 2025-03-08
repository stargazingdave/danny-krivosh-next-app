'use server';

import { FaSpotify } from "react-icons/fa";
import { FaAmazon, FaYoutube } from "react-icons/fa6";

export default async function AboutPage() {
    const youtubeLink = "https://www.youtube.com/DannyKrivosh";
    const primaryEmail = "gofor@dannykrivosh.com";
    const secondaryEmail = "strifed@gmail.com";

    return (
        <div className="p-4 text-xl text-center">
            <p className="text-white">
                I am a musician and composer from the United States.
            </p>
            <br />
            <p className="text-white">
                I have been writing music for over 20 years and have released several albums.
            </p>
            <br />
            <p className="text-white">
                My music is available on all major streaming platforms.
            </p>
            <br />
            <p className="text-white">
                For business inquiries, please contact me at:
            </p>
            <br />
            <p>
                <a href={`mailto:${primaryEmail}`} className="text-accent text-gray-500">
                    {primaryEmail}
                </a>
            </p>
            <br />
            <p className="text-white">
                You can also find me on <a href={youtubeLink} className="text-accent text-gray-500">YouTube</a>.
            </p>
            <br />
            <br />
            <div className="flex w-full p-4 gap-8 justify-center">
                <FaYoutube className="text-6xl text-accent" />
                <FaAmazon className="text-6xl text-accent" />
                <FaSpotify className="text-6xl text-accent" />
            </div>
        </div>
    );
}

