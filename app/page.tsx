import { SongGrid } from "./components/SongGrid";

export default function Home() {
  

  const songs = [
    {
      id: "1",
      title: "Answers None",
      description: "Instrumental, Atmospheric, Noise",
      length: 180,
      url: "https://strifed.wordpress.com/wp-content/uploads/2012/02/danny_krivosh_-_answers_none.mp3",
      generes: ["rock", "pop"],
      image: "/song_images/answers-none.webp",
    },
    {
      id: "2",
      title: "8",
      description: "Instrumental, rock",
      length: 240,
      url: "https://strifed.wordpress.com/wp-content/uploads/2012/06/theonewithmoremushroomo1.mp3",
      generes: ["rock"],
      image: "/song_images/8.webp",
    },
    {
      id: "3",
      title: "A Reflection of You",
      description: "Slowbeat, rock, psychedelic",
      length: 200,
      url: "https://example.com/song3.mp3",
      generes: ["rock"],
      image: "/song_images/a-reflection-of-you.jpg",
    },
    {
      id: "4",
      title: "No Country",
      description: "Instrumental, folk",
      length: 220,
      url: "https://example.com/song4.mp3",
      generes: ["rock", "pop"],
      image: "/song_images/no-country.jpg",
    },
    {
      id: "5",
      title: "Under",
      description: "Metal, Atmospheric",
      length: 190,
      url: "https://example.com/song5.mp3",
      generes: ["pop"],
      image: "/song_images/under.webp",
    },
    {
      id: "6",
      title: "Poor Man's Vision",
      description: "Ballad, Rock",
      length: 210,
      url: "https://example.com/song6.mp3",
      generes: ["rock"],
      image: "/song_images/poor-mans-vision.webp",
    },
    {
      id: "7",
      title: "Serenade",
      description: "Atmospheric",
      length: 230,
      url: "https://example.com/song7.mp3",
      generes: ["rock", "pop"],
      image: "/song_images/serenade.webp",
    },
    {
      id: "8",
      title: "Son of God",
      description: "Acoustic, Ballad",
      length: 250,
      url: "https://example.com/song8.mp3",
      generes: ["pop"],
      image: "/song_images/son-of-god.webp",
    },
    {
      id: "9",
      title: "Remain Unfold",
      description: "Electronic, Rock",
      length: 260,
      url: "https://example.com/song9.mp3",
      generes: ["rock"],
      image: "/song_images/remain-unfold.jpg",
    },
    {
      id: "10",
      title: "Static",
      description: "Instrumental",
      length: 270,
      url: "https://example.com/song10.mp3",
      generes: ["rock", "pop"],
      image: "/song_images/static.webp",
    },
    {
      id: "11",
      title: "Taste",
      description: "Metal, Soundtrack",
      length: 280,
      url: "https://example.com/song11.mp3",
      generes: ["pop"],
      image: "/song_images/taste.webp",
    },
    {
      id: "12",
      title: "The Extra Color",
      description: "Ballad, Rock",
      length: 290,
      url: "https://example.com/song12.mp3",
      generes: ["rock"],
      image: "/song_images/the-extra-color.webp",
    },
    {
      id: "13",
      title: "Thought of a Kid (Part 1)",
      description: "Electronic, Rock",
      length: 300,
      url: "https://example.com/song13.mp3",
      generes: ["rock", "pop"],
      image: "/song_images/thought-of-a-kid-part-1.webp",
    },
    {
      id: "14",
      title: "Thought of a Kid (Part 2)",
      description: "Electronic, Mood",
      length: 310,
      url: "https://example.com/song14.mp3",
      generes: ["pop"],
      image: "/song_images/thought-of-a-kid-part-2.jpg",
    },
    {
      id: "15",
      title: "Use Art",
      description: "Slowbeat, Rock",
      length: 320,
      url: "https://example.com/song15.mp3",
      generes: ["rock"],
      image: "/song_images/use-art.webp",
    },
    {
      id: "16",
      title: "Vitality",
      description: "Instrumental, Electronic",
      length: 330,
      url: "https://example.com/song16.mp3",
      generes: ["rock", "pop"],
      image: "/song_images/vitality.webp",
    },
    {
      id: "17",
      title: "Feel",
      description: "Indie, Folk",
      length: 340,
      url: "https://example.com/song17.mp3",
      generes: ["pop"],
      image: "/song_images/feel.jpg",
    },
  ];

  const youtubeSongs = [
    {
      id: "18",
      embbed: `<iframe width="100% !important" height="100% !important" src="https://www.youtube.com/embed/FNowo1KKQrM?si=EW0-VYQ10SCUGscy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
    },
    {
      id: "19",
      embbed: `<iframe width="100% !important" height="100% !important" src="https://www.youtube.com/embed/vCXx68kyJTg?si=EP_1cYgpU_UoHZTL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    },
    {
      id: "20",
      embbed: `<iframe width="100% !important" height="100% !important" src="https://www.youtube.com/embed/jLyXCHVmGAI?si=wSd2UR1w6HQgDXl7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    }
  ]

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col">
        <SongGrid songs={songs} youtubeSongs={youtubeSongs} />
      </main>
    </div>
  );
}
