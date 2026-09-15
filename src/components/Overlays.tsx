import type { GameState, GameMode } from '../types';
import { ARCADE_LEVELS } from '../constants';
import { PixelStar, PixelSkull, PixelTrophy, PixelApple, PixelCartridge, PixelCursor } from './PixelIcons';

interface Props {
  state: GameState;
  menuSel: GameMode;
  onStart: (mode: GameMode) => void;
  onContinue: () => void;
  onPause: () => void;
  onMenu: () => void;
}

const ModeButton = ({
  mode, selected, icon, name, desc, onStart,
}: {
  mode: GameMode; selected: boolean; icon: React.ReactNode; name: string; desc: string; onStart: (m: GameMode) => void;
}) => (
  <button
    type="button"
    className={`mode-btn ${selected ? 'sel' : ''}`}
    onClick={() => onStart(mode)}
  >
    <span className="mode-cursor">{selected && <PixelCursor size={10} className="cursor-blink" />}</span>
    <span className="mode-icon">{icon}</span>
    <span className="mode-info">
      <span className="mode-name">{name}</span>
      <span className="mode-desc">{desc}</span>
    </span>
  </button>
);

export const Overlays = ({ state, menuSel, onStart, onContinue, onPause, onMenu }: Props) => {
  if (state.status === 'PLAYING') return null;

  return (
    <div className="overlay-backdrop">
      {/* MENU */}
      {state.status === 'MENU' && (
        <div className="panel menu-panel">
          <div className="menu-logo">
            <h1 className="logo-main">SNAKE</h1>
            <div className="logo-strip" aria-hidden="true">
              <span /><span /><span /><span /><span /><span /><span /><span />
            </div>
            <span className="logo-sub">ARCADE</span>
          </div>

          <div className="menu-modes">
            <ModeButton
              mode="CLASSIC"
              selected={menuSel === 'CLASSIC'}
              icon={<PixelApple size={16} />}
              name="CLASSIC"
              desc="WRAP WALLS · ENDLESS"
              onStart={onStart}
            />
            <ModeButton
              mode="ARCADE"
              selected={menuSel === 'ARCADE'}
              icon={<PixelCartridge size={16} />}
              name="ARCADE"
              desc="7 LEVELS · PORTALS"
              onStart={onStart}
            />
          </div>

          <div className="controls-guide">
            <div className="key-row">
              <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
              <span className="or">/</span>
              <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>
              <span className="key-label">MOVE · SELECT</span>
            </div>
            <div className="key-row">
              <kbd>ENTER</kbd>
              <span className="key-label">START</span>
              <kbd>ESC</kbd>
              <span className="key-label">PAUSE</span>
            </div>
          </div>

          {state.highScore > 0 && (
            <div className="menu-hs">
              <PixelTrophy size={12} /> {state.highScore}
            </div>
          )}
        </div>
      )}

      {/* PAUSED */}
      {state.status === 'PAUSED' && (
        <div className="panel">
          <h2>PAUSED</h2>
          <p className="pause-score">SCORE {state.score}</p>
          <div className="panel-actions">
            <button type="button" className="pixel-btn" onClick={onPause}>RESUME</button>
            <button type="button" className="pixel-btn quit" onClick={onMenu}>QUIT</button>
          </div>
        </div>
      )}

      {/* LEVEL COMPLETE */}
      {state.status === 'LEVEL_COMPLETE' && (
        <div className="panel">
          <div className="panel-icon pulse"><PixelStar size={28} /></div>
          <h2>LEVEL {state.level - 1} CLEAR!</h2>
          <p className="pause-score">SCORE {state.score}</p>
          {state.level <= ARCADE_LEVELS.length && (
            <div className="next-preview">
              <span className="next-label">NEXT</span>
              <span className="next-name">{ARCADE_LEVELS[state.level - 1]?.name}</span>
            </div>
          )}
          <div className="panel-actions">
            <button type="button" className="pixel-btn" onClick={onContinue}>NEXT LEVEL</button>
            <button type="button" className="pixel-btn quit" onClick={onMenu}>QUIT</button>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {state.status === 'GAME_OVER' && (
        <div className="panel">
          <div className="panel-icon"><PixelSkull size={28} /></div>
          <h2>GAME OVER</h2>
          <div className="go-stats">
            <div className="go-stat">
              <span className="go-label">SCORE</span>
              <span className="go-val">{state.score}</span>
            </div>
            <div className="go-stat">
              <span className="go-label">BEST</span>
              <span className="go-val">{state.highScore}</span>
            </div>
            {state.mode === 'ARCADE' && (
              <div className="go-stat">
                <span className="go-label">LVL</span>
                <span className="go-val">{state.level}</span>
              </div>
            )}
          </div>
          {state.score >= state.highScore && state.score > 0 && (
            <div className="new-record blink">
              <PixelTrophy size={12} /> NEW RECORD!
            </div>
          )}
          <div className="panel-actions">
            <button type="button" className="pixel-btn" onClick={() => onStart(state.mode)}>RETRY</button>
            <button type="button" className="pixel-btn quit" onClick={onMenu}>MENU</button>
          </div>
        </div>
      )}
    </div>
  );
};
