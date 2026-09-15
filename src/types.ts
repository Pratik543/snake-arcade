export interface Point {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'CLASSIC' | 'ARCADE';

export type GameStatus = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_COMPLETE';

export interface ArcadeLevel {
  level: number;
  speed: number;
  walls?: Point[];
  portalEntry?: Point;
  portalExit?: Point;
  targetScore: number;
  name: string;
  emoji: string;
  color: string;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  nextDirection: Direction;
  status: GameStatus;
  score: number;
  highScore: number;
  level: number;
  mode: GameMode;
  speed: number;
  bonusFood: Point | null;
  bonusFoodTimer: number;
  speedBoost: boolean;
  speedBoostTimer: number;
  shieldActive: boolean;
  shieldTimer: number;
  particles: Particle[];
  shakeFrames: number;
  combo: number;
  lastEatTime: number;
  gridSize: number;
  tickCount: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  type: 'eat' | 'death' | 'bonus' | 'shield' | 'trail';
}

export interface SoundEngine {
  play: (sound: string) => void;
}
