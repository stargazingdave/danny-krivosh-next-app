'use client';

import Link from "next/link";
import { FaAmazon, FaYoutube } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";
import { IoLogoSoundcloud } from "react-icons/io5";

export default function AboutIndex() {
    const youtubeLink = "https://www.youtube.com/DannyKrivosh";
    const primaryEmail = "GoFor@DannyKrivosh.com";

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
            }}
        >
            <div className="w-full md:w-[70%]"
                style={{
                    background: "linear-gradient(to bottom, #2c2c2c, #1e1e1e)",
                    border: "2px solid #7a96df",
                    borderRadius: "6px",
                    boxShadow: "0 0 20px rgba(0, 0, 0, 0.8)",
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                    overflow: "hidden",
                    color: "#fff",
                }}
            >
                {/* Title Bar */}
                <div
                    style={{
                        background: "#000",
                        color: "#fff",
                        padding: "6px 10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: "14px",
                        borderBottom: "2px solid #444", // <-- subtle stroke
                        boxShadow: "inset 0 -1px 0 #555", // <-- subtle inner glow
                    }}
                >
                    <span>About Danny Krivosh</span>
                    <Link
                        style={{
                            width: "24px",
                            height: "24px",
                            background: "linear-gradient(to bottom, #f00, #a00)",
                            border: "1px solid #000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "20px", // Bigger X
                            lineHeight: "1",
                            transition: "transform 0.1s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                        href={"/"}
                        title="Close"
                    >
                        <HiXMark size={20} />
                    </Link>


                </div>

                {/* Content */}
                <div style={{ padding: "20px", fontSize: "15px", display: "flex", justifyContent: "center", gap: "20px" }} className="flex-col lg:flex-row">
                    <div style={{ width: "80%" }}>
                        <p>
                            Originally from Ukraine, I am the musician behind some songs and author of <i>"Brown, to Brown. - An Anthology"</i>.
                        </p>
                        <br />
                        <p>I have been writing music throughout my life.</p>
                        <br />
                        <p>
                            My music isn't available on all major streaming platforms.
                            <br />
                            You can find some of it on <b>SoundCloud</b>, but most of it is on <b>YouTube</b>.
                            <br />
                            I also have an <b>Amazon Author Page</b>.
                        </p>
                        <br />
                        <p>
                            We've made this awesome easter-egg-filled site for your convenience and for our joy.
                            <br />
                            Be sure to try the <b>Recycling Bin (DUMPSTER 3000)</b> feature.
                            <br />
                            You can contact me at:
                        </p>
                        <p>
                            <a href={`mailto:${primaryEmail}`} style={{ color: "#70aaff" }}>
                                {primaryEmail}
                            </a>
                        </p>
                        <br />
                        <p>
                            You can also find me on{" "}
                            <a href={youtubeLink} style={{ color: "#ff6b6b" }}>
                                YouTube
                            </a>.
                        </p>
                        <br />

                    </div>
                    <hr
                        style={{
                            border: "none",
                            borderTop: "1px solid #555",
                            margin: "30px 0 15px",
                        }}
                    />
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", fontSize: "13px", color: "#aaa", textAlign: "left", lineHeight: "1.6" }}>
                        <p><b>Version:</b> DK-H2IL (Danny Krivosh – Hebrew Intl. Edition)</p>
                        <p><b>HTML Engine:</b> v5.2.1</p>
                        <p><b>CSS Shell:</b> DarkGlass X</p>
                        <p><b>Build Date:</b> April 2025</p>
                        <p><b>Codename:</b> Dumpster3000</p>

                        <div style={{ flexGrow: "1", display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", padding: "10px 0" }}>
                            <a href={youtubeLink} target="_blank" rel="noreferrer" title="YouTube">
                                <FaYoutube size={32} color="#ff4444" />
                            </a>
                            <a href="https://www.amazon.com/author/dannykrivosh" target="_blank" rel="noreferrer" title="Amazon">
                                <FaAmazon size={32} color="#e2e2e2" />
                            </a>
                            <a href="https://soundcloud.com/danny-krivosh" target="_blank" rel="noreferrer" title="SoundCloud">
                                <IoLogoSoundcloud size={32} color="#ff5408" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
