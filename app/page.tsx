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
      title: "Song 2",
      description: "The second song",
      length: 240,
      url: "https://strifed.wordpress.com/wp-content/uploads/2012/02/danny_krivosh_-_answers_none.mp3?_=1",
      generes: ["pop"]
    },
    {
      id: "3",
      title: "Song 3",
      description: "The third song",
      length: 200,
      url: "https://example.com/song3.mp3",
      generes: ["rock"]
    },
    {
      id: "4",
      title: "Song 4",
      description: "The fourth song",
      length: 220,
      url: "https://example.com/song4.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "5",
      title: "Song 5",
      description: "The fifth song",
      length: 190,
      url: "https://example.com/song5.mp3",
      generes: ["pop"]
    },
    {
      id: "6",
      title: "Song 6",
      description: "The sixth song",
      length: 210,
      url: "https://example.com/song6.mp3",
      generes: ["rock"]
    },
    {
      id: "7",
      title: "Song 7",
      description: "The seventh song",
      length: 230,
      url: "https://example.com/song7.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "8",
      title: "Song 8",
      description: "The eighth song",
      length: 250,
      url: "https://example.com/song8.mp3",
      generes: ["pop"]
    },
    {
      id: "9",
      title: "Song 9",
      description: "The ninth song",
      length: 260,
      url: "https://example.com/song9.mp3",
      generes: ["rock"]
    },
    {
      id: "10",
      title: "Song 10",
      description: "The tenth song",
      length: 270,
      url: "https://example.com/song10.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "11",
      title: "Song 11",
      description: "The eleventh song",
      length: 280,
      url: "https://example.com/song11.mp3",
      generes: ["pop"]
    },
    {
      id: "12",
      title: "Song 12",
      description: "The twelfth song",
      length: 290,
      url: "https://example.com/song12.mp3",
      generes: ["rock"]
    },
    {
      id: "13",
      title: "Song 13",
      description: "The thirteenth song",
      length: 300,
      url: "https://example.com/song13.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "14",
      title: "Song 14",
      description: "The fourteenth song",
      length: 310,
      url: "https://example.com/song14.mp3",
      generes: ["pop"]
    },
    {
      id: "15",
      title: "Song 15",
      description: "The fifteenth song",
      length: 320,
      url: "https://example.com/song15.mp3",
      generes: ["rock"]
    },
    {
      id: "16",
      title: "Song 16",
      description: "The sixteenth song",
      length: 330,
      url: "https://example.com/song16.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "17",
      title: "Song 17",
      description: "The seventeenth song",
      length: 340,
      url: "https://example.com/song17.mp3",
      generes: ["pop"]
    },
    {
      id: "18",
      title: "Song 18",
      description: "The eighteenth song",
      length: 350,
      url: "https://example.com/song18.mp3",
      generes: ["rock"]
    },
    {
      id: "19",
      title: "Song 19",
      description: "The nineteenth song",
      length: 360,
      url: "https://example.com/song19.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "20",
      title: "Song 20",
      description: "The twentieth song",
      length: 370,
      url: "https://example.com/song20.mp3",
      generes: ["pop"]
    },
    {
      id: "21",
      title: "Song 21",
      description: "The twenty-first song",
      length: 380,
      url: "https://example.com/song21.mp3",
      generes: ["rock"]
    },
    {
      id: "22",
      title: "Song 22",
      description: "The twenty-second song",
      length: 390,
      url: "https://example.com/song22.mp3",
      generes: ["rock", "pop"]
    },
    {
      id: "23",
      title: "Song 23",
      description: "The twenty-third song",
      length: 400,
      url: "https://example.com/song23.mp3",
      generes: ["pop"]
    },
    {
      id: "24",
      title: "Song 24",
      description: "The twenty-fourth song",
      length: 410,
      url: "https://example.com/song24.mp3",
      generes: ["rock"]
    },
    {
      id: "25",
      title: "Song 25",
      description: "The twenty-fifth song",
      length: 420,
      url: "https://example.com/song25.mp3",
      generes: ["rock", "pop"]
    },
  ];

  return (
    <div className="flex flex-col font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col">
        <SongGrid songs={songs} />
      </main>
    </div>
  );
}
