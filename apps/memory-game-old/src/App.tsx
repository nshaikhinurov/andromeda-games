/** @jsxImportSource @emotion/react */

import { useCallback, useRef, useState } from 'react';

import Game from './components/Game';
import HeroScreen from './components/HeroScreen';
import { Card } from './models/Card';
import { prepareCards } from './utils/prepareCards';

type GameState = {
  screen: 'start' | 'game' | 'end';
  cards: Card[];
};

const App = () => {
  const scoreRef = useRef(0);
  const [state, setState] = useState<GameState>({
    screen: 'start',
    cards: [],
  });

  function restart() {
    setState((state) => ({
      ...state,
      screen: 'game',
      cards: prepareCards(),
    }));
  }

  const cloneState = useCallback(function () {
    setState((state) => ({ ...state }));
  }, []);

  function handleGameOver(score: number) {
    scoreRef.current = score;
    setState((state) => ({ ...state, screen: 'end' }));
  }

  return (
    <div css={appStyles}>
      {state.screen === 'start' ? (
        <HeroScreen type="start" headerContent="Memory game" buttonText="Start" onButtonClick={restart} />
      ) : state.screen === 'game' ? (
        <Game onRestart={restart} cards={state.cards} onGameOver={handleGameOver} rerender={cloneState} />
      ) : state.screen === 'end' ? (
        <HeroScreen
          type="end"
          headerContent={
            <>
              Congrats!
              <br />
              Final score: {scoreRef.current}
            </>
          }
          buttonText="Play again"
          onButtonClick={restart}
        />
      ) : null}
    </div>
  );
};

const appStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#207935',
  boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.3)',
  padding: '20px',
} as const;

export default App;
