'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface Props {
    color?: string;
    count?: number;
    speed?: number;
    linkDistance?: number;
    grabDistance?: number;
    showLinks?: boolean;
    opacity?: number;
}

export default function ParticlesBackground({
    color = '#3aaa6a',
    count = 260,
    speed = 1.2,
    linkDistance = 150,
    grabDistance = 140,
    showLinks = true,
    opacity = 0.6,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rafId: number;
        const particles: Particle[] = [];

        // Pre-compute squared thresholds — avoids sqrt in hot loop
        const linkDistSq = linkDistance * linkDistance;
        const grabDistSq = grabDistance * grabDistance;

        // Pre-compute rgba strings once
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const rgb = `${r},${g},${b}`;
        const dotFill = `rgba(${rgb},${opacity})`;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const mkParticle = (x?: number, y?: number): Particle => ({
            x: x ?? Math.random() * canvas.width,
            y: y ?? Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            radius: Math.random() * 2.5 + 0.5,
        });

        resize();
        for (let i = 0; i < count; i++) particles.push(mkParticle());

        ctx.lineWidth = 1;

        const draw = () => {
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            const { x: mx, y: my } = mouseRef.current;
            const len = particles.length;

            // Pass 1: move all particles
            for (let i = 0; i < len; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) { p.vx = Math.abs(p.vx); p.x = 0; }
                else if (p.x > W) { p.vx = -Math.abs(p.vx); p.x = W; }
                if (p.y < 0) { p.vy = Math.abs(p.vy); p.y = 0; }
                else if (p.y > H) { p.vy = -Math.abs(p.vy); p.y = H; }
            }

            // Pass 2: draw all dots in a single batched path
            ctx.fillStyle = dotFill;
            for (let i = 0; i < len; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Pass 3: draw links
            if (showLinks) {
                for (let i = 0; i < len; i++) {
                    const p = particles[i];

                    // particle–particle links
                    for (let j = i + 1; j < len; j++) {
                        const q = particles[j];
                        const dx = p.x - q.x, dy = p.y - q.y;
                        const dSq = dx * dx + dy * dy;
                        if (dSq < linkDistSq) {
                            // sqrt only when we know we'll draw
                            const alpha = 0.4 * (1 - Math.sqrt(dSq) / linkDistance);
                            ctx.strokeStyle = `rgba(${rgb},${alpha})`;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(q.x, q.y);
                            ctx.stroke();
                        }
                    }

                    // grab link to cursor
                    const dx = p.x - mx, dy = p.y - my;
                    const dSq = dx * dx + dy * dy;
                    if (dSq < grabDistSq) {
                        const alpha = 1 - Math.sqrt(dSq) / grabDistance;
                        ctx.strokeStyle = `rgba(${rgb},${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mx, my);
                        ctx.stroke();
                    }
                }
            }

            rafId = requestAnimationFrame(draw);
        };

        const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
        const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
        const onClick = (e: MouseEvent) => {
            for (let i = 0; i < 4; i++) particles.push(mkParticle(e.clientX, e.clientY));
            if (particles.length > count + 80) particles.splice(0, particles.length - count - 80);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);
        window.addEventListener('click', onClick);
        window.addEventListener('resize', resize);
        draw();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', resize);
        };
    }, [color, count, speed, linkDistance, grabDistance, showLinks, opacity]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', display: 'block' }}
        />
    );
}
