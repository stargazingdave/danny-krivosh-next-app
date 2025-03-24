'use client';

import { useAppContext } from "@/app/AppContext";
import React, { useEffect, useState } from "react";
import { FaWineBottle } from "react-icons/fa6";
import { HiX } from "react-icons/hi";

const GRID_HEIGHT = 20;
const GRID_WIDTH = 36;
const CELL_SIZE = 20; // Pixels per cell
const INITIAL_SPEED = 70; // Movement speed in ms
const MAX_SPEED = 100;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT),
});

export const SnakeGame: React.FC = () => {
    const {
        setSnakeOpen
    } = useAppContext();
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(getRandomPosition);
    const [direction, setDirection] = useState<Direction>("RIGHT");
    const [isGameOver, setIsGameOver] = useState(false);
    const [foodEaten, setFoodEaten] = useState<boolean>(false);
    const [bottleEaten, setBottleEaten] = useState<boolean>(false);
    const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
    const [bottle, setBottle] = useState(getRandomPosition);
    const [countForBottle, setCountForBottle] = useState<number>(0);

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
            if (keyMap[e.key] && !isGameOver) {
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
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isGameOver]);

    useEffect(() => {
        if (isGameOver) return;
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
                    setIsGameOver(true);
                    return prevSnake;
                }

                // Check collision with itself
                if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
                    setIsGameOver(true);
                    return prevSnake;
                }

                // Add new head
                newSnake.unshift(head);

                // Check if food eaten
                if (head.x === food.x && head.y === food.y) {
                    const newSpeed = speed + 5 > MAX_SPEED ? MAX_SPEED : speed + 5;
                    setFood(getRandomPosition());
                    setSpeed(newSpeed);
                    setCountForBottle((prev) => prev + 1);
                    setFoodEaten(true);
                    setTimeout(() => setFoodEaten(false), 1000);
                    console.log(`New speed: ${newSpeed}`);
                } else {
                    newSnake.pop();
                }

                // Check if bottle eaten
                if (head.x === bottle.x && head.y === bottle.y) {
                    const newSpeed = Math.floor(Math.random() * (MAX_SPEED - INITIAL_SPEED + 1)) + INITIAL_SPEED;
                    setBottle(getRandomPosition());
                    setCountForBottle(0);
                    setSpeed(newSpeed);
                    setBottleEaten(true);
                    setTimeout(() => setBottleEaten(false), 1000);
                    console.log(`New speed: ${newSpeed}`);
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, MAX_SPEED - speed);
        return () => clearInterval(interval);
    }, [direction, food, isGameOver]);

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition());
        setDirection("RIGHT");
        setIsGameOver(false);
        setSpeed(INITIAL_SPEED);
        setBottle(getRandomPosition());
        setCountForBottle(0);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
            onClick={() => setSnakeOpen(false)} // Clicking outside closes the game
        >
            <div className="relative bg-gray-900 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="w-full h-fit flex items-center">
                    <h2 className="w-full text-center text-2xl font-bold p-2 tracking-widest">
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
                    className={`grid ${bottleEaten ? 'bg-[#590b02]' : 'bg-black'} transition-colors ease-out`}
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
                                backgroundColor: index === 0 ? `${foodEaten ? 'white' : '#777777'}` : `${foodEaten ? '#d7b964' : '#333333'}`,
                                borderRadius: "4px",
                                boxShadow: foodEaten ? '0 0 8px 1px white' : 'none',
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
                    {countForBottle >= 5 && (
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
                </div>

                {isGameOver && (
                    <div className="overlay">
                        <h3>Game Over!</h3>
                        <button onClick={restartGame}>Restart</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SnakeGame;
