import React from 'react';
import { useGamepad } from '../context/GamepadContext';

const ActionButton = ({ active, onDown, onUp, deviceColor, label }) => {
  const isWhite = deviceColor === 'white';
  const isGrey = deviceColor === 'grey';

  let btnBg = 'bg-[#1a1a1a]';
  if (isWhite) btnBg = 'bg-[#efefef]';
  if (isGrey) btnBg = 'bg-[#51565b]';
  
  // Unpressed: High drop shadow, bright top-left rim highlight
  // Pressed: No drop shadow, tight inner shadow (simulating being pushed into the well)
  let shadow = active 
    ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9),inset_-1px_-1px_2px_rgba(255,255,255,0.02)]' 
    : 'shadow-[3px_5px_7px_rgba(0,0,0,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.5),inset_1px_1px_2px_rgba(255,255,255,0.15)]';

  let textEmboss = 'text-[#222] drop-shadow-[0_1px_0_rgba(255,255,255,0.1)]';

  if (isWhite) {
    shadow = active 
      ? 'shadow-[inset_1px_2px_3px_rgba(0,0,0,0.2),inset_-1px_-1px_2px_rgba(255,255,255,1)]' 
      : 'shadow-[2px_4px_6px_rgba(0,0,0,0.25),inset_-1px_-1px_2px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,1)]';
    textEmboss = 'text-[#d0d0d0] drop-shadow-[0_1px_0_rgba(255,255,255,1)]';
  } else if (isGrey) {
    shadow = active 
      ? 'shadow-[inset_2px_2px_3px_rgba(0,0,0,0.6),inset_-1px_-1px_2px_rgba(255,255,255,0.05)]' 
      : 'shadow-[3px_5px_6px_rgba(0,0,0,0.5),inset_-1px_-1px_2px_rgba(0,0,0,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
    textEmboss = 'text-[#444] drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]';
  }

  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); e.target.setPointerCapture(e.pointerId); onDown(); }}
      onPointerUp={(e) => { e.preventDefault(); e.target.releasePointerCapture(e.pointerId); onUp(); }}
      onPointerCancel={(e) => { e.preventDefault(); onUp(); }}
      onPointerLeave={(e) => { e.preventDefault(); onUp(); }}
      className={`w-[1.8rem] h-[1.8rem] rounded-full flex items-center justify-center select-none touch-none border border-transparent transition-all duration-75 ease-out ${active ? 'scale-[0.92] translate-y-[2px] translate-x-[1px]' : ''} ${btnBg} ${shadow}`}
    >
      {label && (
        <span className={`font-sans font-bold text-[10px] pointer-events-none select-none ${textEmboss}`} style={{ textShadow: isWhite ? '0 -1px 1px rgba(0,0,0,0.1)' : '0 -1px 1px rgba(0,0,0,0.5)' }}>
          {label}
        </span>
      )}
    </button>
  );
};

const DPadButton = ({ active, onDown, onUp, className, deviceColor }) => {
  const isWhite = deviceColor === 'white';
  const isGrey = deviceColor === 'grey';

  let shadow = active 
    ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.9)]' 
    : 'shadow-[3px_4px_6px_rgba(0,0,0,0.7),inset_1px_1px_1px_rgba(255,255,255,0.1),inset_-1px_-1px_1px_rgba(0,0,0,0.5)]';
    
  if (isWhite) {
    shadow = active 
      ? 'shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2)]' 
      : 'shadow-[2px_3px_5px_rgba(0,0,0,0.2),inset_1px_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_1px_rgba(0,0,0,0.05)]';
  } else if (isGrey) {
    shadow = active 
      ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]' 
      : 'shadow-[3px_4px_5px_rgba(0,0,0,0.4),inset_1px_1px_1px_rgba(255,255,255,0.3),inset_-1px_-1px_1px_rgba(0,0,0,0.3)]';
  }

  let bgClass = 'bg-[#1a1a1a]';
  if (isWhite) bgClass = 'bg-[#efefef]';
  if (isGrey) bgClass = 'bg-[#51565b]';

  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); e.target.setPointerCapture(e.pointerId); onDown(); }}
      onPointerUp={(e) => { e.preventDefault(); e.target.releasePointerCapture(e.pointerId); onUp(); }}
      onPointerCancel={(e) => { e.preventDefault(); onUp(); }}
      onPointerLeave={(e) => { e.preventDefault(); onUp(); }}
      className={`absolute transition-all duration-75 ease-out select-none touch-none ${active ? 'scale-[0.92] translate-y-[2px] translate-x-[1px]' : ''} ${className} ${bgClass} ${shadow} z-10`}
    >
    </button>
  );
};

const ControlPad = () => {
  const { inputState, updateInput, deviceColor } = useGamepad();
  const isWhite = deviceColor === 'white';
  const isGrey = deviceColor === 'grey';

  let dpadBg = 'bg-[#1a1a1a]';
  if (isWhite) dpadBg = 'bg-[#efefef]';
  if (isGrey) dpadBg = 'bg-[#51565b]';

  let wellShadow = 'shadow-[inset_2px_3px_5px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)]';
  if (isWhite) wellShadow = 'shadow-[inset_1px_2px_4px_rgba(0,0,0,0.15),0_1px_1px_rgba(255,255,255,0.8)]';
  if (isGrey) wellShadow = 'shadow-[inset_2px_3px_5px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.3)]';

  let systemWell = 'shadow-[inset_1px_2px_3px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]';
  if (isWhite) systemWell = 'shadow-[inset_1px_2px_3px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,1)]';
  if (isGrey) systemWell = 'shadow-[inset_1px_2px_3px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.2)]';
  
  let systemBg = 'bg-[#151515]';
  if (isWhite) systemBg = 'bg-[#dfdfdf]';
  if (isGrey) systemBg = 'bg-[#404448]';

  let crossWellBg = 'bg-[#1e1e1e]';
  if (isWhite) crossWellBg = 'bg-[#efefef]';
  if (isGrey) crossWellBg = 'bg-[#555a5e]';

  return (
    <div className="w-full flex-1 flex flex-col justify-between pt-10 pb-6 relative z-10 px-6">
      
      {/* Top section: D-Pad & 4 Action Buttons */}
      <div className="flex justify-between items-start mt-4 px-2">
        
        {/* D-Pad */}
        <div className="relative w-28 h-28 transform scale-[1.15] sm:scale-110 origin-left ml-2">
          {/* Cross shaped well indentation */}
          <div className="absolute inset-0">
             <div className={`absolute top-0 left-9 w-[2.5rem] h-28 rounded-sm ${wellShadow}`}></div>
             <div className={`absolute left-0 top-9 h-[2.5rem] w-28 rounded-sm ${wellShadow}`}></div>
             <div className={`absolute left-9 top-9 w-[2.5rem] h-[2.5rem] ${crossWellBg}`}></div>
          </div>

          {/* Unified Tilting D-Pad Wrapper */}
          <div 
            className="absolute top-0 left-0 w-full h-full transition-transform duration-75 ease-out z-20"
            style={{ 
              transform: `
                ${inputState.up ? 'rotateX(10deg) translateY(-1px) scale(0.96)' : ''}
                ${inputState.down ? 'rotateX(-10deg) translateY(2px) scale(0.96)' : ''}
                ${inputState.left ? 'rotateY(-10deg) translateX(-2px) scale(0.96)' : ''}
                ${inputState.right ? 'rotateY(10deg) translateX(2px) scale(0.96)' : ''}
                ${!inputState.up && !inputState.down && !inputState.left && !inputState.right ? 'rotateX(0deg) rotateY(0deg) scale(1)' : ''}
              `,
              transformOrigin: 'center center'
            }}
          >
            <DPadButton
              deviceColor={deviceColor} active={inputState.up}
              onDown={() => updateInput('up', true)} onUp={() => updateInput('up', false)}
              className="top-[2px] left-[38px] w-[2.2rem] h-[2.3rem] rounded-t-sm"
            />
            <DPadButton
              deviceColor={deviceColor} active={inputState.down}
              onDown={() => updateInput('down', true)} onUp={() => updateInput('down', false)}
              className="bottom-[2px] left-[38px] w-[2.2rem] h-[2.3rem] rounded-b-sm"
            />
            <DPadButton
              deviceColor={deviceColor} active={inputState.left}
              onDown={() => updateInput('left', true)} onUp={() => updateInput('left', false)}
              className="left-[2px] top-[38px] w-[2.3rem] h-[2.2rem] rounded-l-sm"
            />
            <DPadButton
              deviceColor={deviceColor} active={inputState.right}
              onDown={() => updateInput('right', true)} onUp={() => updateInput('right', false)}
              className="right-[2px] top-[38px] w-[2.3rem] h-[2.2rem] rounded-r-sm"
            />

            {/* Center piece of D-pad */}
            <div className={`absolute top-[38px] left-[38px] w-[2.25rem] h-[2.25rem] pointer-events-none ${dpadBg}`}></div>
          </div>
        </div>

        {/* 4 Action Buttons (Diamond Layout) */}
        <div className="relative w-28 h-28 transform scale-[1.25] sm:scale-110 origin-right mr-2">
          {/* Circular wells */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full ${wellShadow}`}></div>
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full ${wellShadow}`}></div>
          <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-9 h-9 rounded-full ${wellShadow}`}></div>
          <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-9 h-9 rounded-full ${wellShadow}`}></div>

          <div className="absolute top-[2px] left-1/2 -translate-x-1/2">
            <ActionButton label="X" active={inputState.x} deviceColor={deviceColor} onDown={() => updateInput('x', true)} onUp={() => updateInput('x', false)} />
          </div>
          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2">
            <ActionButton label="B" active={inputState.b} deviceColor={deviceColor} onDown={() => updateInput('b', true)} onUp={() => updateInput('b', false)} />
          </div>
          <div className="absolute top-1/2 left-[2px] -translate-y-1/2">
            <ActionButton label="Y" active={inputState.y} deviceColor={deviceColor} onDown={() => updateInput('y', true)} onUp={() => updateInput('y', false)} />
          </div>
          <div className="absolute top-1/2 right-[2px] -translate-y-1/2">
            <ActionButton label="A" active={inputState.a} deviceColor={deviceColor} onDown={() => updateInput('a', true)} onUp={() => updateInput('a', false)} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ControlPad;
