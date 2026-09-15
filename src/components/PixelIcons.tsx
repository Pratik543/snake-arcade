// Pixel icons drawn as crisp SVG rects in the DMG 4-shade palette.
// One grammar: 1-unit pixels on a 10x10 grid, no curves, no strokes.

const C0 = 'var(--gb0)';
const C1 = 'var(--gb1)';
const C2 = 'var(--gb2)';

interface IconProps {
  size?: number;
  className?: string;
}

const makeIcon = (paths: React.ReactNode, viewBox = '0 0 10 10') =>
  ({ size = 12, className }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );

// Four-point star (level clear)
export const PixelStar = makeIcon(
  <>
    <rect x="4" y="0" width="2" height="10" fill={C0} />
    <rect x="0" y="4" width="10" height="2" fill={C0} />
    <rect x="1" y="1" width="2" height="2" fill={C1} />
    <rect x="7" y="1" width="2" height="2" fill={C1} />
    <rect x="1" y="7" width="2" height="2" fill={C1} />
    <rect x="7" y="7" width="2" height="2" fill={C1} />
    <rect x="4" y="4" width="2" height="2" fill={C2} />
  </>
);

// Skull (game over)
export const PixelSkull = makeIcon(
  <>
    <rect x="2" y="1" width="6" height="6" fill={C0} />
    <rect x="1" y="3" width="8" height="3" fill={C0} />
    <rect x="3" y="3" width="2" height="2" fill={C2} />
    <rect x="6" y="3" width="2" height="2" fill={C2} />
    <rect x="4" y="6" width="2" height="1" fill={C2} />
    <rect x="2" y="8" width="1" height="2" fill={C0} />
    <rect x="4" y="8" width="1" height="2" fill={C0} />
    <rect x="6" y="8" width="1" height="2" fill={C0} />
  </>
);

// Trophy (high score)
export const PixelTrophy = makeIcon(
  <>
    <rect x="3" y="1" width="4" height="4" fill={C0} />
    <rect x="1" y="2" width="2" height="2" fill={C0} />
    <rect x="7" y="2" width="2" height="2" fill={C0} />
    <rect x="4" y="5" width="2" height="2" fill={C1} />
    <rect x="2" y="7" width="6" height="1" fill={C0} />
    <rect x="2" y="8" width="6" height="1" fill={C1} />
  </>
);

// Lightning bolt (speed boost)
export const PixelBolt = makeIcon(
  <>
    <rect x="5" y="0" width="3" height="2" fill={C0} />
    <rect x="3" y="2" width="3" height="2" fill={C0} />
    <rect x="2" y="4" width="3" height="2" fill={C0} />
    <rect x="3" y="6" width="3" height="2" fill={C0} />
    <rect x="1" y="8" width="3" height="2" fill={C0} />
  </>
);

// Shield
export const PixelShield = makeIcon(
  <>
    <rect x="2" y="1" width="6" height="5" fill={C0} />
    <rect x="3" y="6" width="4" height="1" fill={C0} />
    <rect x="4" y="7" width="2" height="1" fill={C0} />
    <rect x="4" y="2" width="2" height="2" fill={C2} />
  </>
);

// Flame (combo)
export const PixelFlame = makeIcon(
  <>
    <rect x="4" y="0" width="2" height="2" fill={C1} />
    <rect x="3" y="2" width="4" height="2" fill={C0} />
    <rect x="2" y="4" width="6" height="3" fill={C0} />
    <rect x="3" y="7" width="4" height="2" fill={C0} />
    <rect x="4" y="5" width="2" height="2" fill={C2} />
  </>
);

// Apple (mode icon, classic)
export const PixelApple = makeIcon(
  <>
    <rect x="2" y="3" width="6" height="6" fill={C0} />
    <rect x="1" y="4" width="8" height="4" fill={C0} />
    <rect x="3" y="4" width="1" height="1" fill={C2} />
    <rect x="5" y="1" width="1" height="2" fill={C1} />
    <rect x="6" y="1" width="2" height="1" fill={C1} />
  </>
);

// Cartridge (mode icon, arcade)
export const PixelCartridge = makeIcon(
  <>
    <rect x="1" y="1" width="8" height="8" fill={C0} />
    <rect x="3" y="3" width="4" height="3" fill={C2} />
    <rect x="4" y="4" width="2" height="1" fill={C0} />
    <rect x="1" y="9" width="2" height="1" fill={C1} />
    <rect x="4" y="9" width="2" height="1" fill={C1} />
    <rect x="7" y="9" width="2" height="1" fill={C1} />
  </>
);

// Menu cursor (blinking triangle)
export const PixelCursor = makeIcon(
  <>
    <rect x="1" y="1" width="2" height="8" fill={C0} />
    <rect x="3" y="3" width="1" height="4" fill={C0} />
    <rect x="4" y="4" width="1" height="2" fill={C0} />
  </>
);
