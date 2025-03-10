'use client';

import React, { useEffect, useState } from "react";

const GRID_SIZE = 20; // 20x20 grid
const CELL_SIZE = 20; // Pixels per cell
const SPEED = 100; // Movement speed in ms

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const getRandomPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
});

export const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState(getRandomPosition);
    const [direction, setDirection] = useState<Direction>("RIGHT");
    const [isGameOver, setIsGameOver] = useState(false);

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
                    head.x >= GRID_SIZE ||
                    head.y >= GRID_SIZE
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
                    setFood(getRandomPosition());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, SPEED);
        return () => clearInterval(interval);
    }, [direction, food, isGameOver]);

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(getRandomPosition());
        setDirection("RIGHT");
        setIsGameOver(false);
    };

    return (
        <div className="game-container">
            <h2>Snake Game</h2>
            <div
                className="grid bg-black"
                style={{
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE,
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
                            backgroundColor: index === 0 ? "#777777" : "#333333",
                            borderRadius: "4px",
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
            </div>

            {isGameOver && (
                <div className="overlay">
                    <h3>Game Over!</h3>
                    <button onClick={restartGame}>Restart</button>
                </div>
            )}
        </div>
    );
};

export default SnakeGame;
