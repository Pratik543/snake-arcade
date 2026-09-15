import { useMemo } from 'react';
import type { GameState, Direction } from '../types';
import { ARCADE_LEVELS } from '../constants';

interface Props {
  state: GameState;
}

// Pixel sprites live on a 10x10 grid; each sprite pixel = 1 grid unit.
// Everything is crisp rects — no curves, no gradients, no glow.
const C0 = 'var(--gb0)';
const C1 = 'var(--gb1)';
const C3 = 'var(--gb3)';

// Eye position per direction on the 10x10 head sprite.
const EYES: Record<Direction, Array<[number, number]>> = {
  UP: [[2, 2], [6, 2]],
  DOWN: [[2, 6], [6, 6]],
  LEFT: [[2, 3], [2, 6]],
  RIGHT: [[6, 3], [6, 6]],
};

const Sprite = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <svg
    viewBox="0 0 10 10"
    shapeRendering="crispEdges"
    className={`sprite ${className || ''}`}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const HeadSprite = ({ dir, blink }: { dir: Direction; blink: boolean }) => (
  <Sprite>
    <rect x="0" y="0" width="10" height="10" fill={C0} />
    <rect x="0" y="9" width="10" height="1" fill={C1} />
    {!blink
      ? EYES[dir].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="2" height="2" fill={C3} />
        ))
      : EYES[dir].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="2" height="1" fill={C1} />
        ))}
  </Sprite>
);

const BodySprite = ({ variant }: { variant: number }) => (
  <Sprite>
    <rect x="0" y="0" width="10" height="10" fill={C0} />
    {variant === 0 ? (
      <rect x="4" y="4" width="2" height="2" fill={C1} />
    ) : (
      <>
        <rect x="2" y="2" width="2" height="2" fill={C1} />
        <rect x="6" y="6" width="2" height="2" fill={C1} />
      </>
    )}
  </Sprite>
);

const TailSprite = () => (
  <Sprite>
    <rect x="1" y="1" width="8" height="8" fill={C0} />
    <rect x="4" y="4" width="2" height="2" fill={C1} />
  </Sprite>
);

const FoodSprite = () => (
  <Sprite className="sprite-bob">
    <rect x="5" y="1" width="1" height="2" fill={C1} />
    <rect x="6" y="0" width="2" height="1" fill={C1} />
    <rect x="2" y="3" width="6" height="5" fill={C0} />
    <rect x="1" y="4" width="8" height="3" fill={C0} />
    <rect x="3" y="4" width="1" height="1" fill={C3} />
  </Sprite>
);

const BonusSprite = ({ urgent }: { urgent: boolean }) => (
  <Sprite className={urgent ? 'sprite-blink-fast' : 'sprite-blink'}>
    <rect x="4" y="1" width="2" height="8" fill={C0} />
    <rect x="1" y="4" width="8" height="2" fill={C0} />
    <rect x="2" y="2" width="1" height="1" fill={C1} />
    <rect x="7" y="2" width="1" height="1" fill={C1} />
    <rect x="2" y="7" width="1" height="1" fill={C1} />
    <rect x="7" y="7" width="1" height="1" fill={C1} />
    <rect x="4" y="4" width="2" height="2" fill={C1} />
  </Sprite>
);

const WallSprite = () => (
  <Sprite>
    <rect x="0" y="0" width="10" height="10" fill={C0} />
    <rect x="0" y="0" width="4" height="4" fill={C1} />
    <rect x="5" y="0" width="5" height="4" fill={C1} />
    <rect x="0" y="5" width="2" height="4" fill={C1} />
    <rect x="3" y="5" width="4" height="4" fill={C1} />
    <rect x="8" y="5" width="2" height="4" fill={C1} />
  </Sprite>
);

const PortalSprite = ({ kind }: { kind: 'in' | 'out' }) => (
  <Sprite className={kind === 'in' ? 'sprite-blink' : 'sprite-blink-rev'}>
    <rect x="4" y="0" width="2" height="1" fill={C0} />
    <rect x="4" y="9" width="2" height="1" fill={C0} />
    <rect x="0" y="4" width="1" height="2" fill={C0} />
    <rect x="9" y="4" width="1" height="2" fill={C0} />
    <rect x="2" y="2" width="1" height="1" fill={C0} />
    <rect x="7" y="2" width="1" height="1" fill={C0} />
    <rect x="2" y="7" width="1" height="1" fill={C0} />
    <rect x="7" y="7" width="1" height="1" fill={C0} />
    {kind === 'in'
      ? <rect x="4" y="4" width="2" height="2" fill={C0} />
      : (
        <>
          <rect x="3" y="4" width="1" height="2" fill={C1} />
          <rect x="6" y="4" width="1" height="2" fill={C1} />
        </>
      )}
  </Sprite>
);

export const SnakeBoard = ({ state }: Props) => {
  const { snake, food, bonusFood, direction, shieldActive, speedBoost, shakeFrames, tickCount } = state;
  const lvl = ARCADE_LEVELS[state.level - 1];
  const walls = lvl?.walls || [];
  const portalEntry = lvl?.portalEntry;
  const portalExit = lvl?.portalExit;
  const gridSize = state.gridSize;

  const wallSet = useMemo(() => new Set(walls.map(w => `${w.x},${w.y}`)), [walls]);
  const foodKey = `${food.x},${food.y}`;
  const bonusKey = bonusFood ? `${bonusFood.x},${bonusFood.y}` : '';
  const head = snake[0];

  // Eye blink — closed for 2 of every 24 ticks
  const blink = tickCount % 24 < 2;
  const bonusUrgent = (state.bonusFoodTimer ?? 0) < 30;

  return (
    <div
      className={`board ${shakeFrames > 0 ? 'shake' : ''} ${speedBoost ? 'speed-lines' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {Array.from({ length: gridSize * gridSize }, (_, i) => {
        const x = i % gridSize;
        const y = Math.floor(i / gridSize);
        const key = `${x},${y}`;
        const isHead = head.x === x && head.y === y;
        const isFood = key === foodKey;
        const isBonus = key === bonusKey;
        const isWall = wallSet.has(key);
        const isPortalIn = !!portalEntry && portalEntry.x === x && portalEntry.y === y;
        const isPortalOut = !!portalExit && portalExit.x === x && portalExit.y === y;
        const snakeIdx = snake.findIndex(s => s.x === x && s.y === y);
        const isTail = snakeIdx === snake.length - 1 && snakeIdx > 0;
        const isBody = snakeIdx > 0 && !isTail;

        let content: React.ReactNode = null;
        if (isHead) content = <HeadSprite dir={direction} blink={blink} />;
        else if (isBody) content = <BodySprite variant={(x + y) % 2} />;
        else if (isTail) content = <TailSprite />;
        else if (isFood) content = <FoodSprite />;
        else if (isBonus) content = <BonusSprite urgent={bonusUrgent} />;
        else if (isWall) content = <WallSprite />;
        else if (isPortalIn) content = <PortalSprite kind="in" />;
        else if (isPortalOut) content = <PortalSprite kind="out" />;

        return (
          <div key={key} className="cell">
            {content}
          </div>
        );
      })}

      {shieldActive && <div className="shield-ring" />}

      {state.particles.map(p => (
        <div
          key={p.id}
          className={`particle p-${p.type}`}
          style={{
            left: `${(p.x / gridSize) * 100}%`,
            top: `${(p.y / gridSize) * 100}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.life,
          }}
        />
      ))}
    </div>
  );
};
