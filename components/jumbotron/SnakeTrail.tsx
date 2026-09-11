"use client";

import { useEffect, useRef } from "react";

/**
 * "Snake Trail" — a handful of short dot-trails that crawl across the
 * LED pixel grid, stepping cell to cell like a game of Snake, each
 * with a fading tail behind its bright head. Per the owner, this is
 * the fourth effect adapted from a reference site: there it's a
 * <canvas> layered over a static dot-grid background, individual
 * dots lighting up and drifting in short connected paths rather than
 * blinking independently. Built here as a canvas too (not DOM nodes
 * per dot) since it's a genuine game-style tick loop — discrete
 * steps on an interval, not a smooth CSS animation — and canvas is
 * the natural fit for that, same as the reference.
 *
 * `CELL` is 10px: a multiple of `.gt-pixel-grid`'s own 5px spacing,
 * so every step still lands exactly on a real grid dot, just a
 * visually perceptible jump instead of an imperceptible 5px nudge.
 * Tuned down from an initial 20px per the owner ("closer together").
 *
 * Each snake gets one color, chosen at spawn from the GT palette
 * (gold / a brightened navy blue / white) — plain navy itself
 * (`--gt-navy`, `#051e39`) would be nearly invisible against this
 * panel's black background, so it's lightened here specifically for
 * this effect's visibility, not meant to match the navy used
 * elsewhere on the board.
 *
 * No `mix-blend-screen` here, unlike this panel's other ambient
 * layers (glow orbs, the pixel grid itself): screen blend would wash
 * the navy dots down toward black (screen blend can't make a dark
 * color read as a distinct hue against a dark backdrop, it can only
 * add brightness). Plain small, low-alpha dots stay legible in all
 * three colors instead, and are still small/transparent enough not
 * to meaningfully compete with real content for attention.
 *
 * Deliberately rendered with no z-index (stacking level "auto"), so
 * it always paints *underneath* the main screen's actual content —
 * that wrapper carries an explicit `z-10` for exactly this reason
 * (see the comment on it in `JumbotronFrame.tsx`). This keeps Snake
 * Trail pure background atmosphere, the same treatment as the glow
 * orbs and Spark Float, rather than something that could ever sit
 * on top of a heading or paragraph.
 */
const CELL = 10;
const TICK_MS = 140;
const SNAKE_COUNT = 4;
const MIN_LEN = 4;
const MAX_LEN = 8;
const TURN_CHANCE = 0.12;
const MAX_ALPHA = 0.5;

const COLORS = [
  "232, 201, 138", // gold
  "245, 245, 245", // white
  "94, 138, 196", // brightened navy blue
];

type Dir = { dx: number; dy: number };
type Cell = { x: number; y: number };
type Snake = { cells: Cell[]; dir: Dir; maxLen: number; color: string };

const DIRS: Dir[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

export default function SnakeTrail({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 1;
    let rows = 1;

    function resize() {
      const { width, height } = parent!.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      cols = Math.max(1, Math.floor(width / CELL));
      rows = Math.max(1, Math.floor(height / CELL));
    }

    function randomCell(): Cell {
      return {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
    }

    function randomDir(): Dir {
      return DIRS[Math.floor(Math.random() * DIRS.length)];
    }

    function spawnSnake(): Snake {
      return {
        cells: [randomCell()],
        dir: randomDir(),
        maxLen: MIN_LEN + Math.floor(Math.random() * (MAX_LEN - MIN_LEN)),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    }

    const snakes: Snake[] = Array.from({ length: SNAKE_COUNT }, spawnSnake);

    function step() {
      for (let i = 0; i < snakes.length; i++) {
        const snake = snakes[i];
        if (Math.random() < TURN_CHANCE) {
          // Never reverse straight into the tail — only turns that
          // aren't the exact opposite of the current heading.
          const options = DIRS.filter(
            (d) => !(d.dx === -snake.dir.dx && d.dy === -snake.dir.dy),
          );
          snake.dir = options[Math.floor(Math.random() * options.length)];
        }
        const head = snake.cells[0];
        const next = { x: head.x + snake.dir.dx, y: head.y + snake.dir.dy };
        if (next.x < 0 || next.x >= cols || next.y < 0 || next.y >= rows) {
          snakes[i] = spawnSnake();
          continue;
        }
        snake.cells.unshift(next);
        if (snake.cells.length > snake.maxLen) snake.cells.pop();
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.save();
      ctx!.scale(dpr, dpr);
      for (const snake of snakes) {
        snake.cells.forEach((cell, idx) => {
          const fade = 1 - idx / snake.maxLen;
          const radius = Math.max(0.3, 1.3 - idx * 0.1);
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(${snake.color}, ${Math.max(0, fade * MAX_ALPHA)})`;
          ctx!.arc(
            cell.x * CELL + CELL / 2,
            cell.y * CELL + CELL / 2,
            radius,
            0,
            Math.PI * 2,
          );
          ctx!.fill();
        });
      }
      ctx!.restore();
    }

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    const intervalId = setInterval(() => {
      step();
      draw();
    }, TICK_MS);

    return () => {
      clearInterval(intervalId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
