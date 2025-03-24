'use client';

import { useAppContext } from "@/app/AppContext";
import React, { useEffect, useState } from "react";
import { FaWineBottle } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { TbPillFilled } from "react-icons/tb";

const GRID_HEIGHT = 20;
const GRID_WIDTH = 36;
const CELL_SIZE = 20; // Pixels per cell
const INITIAL_SPEED = 1; // Movement speed in ms
const MAX_SPEED = 10;
const MIN_SPEED = 0.2;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT),
});

const getRandomBottle = () => Math.floor(Math.random() * 8) === 5;
const getRandomPill = () => Math.floor(Math.random() * 8) === 5;

// Function to get any random color possible
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

interface snakeColor {
    head: string;
    body: string;
}

interface SnakeColorMap {
    [key: string]: snakeColor;
}

const snakeColorMap: SnakeColorMap = {
    foodEaten: {
        head: 'white',
        body: '#777777',
    },
    bottleEaten: {
        head: '#00ff22d1',
        body: '#f7a60d',
    },
    pillEaten: {
        head: getRandomColor(),
        body: getRandomColor(),
    },
    default: {
        head: '#777777',
        body: '#333333',
    }
}

type EventType = 'foodEaten' | 'bottleEaten' | 'pillEaten';

type ScoreType = 'food' | 'bottle' | 'pill';
interface Score {
    score: number;
    color: string;
}

const scoreMap: Record<ScoreType, Score> = {
    food: { score: 1, color: '#d7b964' },
    bottle: { score: 50, color: '#00ff22d1' },
    pill: { score: 15, color: '#590b02' },
}

export const SnakeGame: React.FC = () => {
    const {
        setSnakeOpen
    } = useAppContext();

    const [gameStatus, setGameStatus] = useState<'ready' | 'running' | 'gameOver'>('ready');
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(getRandomPosition);
    const [direction, setDirection] = useState<Direction>("RIGHT");
    const [latestEvent, setLatestEvent] = useState<EventType | null>(null);
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [bottle, setBottle] = useState(getRandomPosition);
    const [showBottle, setShowBottle] = useState(false);
    const [score, setScore] = useState(0);
    const [newScore, setNewScore] = useState<Score | null>(null);
    const [pill, setPill] = useState(getRandomPosition);
    const [showPill, setShowPill] = useState(false);
    const [snakeColor, setSnakeColor] = useState<snakeColor>(snakeColorMap.default);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyMap: Record<string, Direction> = {
                ArrowUp: "UP",
                ArrowDown: "DOWN",
                ArrowLeft: "LEFT",
                ArrowRight: "RIGHT",
                w: "UP",
                s: "DOWN",
                a: "LEFT",
                d: "RIGHT",
            };
            if (e.key !== 'Escape' && gameStatus === 'ready') {
                setGameStatus('running');
            }
            if (keyMap[e.key] && gameStatus === 'running') {
                setDirection((prev) =>
                    keyMap[e.key] === "UP" && prev === "DOWN"
                        ? prev
                        : keyMap[e.key] === "DOWN" && prev === "UP"
                            ? prev
                            : keyMap[e.key] === "LEFT" && prev === "RIGHT"
                                ? prev
                                : keyMap[e.key] === "RIGHT" && prev === "LEFT"
                                    ? prev
                                    : keyMap[e.key]
                );
            };
            if (gameStatus === 'gameOver') {
                if (e.key === 'Escape') {
                    setSnakeOpen(false);
                }
                if (e.key === 'Enter') {
                    restartGame();
                }
            };
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameStatus]);

    useEffect(() => {
        if (gameStatus === 'gameOver' || gameStatus === 'ready') return;
        const moveSnake = () => {
            setSnake((prevSnake) => {
                const newSnake = [...prevSnake];
                const head = { ...newSnake[0] };

                switch (direction) {
                    case "UP":
                        head.y -= 1;
                        break;
                    case "DOWN":
                        head.y += 1;
                        break;
                    case "LEFT":
                        head.x -= 1;
                        break;
                    case "RIGHT":
                        head.x += 1;
                        break;
                }

                // Check collision with walls
                if (
                    head.x < 0 ||
                    head.y < 0 ||
                    head.x >= GRID_WIDTH ||
                    head.y >= GRID_HEIGHT
                ) {
                    setGameStatus('gameOver');
                    return prevSnake;
                }

                // Check collision with itself
                if (newSnake.some((segment, index) => index !== 1 && index !== 2 && segment.x === head.x && segment.y === head.y)) {
                    setGameStatus('gameOver');
                    return prevSnake;
                }

                // Add new head
                newSnake.unshift(head);

                // Check if food eaten
                if (head.x === food.x && head.y === food.y) {
                    const newSpeed = ((speed + 0.5) > MAX_SPEED) ? MAX_SPEED : (speed + 0.5);
                    setFood(getRandomPosition());
                    setSpeed(newSpeed);
                    setLatestEvent('foodEaten');
                    setTimeout(() => setLatestEvent(null), 1000);
                    if (!showBottle) setShowBottle(getRandomBottle());
                    if (!showPill) setShowPill(getRandomPill());
                    console.log(`New speed: ${newSpeed}`);
                } else {
                    newSnake.pop();
                }

                // Check if bottle eaten
                if (head.x === bottle.x && head.y === bottle.y && showBottle) {
                    setBottle(getRandomPosition());
                    setLatestEvent('bottleEaten');
                    setShowBottle(false);
                    setTimeout(() => setLatestEvent(null), 1000);
                }

                // Check if pill eaten
                if (head.x === pill.x && head.y === pill.y && showPill) {
                    setPill(getRandomPosition());
                    setLatestEvent('pillEaten');
                    setShowPill(false);
                    setTimeout(() => setLatestEvent(null), 1000);
                }

                getSnakeCellColor();

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, (MAX_SPEED - speed) * 10);
        return () => clearInterval(interval);
    }, [direction, food, gameStatus]);

    // Update speed when bottle is eaten
    useEffect(() => {
        const head = { ...snake[0] };
        // Check if bottle eaten
        if (head.x === bottle.x && head.y === bottle.y && showBottle) {
            const newSpeed = Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED + 1)) + MIN_SPEED;
            setSpeed(newSpeed);
            console.log(`New speed: ${newSpeed}`);
        }
    }, [showBottle]);

    // Update speed when pill is eaten
    useEffect(() => {
        const head = { ...snake[0] };
        // Check if pill eaten
        if (head.x === pill.x && head.y === pill.y && showPill) {
            setSpeed((prev) => prev - 2);
            console.log(`New speed: ${speed}`);
        }
    }, [showPill]);

    useEffect(() => {
        if (latestEvent === 'foodEaten') {
            setScore((prev) => prev + scoreMap.food.score);
            setNewScore(scoreMap.food);

        }
        if (latestEvent === 'bottleEaten') {
            setScore((prev) => prev + scoreMap.food.score);
            setNewScore(scoreMap.bottle);
            setTimeout(() => setNewScore(null), 3000);
        }
        if (latestEvent === 'pillEaten') {
            setScore((prev) => prev + scoreMap.food.score);
            setNewScore(scoreMap.pill);
            setTimeout(() => setNewScore(null), 3000);
        }
    }, [latestEvent]);

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition());
        setDirection("RIGHT");
        setGameStatus('running');
        setSpeed(INITIAL_SPEED);
        setBottle(getRandomPosition());
    };

    const getSnakeCellColor = () => {
        if (latestEvent === 'foodEaten') {
            setSnakeColor(snakeColorMap.foodEaten);
            // setTimeout(() => setNewScore(null), 3000);
            // setSnakeColor(snakeColorMap.default);
        } else if (latestEvent === 'bottleEaten') {
            setSnakeColor(snakeColorMap.bottleEaten);
            // setTimeout(() => setNewScore(null), 3000);
            // setSnakeColor(snakeColorMap.default);
        } else if (latestEvent === 'pillEaten') {
            setSnakeColor(snakeColorMap.pillEaten);
            // setTimeout(() => setNewScore(null), 3000);
            // setSnakeColor(snakeColorMap.default);
        } else {
            setSnakeColor(snakeColorMap.default);
        }
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50"
            onClick={() => setSnakeOpen(false)}
        >
            <div
                className="relative bg-gray-900 rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{
                    boxShadow: "0 0 16px 1px #77777777",
                }}
            >
                <div className="relative w-full h-fit flex items-center justify-between">
                    <div className="flex text-center text-2xl font-bold p-2 tracking-widest">
                        <h2>
                            S: {score}
                        </h2>
                        {newScore && <h2 style={{ color: newScore.color }}>{`+${newScore.score}`}</h2>}

                    </div>
                    <h2
                        className="w-48 text-center text-2xl font-bold p-2 tracking-widest"
                        style={{
                            position: "fixed",
                            left: "calc(50% - 6rem)",
                        }}
                    >
                        - SNAKE -
                    </h2>
                    <button
                        onClick={() => setSnakeOpen(false)}
                        className="w-fit h-fit flex items-center justify-center m-2 rounded-full bg-black text-white text-lg font-bold p-1 hover:bg-red-500 cursor-pointer"
                    >
                        <HiX size={26} />
                    </button>
                </div>
                <div
                    className={`grid ${latestEvent === 'bottleEaten' ? 'bg-[#590b02]' : 'bg-black'} transition-colors ease-out`}
                    style={{
                        width: GRID_WIDTH * CELL_SIZE,
                        height: GRID_HEIGHT * CELL_SIZE,
                        position: "relative",
                        border: "2px solid black",
                    }}
                >
                    {/* Snake */}
                    {snake.map((segment, index) => (
                        <div
                            key={index}
                            className=""
                            style={{
                                left: segment.x * CELL_SIZE,
                                top: segment.y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                position: "absolute",
                                backgroundColor: index === 0 ? snakeColor.head : snakeColor.body,
                                boxShadow: latestEvent === 'foodEaten' ? '0 0 8px 1px white' : 'none',
                            }}
                        />
                    ))}

                    {/* Food */}
                    <div
                        className="bg-white"
                        style={{
                            left: food.x * CELL_SIZE,
                            top: food.y * CELL_SIZE,
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            position: "absolute",
                            borderRadius: "50%",
                        }}
                    />

                    {/* Bottle */}
                    {showBottle && (
                        <FaWineBottle
                            style={{
                                position: "absolute",
                                left: bottle.x * CELL_SIZE,
                                top: bottle.y * CELL_SIZE,
                                color: "#00ff22d1",
                                fontSize: "20px",
                            }}
                        />
                    )}

                    {/* Pill */}
                    {showPill && (
                        <TbPillFilled
                            className="text-red-500"
                            style={{
                                left: pill.x * CELL_SIZE,
                                top: pill.y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                position: "absolute",
                                borderRadius: "50%",
                            }}
                        />
                    )}
                </div>

                {gameStatus === 'gameOver' && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-white">
                        <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
                        <button
                            onClick={restartGame}
                            className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition-all"
                        >
                            Restart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SnakeGame;
