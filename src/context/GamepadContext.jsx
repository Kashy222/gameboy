import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GamepadContext = createContext();

export const useGamepad = () => useContext(GamepadContext);

export const GamepadProvider = ({ children }) => {
  const [inputState, setInputState] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    x: false,
    y: false,
    start: false,
    select: false,
    joystickL: { x: 0, y: 0 },
    joystickR: { x: 0, y: 0 },
  });

  const updateInput = useCallback((key, value) => {
    setInputState(prev => {
      if (prev[key] === value) return prev;
      
      // Trigger a soft haptic vibration when a button is newly pressed
      if (value && typeof navigator !== 'undefined' && navigator.vibrate) {
        // Very short vibration for a subtle tactile click feel
        navigator.vibrate(10); 
      }
      
      return { ...prev, [key]: value };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.isTrusted) return; // Prevent infinite loop from our own simulated events
      
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup': updateInput('up', true); break;
        case 's':
        case 'arrowdown': updateInput('down', true); break;
        case 'a':
        case 'arrowleft': updateInput('left', true); break;
        case 'd':
        case 'arrowright': updateInput('right', true); break;
        case 'j':
        case 'z': updateInput('a', true); break; // A
        case 'k':
        case 'x': updateInput('b', true); break; // B
        case 'u':
        case 'c': updateInput('x', true); break; // X
        case 'i':
        case 'v': updateInput('y', true); break; // Y
        case 'enter': updateInput('start', true); break;
        case ' ': updateInput('select', true); break;
        default: break;
      }
    };

    const handleKeyUp = (e) => {
      if (!e.isTrusted) return; // Prevent infinite loop from our own simulated events
      
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup': updateInput('up', false); break;
        case 's':
        case 'arrowdown': updateInput('down', false); break;
        case 'a':
        case 'arrowleft': updateInput('left', false); break;
        case 'd':
        case 'arrowright': updateInput('right', false); break;
        case 'j':
        case 'z': updateInput('a', false); break;
        case 'k':
        case 'x': updateInput('b', false); break;
        case 'u':
        case 'c': updateInput('x', false); break;
        case 'i':
        case 'v': updateInput('y', false); break;
        case 'enter': updateInput('start', false); break;
        case ' ': updateInput('select', false); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [updateInput]);

  const [deviceColor, setDeviceColor] = useState('black');

  const toggleColor = useCallback(() => {
    setDeviceColor(prev => {
      if (prev === 'black') return 'white';
      if (prev === 'white') return 'grey';
      return 'black';
    });
  }, []);

  const [volume, setVolumeState] = useState(1);
  const [showVolumeOSD, setShowVolumeOSD] = useState(false);
  
  const changeVolume = useCallback((delta) => {
    setVolumeState(prev => {
      const newVol = Math.max(0, Math.min(1, prev + delta));
      
      // Attempt to set emulator volume
      window.EJS_volume = newVol;
      if (window.EJS_emulator && typeof window.EJS_emulator.setVolume === 'function') {
        window.EJS_emulator.setVolume(newVol);
      } else if (window.EJS_emulator && typeof window.EJS_emulator.changeVolume === 'function') {
        window.EJS_emulator.changeVolume(newVol);
      }
      
      return newVol;
    });
    
    setShowVolumeOSD(true);
    
    // Auto hide after 2 seconds
    if (window.osdTimeout) clearTimeout(window.osdTimeout);
    window.osdTimeout = setTimeout(() => {
      setShowVolumeOSD(false);
    }, 2000);
    
    if (navigator.vibrate) navigator.vibrate(10);
  }, []);

  return (
    <GamepadContext.Provider value={{ inputState, updateInput, deviceColor, toggleColor, volume, changeVolume, showVolumeOSD }}>
      {children}
    </GamepadContext.Provider>
  );
};
