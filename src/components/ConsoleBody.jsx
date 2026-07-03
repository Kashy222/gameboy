import React from 'react';
import { useGamepad } from '../context/GamepadContext';

const ConsoleBody = ({ children }) => {
  const { deviceColor, toggleColor, inputState, updateInput, volume, changeVolume, showVolumeOSD, isLandscape } = useGamepad();
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

  if (isLandscape) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
        
        {/* The GameScreen component */}
        <div className="absolute inset-0 z-0">
          {children[0]}
        </div>

        {/* The ControlPad component */}
        {children[1]}

        {/* Start and Select Buttons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-16 z-20 pointer-events-auto opacity-40 mix-blend-screen">
          {/* Select Button */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-white/50 drop-shadow-md">Select</span>
            <button 
              onPointerDown={(e) => { 
                e.preventDefault(); 
                try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
                if (navigator.vibrate) navigator.vibrate(5);
                updateInput('select', true); 
              }}
              onPointerUp={(e) => { 
                e.preventDefault(); 
                try { if (e.target.hasPointerCapture(e.pointerId)) e.target.releasePointerCapture(e.pointerId); } catch(err) {}
                updateInput('select', false); 
              }}
              onPointerCancel={(e) => { e.preventDefault(); updateInput('select', false); }}
              onPointerLeave={(e) => { e.preventDefault(); updateInput('select', false); }}
              className={`w-14 h-4 rounded-full flex-shrink-0 bg-white/20 border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] focus:outline-none transition-all duration-75 ${inputState?.select ? 'scale-95 bg-white/40' : ''} touch-none`}
            ></button>
          </div>
          
          {/* Start Button */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-white/50 drop-shadow-md">Start</span>
            <button 
              onPointerDown={(e) => { 
                e.preventDefault(); 
                try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
                if (navigator.vibrate) navigator.vibrate(5);
                updateInput('start', true); 
              }}
              onPointerUp={(e) => { 
                e.preventDefault(); 
                try { if (e.target.hasPointerCapture(e.pointerId)) e.target.releasePointerCapture(e.pointerId); } catch(err) {}
                updateInput('start', false); 
              }}
              onPointerCancel={(e) => { e.preventDefault(); updateInput('start', false); }}
              onPointerLeave={(e) => { e.preventDefault(); updateInput('start', false); }}
              className={`w-14 h-4 rounded-full flex-shrink-0 bg-white/20 border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] focus:outline-none transition-all duration-75 ${inputState?.start ? 'scale-95 bg-white/40' : ''} touch-none`}
            ></button>
          </div>
        </div>

      </div>
    );
  }

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
           <div className="flex flex-col space-y-1 w-full">
             <button 
               onClick={() => changeVolume(0.1)}
               className={`w-full h-8 ${isWhite ? 'bg-[#d0d0d0] border-[#a0a0a0]' : isGrey ? 'bg-[#404448] border-[#222]' : 'bg-[#333] border-[#111]'} rounded-l-sm border-y border-l shadow-[inset_1px_0_2px_rgba(255,255,255,0.2)]`}
               title="Volume Up"
             ></button>
             <button 
               onClick={() => changeVolume(-0.1)}
               className={`w-full h-8 ${isWhite ? 'bg-[#d0d0d0] border-[#a0a0a0]' : isGrey ? 'bg-[#404448] border-[#222]' : 'bg-[#333] border-[#111]'} rounded-l-sm border-y border-l shadow-[inset_1px_0_2px_rgba(255,255,255,0.2)]`}
               title="Volume Down"
             ></button>
           </div>
        </div>

        {/* Main Console Body */}
        <div 
          className={`relative w-[94vw] h-[calc(94vw*580/350)] max-w-[calc(94dvh*350/580)] max-h-[94dvh] sm:max-w-none sm:max-h-none sm:w-[350px] sm:h-[580px] sm:rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center select-none touch-none transition-colors duration-500 z-10 ${shellBg}`}
          style={{ boxShadow: `0 30px 60px -15px rgba(0,0,0,0.4), ${edgeShadow}` }}
        >
          {/* Volume OSD */}
          <div 
            className={`absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-1 bg-black/80 px-4 py-2 rounded-full transition-opacity duration-300 pointer-events-none ${showVolumeOSD ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="text-white text-xs font-bold mr-2 uppercase tracking-wider">Vol</span>
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-3 ${i < Math.round(volume * 10) ? 'bg-white' : 'bg-white/20'}`}
              ></div>
            ))}
          </div>
          
          {/* Subtle lighting gradient to simulate flat matte surface */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay"></div>

          {children}

          {/* System Buttons */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-6 items-end z-20 pointer-events-auto">
            
            <div className="flex flex-col items-center space-y-2">
              <span className={`text-[9px] font-sans font-bold tracking-[0.2em] uppercase ${isWhite ? 'text-[#a0a0a0]' : 'text-[#444]'}`}>Select</span>
              <button 
                onPointerDown={(e) => { 
                  e.preventDefault(); 
                  try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
                  if (navigator.vibrate) navigator.vibrate(5);
                  updateInput('select', true); 
                }}
                onPointerUp={(e) => { 
                  e.preventDefault(); 
                  try { if (e.target.hasPointerCapture(e.pointerId)) e.target.releasePointerCapture(e.pointerId); } catch(err) {}
                  updateInput('select', false); 
                }}
                onPointerCancel={(e) => { e.preventDefault(); updateInput('select', false); }}
                onPointerLeave={(e) => { e.preventDefault(); updateInput('select', false); }}
                className={`w-11 h-3.5 rounded-full flex-shrink-0 ${isWhite ? 'bg-[#efefef]' : 'bg-[#1a1a1a]'} ${isWhite ? 'shadow-[2px_3px_4px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,1)]' : 'shadow-[3px_4px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.15)]'} focus:outline-none transition-all duration-75 ${inputState?.select ? 'scale-95 translate-y-[2px] translate-x-[1px] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]' : ''} touch-none border border-transparent`}
              ></button>
            </div>
            
            {/* Start Button */}
            <div className="flex flex-col items-center space-y-2">
              <span className={`text-[9px] font-sans font-bold tracking-[0.2em] uppercase ${isWhite ? 'text-[#a0a0a0]' : 'text-[#444]'}`}>Start</span>
              <button 
                onPointerDown={(e) => { 
                  e.preventDefault(); 
                  try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
                  if (navigator.vibrate) navigator.vibrate(5);
                  updateInput('start', true); 
                }}
                onPointerUp={(e) => { 
                  e.preventDefault(); 
                  try { if (e.target.hasPointerCapture(e.pointerId)) e.target.releasePointerCapture(e.pointerId); } catch(err) {}
                  updateInput('start', false); 
                }}
                onPointerCancel={(e) => { e.preventDefault(); updateInput('start', false); }}
                onPointerLeave={(e) => { e.preventDefault(); updateInput('start', false); }}
                className={`w-11 h-3.5 rounded-full flex-shrink-0 ${isWhite ? 'bg-[#efefef]' : 'bg-[#1a1a1a]'} ${isWhite ? 'shadow-[2px_3px_4px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,1)]' : 'shadow-[3px_4px_5px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.15)]'} focus:outline-none transition-all duration-75 ${inputState?.start ? 'scale-95 translate-y-[2px] translate-x-[1px] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]' : ''} touch-none border border-transparent`}
              ></button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ConsoleBody;
