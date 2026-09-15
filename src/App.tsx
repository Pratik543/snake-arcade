import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { Direction, GameMode } from './types';
import { SnakeBoard } from './components/SnakeBoard';
import { HUD } from './components/HUD';
import { Overlays } from './components/Overlays';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import './App.css';

function App() {
  const { state, setDirection, startGame, continueArcade, togglePause, goToMenu } = useGame();
  const [menuSel, setMenuSel] = useState<GameMode>('CLASSIC');
  const [lastDir, setLastDir] = useState<Direction | null>(null);

  const consoleRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);

  // Fit the fixed-size console into any viewport, pixel-proportions intact.
  useLayoutEffect(() => {
    const fit = () => {
      const el = consoleRef.current;
      const scaler = scalerRef.current;
      if (!el || !scaler) return;
      const scale = Math.min(
        1,
        (window.innerWidth - 16) / el.offsetWidth,
        (window.innerHeight - 16) / el.offsetHeight,
      );
      scaler.style.transform = `scale(${Math.max(0.3, scale)})`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // In the menu, up/down steers the mode cursor; in game, it steers the snake.
  const handleDir = useCallback((d: Direction) => {
    if (state.status === 'MENU') {
      setMenuSel(prev => (prev === 'CLASSIC' ? 'ARCADE' : 'CLASSIC'));
      return;
    }
    setLastDir(d);
    setDirection(d);
  }, [state.status, setDirection]);

  const handleAction = useCallback(() => {
    if (state.status === 'MENU') startGame(menuSel);
    else if (state.status === 'GAME_OVER') startGame(state.mode);
    else if (state.status === 'LEVEL_COMPLETE') continueArcade();
    else if (state.status === 'PAUSED') togglePause();
  }, [state.status, state.mode, menuSel, startGame, continueArcade, togglePause]);

  useKeyboard(handleDir, togglePause, handleAction);

  const pressStart = useCallback(() => {
    if (state.status === 'PLAYING') togglePause();
    else handleAction();
  }, [state.status, togglePause, handleAction]);

  const dpadDown = useCallback((d: Direction) => () => handleDir(d), [handleDir]);

  const dpadArms: Array<{ d: Direction; cls: string; label: string }> = [
    { d: 'UP', cls: 'up', label: 'Up' },
    { d: 'DOWN', cls: 'down', label: 'Down' },
    { d: 'LEFT', cls: 'left', label: 'Left' },
    { d: 'RIGHT', cls: 'right', label: 'Right' },
  ];

  return (
    <div className="app">
      <div ref={scalerRef} className="console-scaler">
        <div ref={consoleRef} className="console">
          {/* Screen bezel */}
          <div className="bezel">
            <div className="bezel-top">
              <span className="bezel-stripe s1" />
              <span className="bezel-stripe s2" />
              <span className="bezel-text">DOT MATRIX WITH SNAKE SYSTEM</span>
            </div>
            <div className="screen-row">
              <div className="battery">
                <span className={`led ${state.status === 'PLAYING' ? 'on' : ''}`} />
                <span className="battery-label">BATTERY</span>
              </div>
              <div className="screen">
                <div className="game-inner">
                  <SnakeBoard state={state} />
                  {state.status === 'PLAYING' && <HUD state={state} />}
                  <Overlays
                    state={state}
                    menuSel={menuSel}
                    onStart={startGame}
                    onContinue={continueArcade}
                    onPause={togglePause}
                    onMenu={goToMenu}
                  />
                </div>
                <span className="lcd-grid" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Brand line */}
          <div className="brand">
            SNAKE<span className="brand-accent">ARCADE</span>
            <span className="brand-tm">™</span>
          </div>

          {/* D-pad + A/B */}
          <div className="controls">
            <div className="dpad" role="group" aria-label="Direction pad">
              {dpadArms.map(({ d, cls, label }) => (
                <button
                  key={d}
                  type="button"
                  className={`dp ${cls} ${state.status === 'PLAYING' && lastDir === d ? 'active' : ''}`}
                  aria-label={label}
                  onPointerDown={dpadDown(d)}
                />
              ))}
              <span className="dp-center" aria-hidden="true">
                <span className="dp-dot" />
              </span>
            </div>

            <div className="ab">
              <div className="ab-slot">
                <button type="button" className="btn-round btn-b" onClick={togglePause} aria-label="B: pause" />
                <span className="ab-label">B</span>
              </div>
              <div className="ab-slot">
                <button type="button" className="btn-round btn-a" onClick={handleAction} aria-label="A: confirm" />
                <span className="ab-label">A</span>
              </div>
            </div>
          </div>

          {/* START / SELECT */}
          <div className="pills">
            <div className="pill-slot">
              <button type="button" className="pill" onClick={goToMenu} aria-label="Select: menu" />
              <span className="pill-label">SELECT</span>
            </div>
            <div className="pill-slot">
              <button type="button" className="pill" onClick={pressStart} aria-label="Start" />
              <span className="pill-label">START</span>
            </div>
          </div>

          {/* Speaker */}
          <div className="speaker" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="slit" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
