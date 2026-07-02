import React from 'react';
import { GamepadProvider } from './context/GamepadContext';
import ConsoleBody from './components/ConsoleBody';
import GameScreen from './components/GameScreen';
import ControlPad from './components/ControlPad';

function App() {
  return (
    <GamepadProvider>
      <ConsoleBody>
        <GameScreen />
        <ControlPad />
      </ConsoleBody>
    </GamepadProvider>
  );
}

export default App;
