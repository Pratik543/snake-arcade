import type { GameState } from '../types';
import { ARCADE_LEVELS } from '../constants';
import { PixelBolt, PixelShield, PixelFlame } from './PixelIcons';

interface Props {
  state: GameState;
}

const PROGRESS_SEGS = 12;

export const HUD = ({ state }: Props) => {
  const lvl = ARCADE_LEVELS[state.level - 1];
  const progress = lvl ? Math.min(100, (state.score / lvl.targetScore) * 100) : 0;
  const filled = lvl ? Math.round((progress / 100) * PROGRESS_SEGS) : 0;

  return (
    <div className="hud">
      <div className="hud-block">
        <span className="hud-label">SCORE</span>
        <span className="hud-val">{state.score}</span>
      </div>

      {state.mode === 'ARCADE' && lvl && (
        <div className="hud-block hud-center">
          <span className="hud-label">LVL {state.level} · {lvl.name}</span>
          <div className="progress-track">
            {Array.from({ length: PROGRESS_SEGS }, (_, i) => (
              <span key={i} className={`progress-seg ${i < filled ? 'on' : ''}`} />
            ))}
          </div>
          <span className="hud-target">{state.score}/{lvl.targetScore}</span>
        </div>
      )}

      {state.mode === 'CLASSIC' && (
        <div className="hud-block hud-center">
          <span className="hud-label">ENDLESS</span>
          {state.combo > 1 && (
            <span className="combo-badge">
              <PixelFlame size={10} /> x{state.combo}
            </span>
          )}
        </div>
      )}

      <div className="hud-block hud-right">
        <span className="hud-label">BEST</span>
        <span className="hud-val">{state.highScore}</span>
      </div>

      <div className="hud-badges">
        {state.speedBoost && (
          <span className="badge">
            <PixelBolt size={10} /> SPEED
          </span>
        )}
        {state.shieldActive && (
          <span className="badge">
            <PixelShield size={10} /> SHIELD
          </span>
        )}
        {state.combo > 2 && state.mode === 'ARCADE' && (
          <span className="badge">
            <PixelFlame size={10} /> x{state.combo}
          </span>
        )}
      </div>
    </div>
  );
};
