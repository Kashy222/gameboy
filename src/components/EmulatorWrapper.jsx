import React, { useState, useEffect, useRef } from 'react';
import { useGamepad } from '../context/GamepadContext';

const EmulatorWrapper = () => {
  const [romFile, setRomFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [webMode, setWebMode] = useState(false);
  const [core, setCore] = useState('segaMD');
  const { inputState } = useGamepad();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRomFile(file);
      const ext = file.name.split('.').pop().toLowerCase();
      
      if (ext === 'md' || ext === 'smd' || ext === 'gen') setCore('segaMD');
      else if (ext === 'bin') {
        // Sega Genesis ROMs are usually 1-4MB. PSX CDs are 300-700MB.
        if (file.size > 10 * 1024 * 1024) setCore('psx'); 
        else setCore('segaMD');
      }
      else if (ext === 'nes') setCore('nes');
      else if (ext === 'sfc' || ext === 'smc') setCore('snes');
      else if (ext === 'gba') setCore('gba');
      else if (ext === 'gb' || ext === 'gbc') setCore('gb');
      else if (ext === 'iso' || ext === 'cue' || ext === 'chd' || ext === '7z' || ext === 'zip') setCore('psx');
    }
  };

  useEffect(() => {
    if (!isPlaying || !romFile || webMode) return;

    window.EJS_player = '#game-container';
    window.EJS_core = core;
    window.EJS_gameUrl = URL.createObjectURL(romFile);
    window.EJS_pathtodata = 'https://raw.githack.com/EmulatorJS/EmulatorJS/main/data/';
    window.EJS_startOnLoaded = true;
    window.EJS_virtualGamepad = 'disabled'; // Tell newer forks to disable it
    window.EJS_VirtualGamepadSettings = false; // Tell some versions to clear it
    window.EJS_Buttons = {
      playPause: false, restart: false, mute: false, settings: false, 
      fullscreen: false, saveState: false, loadState: false, reset: false, controls: false
    };

    // Inject CSS to safely hide only the EmulatorJS virtual touch gamepad and Menu
    const style = document.createElement('style');
    style.id = 'ejs-hide-gamepad';
    style.innerHTML = `
      .ejs-ui, .ejs-touch-controls, .ejs-virtual-gamepad, 
      .ejs-menu, .ejs-menu-container,
      div[title="Menu"], div[title="Settings"], div[title="Controls"],
      div[id^="gamepad"], div[class*="gamepad"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
        z-index: -9999 !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://raw.githack.com/EmulatorJS/EmulatorJS/main/data/loader.js';
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      const injectedStyle = document.getElementById('ejs-hide-gamepad');
      if (injectedStyle) injectedStyle.remove();
      URL.revokeObjectURL(window.EJS_gameUrl);
    };
  }, [isPlaying, romFile, core, webMode]);

  const prevInput = useRef(inputState);
  const currentInput = useRef(inputState);
  const macroActive = useRef(false);

  useEffect(() => {
    currentInput.current = inputState;
  }, [inputState]);

  useEffect(() => {
    if (webMode) return; // Disable event mapping for iframe to avoid conflicts
    
    const keyMap = {
      up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
      a: 'z', b: 'x', x: 's', y: 's', start: 'Enter', select: 'Shift'
    };
    
    const keyCodeMap = {
      'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39,
      'x': 88, 'z': 90, 's': 83, 'a': 65, 'Enter': 13, 'Shift': 16
    };

    const dispatchKey = (type, key) => {
      const event = new KeyboardEvent(type, { 
        key: key, 
        code: key, 
        bubbles: true,
        cancelable: true
      });
      
      Object.defineProperty(event, 'keyCode', { get: () => keyCodeMap[key] });
      Object.defineProperty(event, 'which', { get: () => keyCodeMap[key] });

      const canvas = document.querySelector('#game-container canvas');
      if (canvas) {
        canvas.dispatchEvent(event);
      } else {
        document.dispatchEvent(event);
      }
    };

    const accelKey = keyMap['a'];
    const wasAccelHeld = prevInput.current.a || prevInput.current.x;
    const isAccelHeld = inputState.a || inputState.x;

    // 1. Handle X (NOS) macro triggering
    if (inputState.x && !prevInput.current.x) {
      macroActive.current = true;
      dispatchKey('keyup', accelKey);
      setTimeout(() => dispatchKey('keydown', accelKey), 40);
      setTimeout(() => dispatchKey('keyup', accelKey), 80);
      setTimeout(() => {
        macroActive.current = false;
        // After macro, restore the state based on whatever is physically pressed NOW
        if (currentInput.current.a || currentInput.current.x) {
          dispatchKey('keydown', accelKey);
        }
      }, 120);
    }

    // 2. Handle normal acceleration state changes (only if macro isn't currently hijacking the key)
    if (!macroActive.current) {
      if (isAccelHeld && !wasAccelHeld) {
        dispatchKey('keydown', accelKey);
      } else if (!isAccelHeld && wasAccelHeld) {
        dispatchKey('keyup', accelKey);
      }
    }

    // 3. Handle all other keys normally
    Object.keys(inputState).forEach(key => {
      if (key === 'a' || key === 'x') return; // Handled by the accel state machine above

      if (inputState[key] && !prevInput.current[key]) {
        dispatchKey('keydown', keyMap[key]);
      } else if (!inputState[key] && prevInput.current[key]) {
        dispatchKey('keyup', keyMap[key]);
      }
    });

    prevInput.current = { ...inputState };
  }, [inputState, webMode]);

  if (isPlaying) {
    const handleScreenTap = () => {
      // Dispatch a quick Start button press to skip promos/intros when tapping the screen
      dispatchKey('keydown', 'Enter');
      setTimeout(() => dispatchKey('keyup', 'Enter'), 50);
    };

    return <div id="game-container" onPointerDownCapture={handleScreenTap} className="w-full h-full bg-black relative overflow-hidden pointer-events-auto"></div>;
  }

  return (
    <div className="w-full h-full bg-[#111] flex flex-col items-center justify-center relative overflow-hidden font-sans space-y-8">
      
      {/* Local ROM Mode */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 border-2 border-dashed border-[#444] rounded-md flex items-center justify-center mb-4 cursor-pointer hover:border-[#666] transition-colors relative">
          <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest text-center">Insert<br/>Cartridge</span>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".md,.bin,.gen,.smd,.zip,.iso,.cue,.chd,.7z" onChange={handleFileChange} />
        </div>

        {romFile && (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-white text-[10px] font-bold mb-3 tracking-wider">{romFile.name}</div>
            <button 
              onClick={() => setIsPlaying(true)}
              className="px-6 py-2 bg-[#222] text-[#e5e5e5] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#333] hover:scale-105 transition-all shadow-md border border-[#444]"
            >
              Boot System
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default EmulatorWrapper;
