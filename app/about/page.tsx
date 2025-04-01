'use server';

import { FaSpotify } from "react-icons/fa";
import { FaAmazon, FaYoutube } from "react-icons/fa6";

export default async function AboutPage() {
    const youtubeLink = "https://www.youtube.com/DannyKrivosh";
    const primaryEmail = "GoFor@DannyKrivosh.com";
    const secondaryEmail = "strifed@gmail.com";

    return (
        <div className="p-4 text-xl text-center">
            <p className="text-white">
                <br></br>Originally from Ukraine, <br></br>
                <br></br>I am the musician behind some songs and author of "Brown, to Brown. - An Anthology".
            </p>
            <br />
            <p className="text-white">
                I have been writing music throughout my life.
            </p>
            <br />
            <p className="text-white">
                My music isn't available on all major streaming platforms.
                <br></br>
                You can find some  of it on SoundCloud, but most of it is on YouTube.
                <br></br>
                I also have an Amazon Author Page.
            </p>
            <br />
            <p className="text-white">
                We've made this awesome easter-egg-filled site for your conveinience and for our joy.
                <br>
                </br>
                <br>
                </br>Be sure to try the Recycling Bin (DUMPSTER 3000) feature.<br></br>
                <br></br>You can contact me at: 
            </p>
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

