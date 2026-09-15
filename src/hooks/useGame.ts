import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState, Direction, Point, GameMode, Particle } from '../types';
import { ARCADE_LEVELS } from '../constants';
import { createSoundEngine } from '../audio';

const GRID = 20;
const sound = createSoundEngine();

let nextId = 0;
const uid = () => ++nextId;

const randomPos = (exclude: Point[], walls: Point[] = []): Point => {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (
    exclude.some(s => s.x === p.x && s.y === p.y) ||
    walls.some(w => w.x === p.x && w.y === p.y)
  );
  return p;
};

const dirs: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const opposite: Record<Direction, Direction> = {
  UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
};

const makeBurst = (px: number, py: number, color: string, count: number): Particle[] =>
  Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;
    return {
      id: uid(),
      x: px, y: py,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color,
      size: 2 + Math.random() * 5,
      type: 'eat' as const,
    };
  });

const INITIAL_STATE = (mode: GameMode): GameState => {
  const walls = mode === 'ARCADE' ? (ARCADE_LEVELS[0].walls || []) : [];
  const snake = [
    { x: 10, y: 15 }, { x: 9, y: 15 }, { x: 8, y: 15 }, { x: 7, y: 15 }, { x: 6, y: 15 },
  ];
  return {
    snake,
    food: randomPos(snake, walls),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    status: 'PLAYING',
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeArcadeHS') || '0'),
    level: 1,
    mode,
    speed: mode === 'ARCADE' ? ARCADE_LEVELS[0].speed : 140,
    bonusFood: null,
    bonusFoodTimer: 0,
    speedBoost: false,
    speedBoostTimer: 0,
    shieldActive: false,
    shieldTimer: 0,
    particles: [],
    shakeFrames: 0,
    combo: 0,
    lastEatTime: 0,
    gridSize: GRID,
    tickCount: 0,
  };
};

export const useGame = () => {
  const [state, setState] = useState<GameState>(() => ({
    ...INITIAL_STATE('CLASSIC'),
    status: 'MENU',
  }));
  const ref = useRef(state);
  const loopRef = useRef<number>(0);
  const lastRef = useRef(0);
  const accumRef = useRef(0);

  useEffect(() => { ref.current = state; }, [state]);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'PLAYING') return prev;

      const dir = prev.nextDirection;
      const d = dirs[dir];
      const head = prev.snake[0];
      let newHead = { x: head.x + d.x, y: head.y + d.y };

      // Wrap (classic)
      if (prev.mode === 'CLASSIC') {
        newHead.x = (newHead.x + GRID) % GRID;
        newHead.y = (newHead.y + GRID) % GRID;
      }

      // Bounds (arcade)
      if (prev.mode === 'ARCADE' && (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID)) {
        sound.play('death');
        const hs = Math.max(prev.score, prev.highScore);
        localStorage.setItem('snakeArcadeHS', String(hs));
        return { ...prev, status: 'GAME_OVER', highScore: hs, direction: dir, shakeFrames: 12 };
      }

      // Self collision
      if (prev.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        if (!prev.shieldActive) {
          sound.play('death');
          const hs = Math.max(prev.score, prev.highScore);
          localStorage.setItem('snakeArcadeHS', String(hs));
          return { ...prev, status: 'GAME_OVER', highScore: hs, direction: dir, shakeFrames: 12 };
        }
      }

      // Wall collision (arcade)
      const lvl = ARCADE_LEVELS[prev.level - 1];
      if (lvl?.walls?.some(w => w.x === newHead.x && w.y === newHead.y)) {
        if (!prev.shieldActive) {
          sound.play('death');
          const hs = Math.max(prev.score, prev.highScore);
          localStorage.setItem('snakeArcadeHS', String(hs));
          return { ...prev, status: 'GAME_OVER', highScore: hs, direction: dir, shakeFrames: 12 };
        }
      }

      // Portal
      if (lvl?.portalEntry && newHead.x === lvl.portalEntry.x && newHead.y === lvl.portalEntry.y && lvl.portalExit) {
        newHead = { ...lvl.portalExit };
        sound.play('portal');
      }

      const snake = [newHead, ...prev.snake];
      let ate = false;
      let scoreAdd = 0;
      let particles = [...prev.particles];
      let combo = prev.combo;
      let food = prev.food;
      let bonusFood = prev.bonusFood;
      let bonusFoodTimer = prev.bonusFoodTimer;
      let speedBoost = prev.speedBoost;
      let speedBoostTimer = prev.speedBoostTimer;
      let shieldActive = prev.shieldActive;
      let shieldTimer = prev.shieldTimer;
      let speed = prev.speed;
      let level = prev.level;
      let status: GameState['status'] = prev.status;
      const walls = lvl?.walls || [];

      const now = Date.now();

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        ate = true;
        if (now - prev.lastEatTime < 2500) combo = Math.min(combo + 1, 15);
        else combo = 0;
        scoreAdd = 10 + combo * 2;
        particles.push(...makeBurst(food.x, food.y, '#0f380f', 18));
        sound.play('eat');
        if (combo > 0 && combo % 3 === 0) sound.play('combo');
        food = randomPos(snake, walls);

        // Random bonus spawn
        if (!bonusFood && Math.random() < 0.2) {
          bonusFood = randomPos([...snake, food], walls);
          bonusFoodTimer = 120;
        }

        // Speed boost power-up (random)
        if (!speedBoost && Math.random() < 0.08) {
          speedBoost = true;
          speedBoostTimer = 150;
          speed = Math.max(40, prev.speed - 30);
        }

        // Shield power-up
        if (!shieldActive && !prev.shieldActive && Math.random() < 0.06) {
          shieldActive = true;
          shieldTimer = 200;
        }
      } else if (bonusFood && newHead.x === bonusFood.x && newHead.y === bonusFood.y) {
        ate = true;
        scoreAdd = 30;
        particles.push(...makeBurst(bonusFood.x, bonusFood.y, '#306230', 25));
        sound.play('bonus');
        bonusFood = null;
        bonusFoodTimer = 0;
      } else {
        snake.pop();
      }

      // Decay timers
      if (bonusFood && --bonusFoodTimer <= 0) { bonusFood = null; bonusFoodTimer = 0; }
      if (speedBoost && --speedBoostTimer <= 0) { speedBoost = false; speedBoostTimer = 0; speed = prev.speed; }
      if (shieldActive && --shieldTimer <= 0) { shieldActive = false; shieldTimer = 0; }

      // Level up (arcade)
      if (prev.mode === 'ARCADE' && scoreAdd > 0 && prev.score + scoreAdd >= (lvl?.targetScore || 999)) {
        if (prev.level < ARCADE_LEVELS.length) {
          level = prev.level + 1;
          speed = ARCADE_LEVELS[level - 1].speed;
          status = 'LEVEL_COMPLETE';
          sound.play('levelUp');
        }
      }

      // Classic speed ramp
      if (prev.mode === 'CLASSIC' && !speedBoost) {
        const newScore = prev.score + scoreAdd;
        speed = Math.max(50, 140 - Math.floor(newScore / 40) * 5);
      }

      // Update particles
      const updatedParticles = particles
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.1, life: p.life - 0.025, size: p.size * 0.97 }))
        .filter(p => p.life > 0);

      // Trail particles
      if (prev.tickCount % 3 === 0) {
        updatedParticles.push({
          id: uid(),
          x: head.x, y: head.y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: 0.4,
          color: prev.speedBoost ? '#0f380f' : '#306230',
          size: 3,
          type: 'trail',
        });
      }

      return {
        ...prev,
        snake,
        food,
        direction: dir,
        nextDirection: dir,
        score: prev.score + scoreAdd,
        highScore: Math.max(prev.score + scoreAdd, prev.highScore),
        level,
        status,
        speed,
        bonusFood,
        bonusFoodTimer,
        speedBoost,
        speedBoostTimer,
        shieldActive,
        shieldTimer,
        particles: updatedParticles,
        shakeFrames: Math.max(0, prev.shakeFrames - 1),
        combo,
        lastEatTime: ate ? now : prev.lastEatTime,
        tickCount: prev.tickCount + 1,
      };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (state.status !== 'PLAYING') { cancelAnimationFrame(loopRef.current); return; }
    lastRef.current = 0;
    accumRef.current = 0;
    const loop = (t: number) => {
      if (!lastRef.current) lastRef.current = t;
      accumRef.current += t - lastRef.current;
      lastRef.current = t;
      if (accumRef.current >= ref.current.speed) {
        tick();
        accumRef.current = 0;
      }
      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [state.status, tick]);

  const setDirection = useCallback((dir: Direction) => {
    const s = ref.current;
    if (s.status !== 'PLAYING') return;
    if (dir !== opposite[s.direction]) {
      setState(p => ({ ...p, nextDirection: dir }));
    }
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    sound.play('select');
    setState(INITIAL_STATE(mode));
  }, []);

  const continueArcade = useCallback(() => {
    sound.play('select');
    setState(prev => {
      const lvl = ARCADE_LEVELS[prev.level - 1];
      if (!lvl) return prev;
      const snake = [{ x: 10, y: 15 }, { x: 9, y: 15 }, { x: 8, y: 15 }, { x: 7, y: 15 }, { x: 6, y: 15 }];
      return {
        ...prev,
        snake,
        food: randomPos(snake, lvl.walls || []),
        direction: 'RIGHT',
        nextDirection: 'RIGHT',
        status: 'PLAYING',
        speed: lvl.speed,
        bonusFood: null,
        bonusFoodTimer: 0,
        speedBoost: false,
        speedBoostTimer: 0,
        shieldActive: false,
        shieldTimer: 0,
        particles: [],
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    sound.play('menu');
    setState(p => {
      if (p.status === 'PLAYING') return { ...p, status: 'PAUSED' };
      if (p.status === 'PAUSED') return { ...p, status: 'PLAYING' };
      return p;
    });
  }, []);

  const goToMenu = useCallback(() => {
    sound.play('menu');
    setState(p => ({ ...INITIAL_STATE(p.mode), status: 'MENU', highScore: p.highScore }));
  }, []);

  return { state, setDirection, startGame, continueArcade, togglePause, goToMenu };
};
