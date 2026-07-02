import React from 'react';
import { useGamepad } from '../context/GamepadContext';

const ConsoleBody = ({ children }) => {
  const { deviceColor, toggleColor } = useGamepad();
  const isWhite = deviceColor === 'white';
  const isGrey = deviceColor === 'grey';
  
  // Theme Variables
  let tableBg = 'bg-[#333333]'; // 20% grey mixed in black
  if (isWhite) tableBg = 'bg-[#ffffff]';
  if (isGrey) tableBg = 'bg-[#222426]';

  let shellBg = 'bg-[#1e1e1e]';
  if (isWhite) shellBg = 'bg-[#efefef]';
  if (isGrey) shellBg = 'bg-[#555a5e]';

  let edgeShadow = 'inset -1px -1px 2px rgba(0,0,0,0.8), inset 1px 1px 2px rgba(255,255,255,0.1)';
  if (isWhite) edgeShadow = 'inset -1px -1px 2px rgba(0,0,0,0.15), inset 1px 1px 2px rgba(255,255,255,1)';
  if (isGrey) edgeShadow = 'inset -1px -1px 2px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.4)';

  return (
    <div className={`flex items-center justify-center min-h-[100dvh] w-full ${tableBg} overflow-hidden perspective-[1000px] transition-colors duration-500`}>
      
      {/* Container to hold the toggle switch and the console side-by-side */}
      <div className="relative flex items-center">
        
        {/* Side Buttons (Green Power & Grey Volume) */}
        <div className="absolute -left-[5px] top-32 w-1.5 h-32 z-0 flex flex-col items-center space-y-2">
           <button 
             onClick={toggleColor}
             className="w-full h-8 bg-[#00a859] rounded-l-sm border-y border-l border-[#007840] shadow-[inset_1px_0_2px_rgba(255,255,255,0.4)]"
             title="Toggle Theme"
           ></button>
           <div className={`w-full h-12 ${isWhite ? 'bg-[#d0d0d0] border-[#a0a0a0]' : isGrey ? 'bg-[#404448] border-[#222]' : 'bg-[#333] border-[#111]'} rounded-l-sm border-y border-l shadow-[inset_1px_0_2px_rgba(255,255,255,0.2)]`}></div>
        </div>

        {/* Main Console Body */}
        <div 
          className={`relative w-full h-full max-w-[calc(100dvh*350/580)] max-h-[calc(100vw*580/350)] sm:w-[350px] sm:h-[580px] rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center select-none touch-none transition-colors duration-500 z-10 ${shellBg}`}
          style={{ boxShadow: `0 30px 60px -15px rgba(0,0,0,0.4), ${edgeShadow}` }}
        >
          
          {/* Subtle lighting gradient to simulate flat matte surface */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay"></div>

          {children}

        </div>

      </div>
    </div>
  );
};

export default ConsoleBody;
