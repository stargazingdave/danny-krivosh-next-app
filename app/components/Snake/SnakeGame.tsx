// Full fixed Snake Game with wall-delay logic

'use client';

import { useAppContext } from "@/app/AppContext";
import { createRainSound } from "@/app/functions/createRainSound";
import { playThunder } from "@/app/functions/playThunder";
import React, { useEffect, useRef, useState } from "react";
import { FaWineBottle } from "react-icons/fa6";
import { HiX } from "react-icons/hi";
import { TbPillFilled } from "react-icons/tb";
import { LiaJointSolid } from "react-icons/lia";
import Checkbox from "../Checkbox";
import { IoSettingsOutline } from "react-icons/io5";

type GridSizeKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type GridSize = { width: number; height: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Key = Direction | "Escape" | "Enter";
type Position = { x: number; y: number };

const GRID_SIZES: Record<GridSizeKey, {
    width: number;
    height: number;
}> = {
    xs: {
        width: 20,
        height: 12,
    },
    sm: {
        width: 24,
        height: 16,
    },
    md: {
        width: 28,
        height: 20,
    },
    lg: {
        width: 32,
        height: 24,
    },
    xl: {
        width: 50,
        height: 28,
    },
};

const calculateGridSize = (containerWidth: number, containerHeight: number): GridSize => {
    const isNotMobile = window.innerWidth > 640 ? 0 : 1;
    return {
        width: Math.floor((containerWidth - 600 - (isNotMobile * 100)) / CELL_SIZE),
        height: Math.floor((containerHeight - 300 - (isNotMobile * 200)) / CELL_SIZE),
    };
};

const getGridSize = () => {
    const width = window.innerWidth;
    if (width < 400) return GRID_SIZES.xs;
    if (width < 640) return GRID_SIZES.sm;
    if (width < 1024) return GRID_SIZES.md;
    if (width < 1440) return GRID_SIZES.lg;
    return GRID_SIZES.xl;
};

const CELL_SIZE = 20;
const INITIAL_SPEED = 5;
const MAX_SPEED = 18;
const MIN_SPEED = 2;



const directionOptions: Key[] = ["UP", "DOWN", "LEFT", "RIGHT"];

const getRandomPosition = (
    blocked: { x: number; y: number }[],
    gridSize: GridSize
) => {
    let x: number, y: number;
    const width = gridSize.width;
    const height = gridSize.height;

    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (blocked.some(p => p.x === x && p.y === y));

    return { x, y };
};


const getRandomBottle = () => Math.floor(Math.random() * 8) < 5;
const getRandomPill = () => Math.floor(Math.random() * 8) > 5;
const getRandomJoint = () => Math.floor(Math.random() * 8) < 5;

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
    glow: string;
}

const snakeColorMap: Record<string, snakeColor> = {
    foodEaten: { head: 'white', body: '#fce54e', glow: '0 0 8px 1px white' },
    bottleEaten: { head: '#00ff22d1', body: '#f7a60d', glow: 'none' },
    pillEaten: { head: getRandomColor(), body: getRandomColor(), glow: 'none' },
    jointEaten: { head: 'pink', body: 'pink', glow: '0 0 8px 1px cyan' },
    default: { head: '#777', body: '#333', glow: 'none' },
};

type EventType = 'foodEaten' | 'bottleEaten' | 'pillEaten' | 'jointEaten' | null;
type ScoreType = 'food' | 'bottle' | 'pill' | 'joint';

const scoreMap: Record<ScoreType, { score: number; color: string }> = {
    food: { score: 1, color: '#d7b964' },
    bottle: { score: 50, color: '#00ff22d1' },
    pill: { score: 30, color: '#FCEB12' },
    joint: { score: 7, color: 'cyan' },
};

export const SnakeGame: React.FC = () => {
    const { setSnakeOpen } = useAppContext();

    const [soundOn, setSoundOn] = useState(false);
    const [gameStatus, setGameStatus] = useState<'ready' | 'running' | 'gameOver' | 'settings'>('ready');
    const [previousGameStatus, setPreviousGameStatus] = useState<'ready' | 'running' | 'gameOver' | 'settings'>('ready');

    const [score, setScore] = useState(0);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [direction, setDirection] = useState<Direction>("RIGHT");

    const directionQueueRef = useRef<Direction[]>([]);
    const wallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const selfTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasRestartedRef = useRef(false); // <-- fix stuck game

    const [newScore, setNewScore] = useState<{ score: number; color: string } | null>(null);
    const [latestEvent, setLatestEvent] = useState<EventType | null>(null);
    const [snakeColor, setSnakeColor] = useState<snakeColor>(snakeColorMap.default);
    const [snakeColors, setSnakeColors] = useState<string[]>([]);

    const [food, setFood] = useState(getRandomPosition([{ x: 0, y: 0 }], getGridSize()),);

    const [bottle, setBottle] = useState(getRandomPosition([{ x: 0, y: 0 }], getGridSize()));
    const [showBottle, setShowBottle] = useState(false);

    const [pill, setPill] = useState(getRandomPosition([{ x: 0, y: 0 }], getGridSize()));
    const [showPill, setShowPill] = useState(false);
    const pillColorIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [joint, setJoint] = useState(getRandomPosition([{ x: 0, y: 0 }], getGridSize()));
    const [showJoint, setShowJoint] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const [gridSize, setGridSize] = useState<GridSize>({ width: 20, height: 20 }); // default before measure
    const [darkModeFix, setDarkModeFix] = useState(false);

    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                const rawWidth = containerRef.current.offsetWidth;
                const rawHeight = containerRef.current.offsetHeight;

                const cols = Math.floor(rawWidth / CELL_SIZE);
                const rows = Math.floor(rawHeight / CELL_SIZE);

                const newSize = { width: cols, height: rows };
                setGridSize(newSize);

                setFood(getRandomPosition(snake, newSize));
                setBottle(getRandomPosition(snake, newSize));
                setPill(getRandomPosition(snake, newSize));
                setJoint(getRandomPosition(snake, newSize));
            }
        };

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);


    const restartGame = () => {
        hasRestartedRef.current = true;
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition([{ x: 0, y: 0 }], gridSize));
        setDirection("RIGHT");
        setGameStatus('running');
        setSpeed(INITIAL_SPEED);
        setScore(0);
        setShowBottle(false);
        setShowPill(false);
        setShowJoint(false);
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
        } else if (event === 'jointEaten') {
            setSnakeColor(snakeColorMap.jointEaten);
        }

        setTimeout(() => {
            setSnakeColor(snakeColorMap.default);
        }, 1000);
    };

    const handleTouchDirection = (newDir: Direction) => {
        const last = directionQueueRef.current.at(-1) || direction;
        if (newDir !== last && directionQueueRef.current.length < 3) {
            directionQueueRef.current.push(newDir);
        }

        if (gameStatus === 'ready') setGameStatus('running');
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
                if (directionQueueRef.current.length < 3) {
                    if (newKey !== last) {
                        directionQueueRef.current.push(newKey as Direction);
                    } else {
                        directionQueueRef.current = [newKey as Direction];
                    }
                }
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

            const isOutOfBounds =
                head.x < 0 || head.y < 0 || head.x >= gridSize.width || head.y >= gridSize.height;
            if (isOutOfBounds) {
                if (!wallTimeoutRef.current) {
                    wallTimeoutRef.current = setTimeout(() => {
                        const retryHead = { ...snake[0] };
                        if (currentDirection === "UP") retryHead.y--;
                        else if (currentDirection === "DOWN") retryHead.y++;
                        else if (currentDirection === "LEFT") retryHead.x--;
                        else if (currentDirection === "RIGHT") retryHead.x++;
                        const stillOutOfBounds = retryHead.x < 0 || retryHead.y < 0 || retryHead.x >= gridSize.width || retryHead.y >= gridSize.height;
                        if (stillOutOfBounds) setGameStatus('gameOver');
                        wallTimeoutRef.current = null;
                    }, 150);
                }
                return;
            } else if (wallTimeoutRef.current) {
                clearTimeout(wallTimeoutRef.current);
                wallTimeoutRef.current = null;
            }

            const isSelfCollision = currentSnake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y);
            if (isSelfCollision) {
                if (!selfTimeoutRef.current) {
                    selfTimeoutRef.current = setTimeout(() => {
                        const retryHead = { ...snake[0] };
                        if (currentDirection === "UP") retryHead.y--;
                        else if (currentDirection === "DOWN") retryHead.y++;
                        else if (currentDirection === "LEFT") retryHead.x--;
                        else if (currentDirection === "RIGHT") retryHead.x++;

                        const stillSelfCollision = snake.some((s, i) => i > 0 && s.x === retryHead.x && s.y === retryHead.y);
                        if (stillSelfCollision) setGameStatus('gameOver');

                        selfTimeoutRef.current = null;
                    }, 150);
                }
                return;
            } else if (selfTimeoutRef.current) {
                clearTimeout(selfTimeoutRef.current);
                selfTimeoutRef.current = null;
            }

            const newSnake = [head, ...currentSnake];

            // Check if snake eats food
            if (head.x === food.x && head.y === food.y) {
                setFood(getRandomPosition(snake, gridSize));
                setSpeed(prev => Math.min(prev + 1, MAX_SPEED));
                setLatestEvent('foodEaten');
                if (!showBottle) setShowBottle(getRandomBottle());
                if (!showPill) setShowPill(getRandomPill());
                if (!showJoint) setShowJoint(getRandomJoint());
            } else {
                newSnake.pop();
            }

            // Check if snake eats bottle
            if (head.x === bottle.x && head.y === bottle.y && showBottle) {
                setBottle(getRandomPosition(snake, gridSize));
                setLatestEvent('bottleEaten');
                setShowBottle(false);
                setSpeed(Math.min(Math.random() * (MAX_SPEED - MIN_SPEED - Math.random() * 6) + MIN_SPEED, MAX_SPEED));
            }

            // Check if snake eats pill
            if (head.x === pill.x && head.y === pill.y && showPill) {
                setPill(getRandomPosition(snake, gridSize));
                setLatestEvent('pillEaten');
                setShowPill(false);
                setSpeed(prev => Math.max(prev - 2, MIN_SPEED));
            }

            // Check if snake eats joint
            if (head.x === joint.x && head.y === joint.y && showJoint) {
                setJoint(getRandomPosition(snake, gridSize));
                setLatestEvent('jointEaten');
                setShowJoint(false);
                setSpeed(8);
            }

            setSnake(newSnake);
        };

        const interval = setInterval(moveSnake, (MAX_SPEED - speed + 1) * 10);
        return () => clearInterval(interval);
    }, [snake, direction, speed, food, showBottle, showPill, showJoint, gameStatus]);

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
        } else if (latestEvent === 'jointEaten') {
            setScore(prev => prev + scoreMap.joint.score);
            setNewScore(scoreMap.joint);
        }
        setTimeout(() => {
            setNewScore(null);
            setLatestEvent(null);
        }, 1000);
    }, [latestEvent]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleResize = () => {
        if (containerRef.current) {
            const { offsetWidth, offsetHeight } = containerRef.current;

            const newGridSize = calculateGridSize(offsetWidth, offsetHeight); // ✅ USE THIS
            setGridSize(newGridSize);

            setFood(getRandomPosition(snake, newGridSize));
            setBottle(getRandomPosition(snake, newGridSize));
            setPill(getRandomPosition(snake, newGridSize));
            setJoint(getRandomPosition(snake, newGridSize));
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const audioCtxRef = useRef<AudioContext | null>(null)

    const startSound = () => {
        const ctx = new AudioContext()
        audioCtxRef.current = ctx
        createRainSound(ctx)

        // random thunder every 5-15 seconds
        const interval = setInterval(() => {
            playThunder(ctx)
        }, Math.random() * 10000 + 5000)

        return () => clearInterval(interval)
    }

    const stopSound = () => {
        if (audioCtxRef.current) {
            audioCtxRef.current.close()
            audioCtxRef.current = null
        }
    }

    const toggleSound = () => {
        setSoundOn(prev => !prev)
        if (soundOn) {
            stopSound()
        } else {
            startSound()
        }
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
            style={{
                backgroundColor: "color-mix(in oklab, var(--color-black) /* #000 = #000000 */ 88%, transparent)"
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) setSnakeOpen(false)
            }}
        >
            {/* MAIN GAME BOX */}
            <div
                className="fixed top-16 w-full h-[calc(100%-4rem)] bg-transparent overflow-hidden"
                style={{ boxShadow: "0 0 16px 1px #77777777" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* READY SCREEN */}
                {gameStatus === 'ready' && (
                    <div className="absolute inset-0 flex items-center justify-center z-40 animate-pulse-fade pointer-events-none">
                        <h1 className="text-4xl text-white italic tracking-widest text-center">
                            {
                                gridSize.width < 25
                                    ? "INSERT COIN TO PLAY"
                                    : "PRESS ANY KEY TO START"
                            }
                        </h1>
                    </div>
                )}

                {/* HEADER */}
                <div className="relative z-10 w-full h-11 flex items-center justify-between p-2">
                    <div className="flex items-center text-center text-2xl font-bold tracking-widest p-2 gap-2">
                        <button
                            onClick={() => {
                                const prev = gameStatus;
                                setPreviousGameStatus(prev);
                                setGameStatus('settings');
                            }}
                        >
                            <IoSettingsOutline size={26} className="text-white" />
                        </button>
                        <h2>S: {score}</h2>
                        {newScore && <h2 style={{ color: newScore.color }}>+{newScore.score}</h2>}
                    </div>
                    <div className="fixed left-[calc(50% - 8rem)] flex w-64 items-center justify-center gap-2" style={{ left: "calc(50% - 8rem)" }}>
                        <h2 className="text-2xl font-bold tracking-widest">SNAKE</h2>
                        <h2 className="font-extrabold italic text-yellow-300 tracking-widest"
                            style={{
                                WebkitTextStroke: '2px gray',
                                fontSize: '2.75rem',
                            }}>
                            XL
                        </h2>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        {/* <div className="flex flex-col items-center justify-center gap-1">
                            <div className="text-sm w-40 text-start flex gap-2">
                                <Checkbox checked={soundOn} onChange={() => toggleSound()} />
                                <p className="w-full">ADD RAIN</p>
                            </div>
                            <div className="text-sm w-40 text-start flex gap-2">
                                <Checkbox />
                                <p className="w-full">ADD THUNDER</p>
                            </div>
                        </div> */}
                        <button
                            onClick={() => setSnakeOpen(false)}
                            className="w-fit h-fit flex items-center justify-center m-2 rounded-full bg-black text-white text-lg font-bold p-1 hover:bg-red-500 cursor-pointer"
                        >
                            <HiX size={26} />
                        </button>
                    </div>
                </div>

                <div className="relative z-20 flex justify-center w-full h-full">
                    {/* GAME GRID */}
                    <div ref={containerRef} className="w-full h-full relative flex flex-col items-center overflow-hidden">
                        <div
                            className="absolute top-16 transition-colors ease-out border border-gray-600"
                            style={{
                                width: gridSize.width * CELL_SIZE,
                                height: gridSize.height * CELL_SIZE,
                                backgroundColor: latestEvent === 'bottleEaten' ? '#590b02' : 'black',
                            }}
                        >
                            {snake.map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: s.x * CELL_SIZE,
                                        top: s.y * CELL_SIZE,
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                        backgroundColor:
                                            snakeColors.length > 0
                                                ? snakeColors[i % snakeColors.length]
                                                : i === 0
                                                    ? snakeColor.head
                                                    : snakeColor.body,
                                        boxShadow: snakeColorMap[latestEvent || 'default'].glow,
                                    }}
                                />
                            ))}

                            {/* FOOD */}
                            <div
                                className="snake-food"
                                style={{
                                    left: food.x * CELL_SIZE,
                                    top: food.y * CELL_SIZE,
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    backgroundColor: darkModeFix ? '#777777' : 'white',
                                }}
                            />

                            {showBottle && (
                                <FaWineBottle
                                    style={{
                                        position: 'absolute',
                                        left: bottle.x * CELL_SIZE,
                                        top: bottle.y * CELL_SIZE,
                                        color: '#00ff22d1',
                                        fontSize: '20px',
                                    }}
                                />
                            )}

                            {showPill && (
                                <TbPillFilled
                                    className="text-red-500"
                                    style={{
                                        position: 'absolute',
                                        left: pill.x * CELL_SIZE,
                                        top: pill.y * CELL_SIZE,
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                    }}
                                />
                            )}

                            {showJoint && (
                                <LiaJointSolid
                                    className="text-[pink]"
                                    style={{
                                        position: 'absolute',
                                        left: joint.x * CELL_SIZE,
                                        top: joint.y * CELL_SIZE,
                                        width: CELL_SIZE,
                                        height: CELL_SIZE,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* GAME OVER SCREEN */}
                    {gameStatus === 'gameOver' && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-white">
                            <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
                            <div className="flex flex-col items-center justify-center p-4 gap-4">
                                <h2 className="text-2xl">Your score:</h2>
                                <h1 className="text-6xl font-bold">{score}</h1>
                            </div>
                            <br />
                            <button
                                onClick={restartGame}
                                className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition-all"
                            >
                                Restart
                            </button>
                        </div>
                    )}

                    {/* SETTINGS SCREEN */}
                    {gameStatus === 'settings' && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-md border border-white/20 text-white">
                            <h3 className="text-3xl font-bold mb-4">Settings</h3>
                            {/* <div className="flex flex-col items-center justify-center p-4 gap-4">
                            <h2 className="text-2xl">Sound:</h2>
                            <Checkbox checked={soundOn} onChange={() => toggleSound()} />
                        </div> */}
                            <div className="flex flex-col items-center justify-center p-4 gap-4">
                                <h2 className="text-2xl">Dark Mode Fix (if you can't see the food):</h2>
                                <Checkbox checked={darkModeFix} onChange={() => setDarkModeFix(!darkModeFix)} />
                            </div>
                            <br />
                            <button
                                onClick={() => {
                                    const prev = previousGameStatus;
                                    setGameStatus(prev);
                                    setPreviousGameStatus('settings');
                                }}
                                className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 transition-all"
                            >
                                Back to Game
                            </button>
                        </div>
                    )}
                </div>

                {/* MOBILE CONTROLS */}
                {gridSize.width < 25 && gameStatus !== 'gameOver' && gameStatus !== 'settings' &&
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 grid grid-cols-3 p-2 gap-2">
                        <div />
                        <button onClick={() => handleTouchDirection("UP")} className="h-16 w-16 flex items-center justify-center bg-white/40 rounded-full text-white text-xl">
                            ↑
                        </button>
                        <div />
                        <button onClick={() => handleTouchDirection("LEFT")} className="h-16 w-16 flex items-center justify-center bg-white/20 rounded-full text-white text-xl">
                            ←
                        </button>
                        <div />
                        <button onClick={() => handleTouchDirection("RIGHT")} className="h-16 w-16 flex items-center justify-center bg-white/20 rounded-full text-white text-xl">
                            →
                        </button>
                        <div />
                        <button onClick={() => handleTouchDirection("DOWN")} className="h-16 w-16 flex items-center justify-center bg-white/20 rounded-full text-white text-xl">
                            ↓
                        </button>
                        <div />
                    </div>
                }
            </div>
        </div>
    );
};
