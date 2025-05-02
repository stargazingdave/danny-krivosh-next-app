// StarshipTroopersPinball.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Image from 'next/image';

const StarshipTroopersPinball: React.FC = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);

    useEffect(() => {
        const { Engine, Render, World, Bodies, Body, Constraint } = Matter;
        const engine = Engine.create();
        engineRef.current = engine;

        const width = 600;
        const height = 800;

        const render = Render.create({
            element: sceneRef.current!,
            engine,
            options: {
                width,
                height,
                wireframes: false,
                background: 'transparent'
            }
        });

        const walls = [
            Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
            Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
            Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
            Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
        ];

        const ball = Bodies.circle(width / 2, 100, 15, {
            restitution: 0.9,
            label: 'ball',
            render: { fillStyle: '#ffff00' }
        });

        const group = Body.nextGroup(true);

        const flipperLeft = Bodies.rectangle(170, 700, 80, 20, {
            collisionFilter: { group },
            render: { fillStyle: '#dddddd' }
        });

        const flipperLeftConstraint = Constraint.create({
            pointA: { x: 170, y: 700 },
            bodyB: flipperLeft,
            pointB: { x: -30, y: 0 },
            stiffness: 1,
            length: 0
        });

        const flipperRight = Bodies.rectangle(430, 700, 80, 20, {
            collisionFilter: { group },
            render: { fillStyle: '#dddddd' }
        });

        const flipperRightConstraint = Constraint.create({
            pointA: { x: 430, y: 700 },
            bodyB: flipperRight,
            pointB: { x: 30, y: 0 },
            stiffness: 1,
            length: 0
        });

        World.add(engine.world, [
            ...walls,
            ball,
            flipperLeft,
            flipperLeftConstraint,
            flipperRight,
            flipperRightConstraint
        ]);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') Body.setAngularVelocity(flipperLeft, -2);
            if (e.key === 'ArrowRight') Body.setAngularVelocity(flipperRight, 2);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') Body.setAngularVelocity(flipperLeft, 2);
            if (e.key === 'ArrowRight') Body.setAngularVelocity(flipperRight, -2);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        Engine.run(engine);
        Render.run(render);

        return () => {
            Render.stop(render);
            Engine.clear(engine);
            render.canvas.remove();
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: 600, height: 800 }}>
            <Image
                src='/images/pinball/starship-pinball-bg.png'
                alt="Starship Troopers Pinball Background"
                layout="fill"
                objectFit="cover"
                style={{ position: 'absolute', zIndex: -1 }}
                priority
            />
            <div ref={sceneRef} style={{ position: 'absolute', top: 0, left: 0 }} />
        </div>
    );
};

export default StarshipTroopersPinball;
