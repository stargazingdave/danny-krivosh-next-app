// Full fixed Snake Game with wall-delay logic

'use client';

import { useAppContext } from "@/app/AppContext";
import React, { useEffect, useRef, useState } from "react";
import { FaWineBottle } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { TbPillFilled } from "react-icons/tb";

const GRID_HEIGHT = 20;
const GRID_WIDTH = 36;
const CELL_SIZE = 20;
const INITIAL_SPEED = 5;
const MAX_SPEED = 20;
const MIN_SPEED = 2;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Key = Direction | "Escape" | "Enter";

const directionOptions: Key[] = ["UP", "DOWN", "LEFT", "RIGHT"];

const getRandomPosition = (snakePositions: { x: number, y: number }[]) => {
    let x: number, y: number;
    do {
        x = Math.floor(Math.random() * GRID_WIDTH);
        y = Math.floor(Math.random() * GRID_HEIGHT);
    } while ((x === 0 && y === 0) || snakePositions.some(s => s.x === x && s.y === y));
    return { x, y };
};

const getRandomBottle = () => Math.floor(Math.random() * 8) < 5;
const getRandomPill = () => Math.floor(Math.random() * 8) > 5;

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
};

const isOpposite = (dir1: Direction, dir2: Direction) => (
    (dir1 === "UP" && dir2 === "DOWN") ||
    (dir1 === "DOWN" && dir2 === "UP") ||
    (dir1 === "LEFT" && dir2 === "RIGHT") ||
    (dir1 === "RIGHT" && dir2 === "LEFT")
);

interface snakeColor {
    head: string;
    body: string;
}

const snakeColorMap = {
    foodEaten: { head: 'white', body: '#fce54e' },
    bottleEaten: { head: '#00ff22d1', body: '#f7a60d' },
    pillEaten: { head: getRandomColor(), body: getRandomColor() },
    default: { head: '#777', body: '#333' }
};

type EventType = 'foodEaten' | 'bottleEaten' | 'pillEaten';
type ScoreType = 'food' | 'bottle' | 'pill';

const scoreMap: Record<ScoreType, { score: number; color: string }> = {
    food: { score: 1, color: '#d7b964' },
    bottle: { score: 50, color: '#00ff22d1' },
    pill: { score: 15, color: '#590b02' },
};

export const SnakeGame: React.FC = () => {
    const { setSnakeOpen } = useAppContext();
    const [gameStatus, setGameStatus] = useState<'ready' | 'running' | 'gameOver'>('ready');
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(getRandomPosition([{ x: 0, y: 0 }]));
    const [direction, setDirection] = useState<Direction>("RIGHT");
    const [latestEvent, setLatestEvent] = useState<EventType | null>(null);
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [bottle, setBottle] = useState(getRandomPosition([{ x: 0, y: 0 }]));
    const [showBottle, setShowBottle] = useState(false);
    const [pill, setPill] = useState(getRandomPosition([{ x: 0, y: 0 }]));
    const [showPill, setShowPill] = useState(false);
    const [score, setScore] = useState(0);
    const [newScore, setNewScore] = useState<{ score: number; color: string } | null>(null);
    const [snakeColor, setSnakeColor] = useState<snakeColor>(snakeColorMap.default);
    const [snakeColors, setSnakeColors] = useState<string[]>([]);

    const pillColorIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const directionQueueRef = useRef<Direction[]>([]);
    const wallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const selfTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasRestartedRef = useRef(false); // <-- fix stuck game

    const restartGame = () => {
        hasRestartedRef.current = true;
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition([{ x: 0, y: 0 }]));
        setDirection("RIGHT");
        setGameStatus('running');
        setSpeed(INITIAL_SPEED);
        setScore(0);
        setShowBottle(false);
        setShowPill(false);
        setSnakeColor(snakeColorMap.default);
        setSnakeColors([]);
        directionQueueRef.current = [];
        setLatestEvent(null);
        if (wallTimeoutRef.current) clearTimeout(wallTimeoutRef.current);
        if (selfTimeoutRef.current) clearTimeout(selfTimeoutRef.current);
    };

    const getSnakeCellColor = (event: EventType | null) => {
        if (event === 'pillEaten') {
            const initialColors = snake.map(() => getRandomColor());
            setSnakeColors(initialColors);
            pillColorIntervalRef.current = setInterval(() => {
                setSnakeColors(prev => {
                    const newColors = [...prev];
                    const last = newColors.pop();
                    if (last) newColors.unshift(last);
                    return newColors;
                });
            }, 200);
            setTimeout(() => {
                if (pillColorIntervalRef.current) clearInterval(pillColorIntervalRef.current);
                setSnakeColors([]);
                setSnakeColor(snakeColorMap.default);
            }, 3000);
        } else if (event === 'foodEaten') {
            setSnakeColor(snakeColorMap.foodEaten);
        } else if (event === 'bottleEaten') {
            setSnakeColor(snakeColorMap.bottleEaten);
        }

        setTimeout(() => {
            setSnakeColor(snakeColorMap.default);
        }, 1000);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyMap: Record<string, Key> = {
                ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
                w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
                Escape: "Escape", Enter: "Enter",
            };
            const newKey = keyMap[e.key];
            if (!newKey) return;

            if (gameStatus === 'ready' && newKey !== 'Escape') setGameStatus('running');

            if (gameStatus === 'gameOver') {
                if (newKey === 'Escape') setSnakeOpen(false);
                if (newKey === 'Enter') {
                    e.preventDefault();
                    restartGame();
                }
                return;
            }

            if (directionOptions.includes(newKey) && gameStatus === 'running') {
                const last = directionQueueRef.current.at(-1) || direction;
                if (newKey !== last && directionQueueRef.current.length < 3) directionQueueRef.current.push(newKey as Direction);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameStatus, direction]);

    useEffect(() => {
        if (gameStatus !== 'running') return;

        const moveSnake = () => {
            let currentDirection = direction;
            const validIndex = directionQueueRef.current.findIndex(d => !isOpposite(d, direction));
            if (validIndex !== -1) {
                currentDirection = directionQueueRef.current[validIndex];
                directionQueueRef.current = directionQueueRef.current.slice(validIndex + 1);
                setDirection(currentDirection);
            }

            const currentSnake = [...snake];
            const head = { ...currentSnake[0] };
            if (currentDirection === "UP") head.y--;
            else if (currentDirection === "DOWN") head.y++;
            else if (currentDirection === "LEFT") head.x--;
            else if (currentDirection === "RIGHT") head.x++;

            const isOutOfBounds = head.x < 0 || head.y < 0 || head.x >= GRID_WIDTH || head.y >= GRID_HEIGHT;
            const isSelfCollision = currentSnake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y);

            if (isOutOfBounds) {
                if (!wallTimeoutRef.current) {
                    wallTimeoutRef.current = setTimeout(() => {
                        const retryHead = { ...snake[0] };
                        if (currentDirection === "UP") retryHead.y--;
                        else if (currentDirection === "DOWN") retryHead.y++;
                        else if (currentDirection === "LEFT") retryHead.x--;
                        else if (currentDirection === "RIGHT") retryHead.x++;
                        const stillOutOfBounds = retryHead.x < 0 || retryHead.y < 0 || retryHead.x >= GRID_WIDTH || retryHead.y >= GRID_HEIGHT;
                        if (stillOutOfBounds) setGameStatus('gameOver');
                        wallTimeoutRef.current = null;
                    }, 150);
                }
                return;
            } else if (wallTimeoutRef.current) {
                clearTimeout(wallTimeoutRef.current);
                wallTimeoutRef.current = null;
            }

            if (isSelfCollision) {
                if (!selfTimeoutRef.current) {
                    selfTimeoutRef.current = setTimeout(() => {
                        const retryHead = { ...snake[0] };
                        if (currentDirection === "UP") retryHead.y--;
                        else if (currentDirection === "DOWN") retryHead.y++;
                        else if (currentDirection === "LEFT") retryHead.x--;
                        else if (currentDirection === "RIGHT") retryHead.x++;
                        const stillSelfCollision = currentSnake.some((s, i) => i > 0 && s.x === retryHead.x && s.y === retryHead.y);
                        if (stillSelfCollision) setGameStatus('gameOver');
                        selfTimeoutRef.current = null;
                    }, 150);
                }
                return;
            }

            const newSnake = [head, ...currentSnake];

            // Check if snake eats food
            if (head.x === food.x && head.y === food.y) {
                setFood(getRandomPosition(snake));
                setSpeed(prev => Math.min(prev + 1, MAX_SPEED));
                setLatestEvent('foodEaten');
                if (!showBottle) setShowBottle(getRandomBottle());
                if (!showPill) setShowPill(getRandomPill());
            } else {
                newSnake.pop();
            }

            // Check if snake eats bottle
            if (head.x === bottle.x && head.y === bottle.y && showBottle) {
                setBottle(getRandomPosition(snake));
                setLatestEvent('bottleEaten');
                setShowBottle(false);
                setSpeed(Math.min(Math.random() * (MAX_SPEED - MIN_SPEED - Math.random() * 6) + MIN_SPEED, MAX_SPEED));
            }

            // Check if snake eats pill
            if (head.x === pill.x && head.y === pill.y && showPill) {
                setPill(getRandomPosition(snake));
                setLatestEvent('pillEaten');
                setShowPill(false);
                setSpeed(prev => Math.max(prev - 2, MIN_SPEED));
            }

            setSnake(newSnake);
        };

        const interval = setInterval(moveSnake, (MAX_SPEED - speed + 1) * 10);
        return () => clearInterval(interval);
    }, [snake, direction, speed, food, showBottle, showPill, gameStatus]);

    useEffect(() => {
        if (!latestEvent) return;
        getSnakeCellColor(latestEvent);
        if (latestEvent === 'foodEaten') {
            setScore(prev => prev + scoreMap.food.score);
            setNewScore(scoreMap.food);
        } else if (latestEvent === 'bottleEaten') {
            setScore(prev => prev + scoreMap.bottle.score);
            setNewScore(scoreMap.bottle);
        } else if (latestEvent === 'pillEaten') {
            setScore(prev => prev + scoreMap.pill.score);
            setNewScore(scoreMap.pill);
        }
        setTimeout(() => {
            setNewScore(null);
            setLatestEvent(null);
        }, 1000);
    }, [latestEvent]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50" onClick={() => setSnakeOpen(false)}>
            <audio autoPlay loop>
                <source src="http://amp.cesnet.cz:8000/cro-radio-wave.flac" type="audio/mpeg" />
            </audio>

            {
                gameStatus === 'ready' &&
                <div className="absolute inset-0 flex items-center justify-center z-50 animate-pulse-fade">
                    <h1 className="text-4xl text-white italic tracking-widest text-center">
                        PRESS ANY KEY TO PLAY
                    </h1>
                </div>
            }

            <div className="relative bg-gray-900 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()} style={{ boxShadow: "0 0 16px 1px #77777777" }}>
                <div className="relative w-full h-fit flex items-center justify-between">
                    <div className="flex text-center text-2xl font-bold p-2 tracking-widest">
                        <h2>S: {score}</h2>
                        {newScore && <h2 style={{ color: newScore.color }}>+{newScore.score}</h2>}
                    </div>
                    <h2 className="w-48 text-center text-2xl font-bold p-2 tracking-widest" style={{ position: "fixed", left: "calc(50% - 6rem)" }}>- SNAKE -</h2>
                    <button onClick={() => setSnakeOpen(false)} className="w-fit h-fit flex items-center justify-center m-2 rounded-full bg-black text-white text-lg font-bold p-1 hover:bg-red-500 cursor-pointer">
                        <HiX size={26} />
                    </button>
                </div>

                <div className={`grid ${latestEvent === 'bottleEaten' ? 'bg-[#590b02]' : 'bg-black'} transition-colors ease-out`} style={{ width: GRID_WIDTH * CELL_SIZE, height: GRID_HEIGHT * CELL_SIZE, position: "relative", border: "2px solid black" }}>
                    {snake.map((s, i) => (
                        <div key={i} style={{
                            position: "absolute",
                            left: s.x * CELL_SIZE,
                            top: s.y * CELL_SIZE,
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            backgroundColor: snakeColors.length > 0 ? snakeColors[i % snakeColors.length] : (i === 0 ? snakeColor.head : snakeColor.body),
                            boxShadow: latestEvent === 'foodEaten' ? '0 0 8px 1px white' : 'none',
                        }} />
                    ))}

                    <div style={{
                        position: "absolute",
                        left: food.x * CELL_SIZE,
                        top: food.y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: "white",
                        borderRadius: "50%",
                    }} />

                    {showBottle && (
                        <FaWineBottle style={{ position: "absolute", left: bottle.x * CELL_SIZE, top: bottle.y * CELL_SIZE, color: "#00ff22d1", fontSize: "20px" }} />
                    )}

                    {showPill && (
                        <TbPillFilled className="text-red-500" style={{ position: "absolute", left: pill.x * CELL_SIZE, top: pill.y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }} />
                    )}
                </div>

                {gameStatus === 'gameOver' && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-white">
                        <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
                        <div className="flex flex-col items-center justify-center p-4 gap-4">
                            <h2 className="text-2xl">{`Your score:`}</h2>
                            <h1 className="text-6xl font-bold">{score}</h1>
                        </div>
                        <br />
                        <button onClick={restartGame} className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition-all">
                            Restart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
