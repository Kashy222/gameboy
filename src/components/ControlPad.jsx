import React, { useState, useRef } from 'react';
import { useGamepad } from '../context/GamepadContext';

const AnalogStick = ({ deviceColor }) => {
  const { updateInput } = useGamepad();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const stickRef = useRef(null);
  const activePointers = useRef(new Set());
  const wasAtEdge = useRef(false);

  const isWhite = deviceColor === 'white';
  const isGrey = deviceColor === 'grey';

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    activePointers.current.add(e.pointerId);
    setIsDragging(true);
    handleMove(e);
  };

  const handlePointerMove = (e) => {
    if (!activePointers.current.has(e.pointerId)) return;
    handleMove(e);
  };

  const handleMove = (e) => {
    if (!stickRef.current) return;
    const rect = stickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Max visual distance the knob can travel
    const maxRadius = rect.width / 2 - 24; 
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    // Calculate raw pull distance
    let pullDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Progressive resistance: feels heavier the further you pull
    const resistanceStart = maxRadius * 0.4;
    if (pullDistance > resistanceStart) {
      const excess = pullDistance - resistanceStart;
      // Compresses the excess movement, making it feel springy and resistant
      pullDistance = resistanceStart + (excess * 0.4); 
    }
    
    if (pullDistance >= maxRadius) {
      // Haptic "bump" when hitting the physical plastic rim
      if (!wasAtEdge.current && navigator.vibrate) {
        navigator.vibrate(15);
      }
      wasAtEdge.current = true;
      pullDistance = maxRadius;
    } else {
      if (pullDistance < maxRadius * 0.85) wasAtEdge.current = false;
    }
    
    // Apply restricted distance
    const angle = Math.atan2(dy, dx);
    setPosition({ 
      x: Math.cos(angle) * pullDistance, 
      y: Math.sin(angle) * pullDistance 
    });

    // Threshold for triggering digital input (based on raw direction)
    const threshold = maxRadius * 0.35;
    const isUp = dy < -threshold;
    const isDown = dy > threshold;
    const isLeft = dx < -threshold;
    const isRight = dx > threshold;

    updateInput('up', isUp);
    updateInput('down', isDown);
    updateInput('left', isLeft);
    updateInput('right', isRight);
    
    // Light haptic tick when crossing threshold in any direction
    if ((isUp || isDown || isLeft || isRight) && pullDistance < resistanceStart && navigator.vibrate) {
      // (Optional subtle tick can be added here if desired)
    }
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    e.target.releasePointerCapture(e.pointerId);
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size === 0) {
      setIsDragging(false);
      setPosition({ x: 0, y: 0 });
      updateInput('up', false);
      updateInput('down', false);
      updateInput('left', false);
      updateInput('right', false);
      wasAtEdge.current = false;
    }
  };

  let wellClass = 'bg-[#1a1a1a] shadow-[inset_2px_4px_8px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)]';
  if (isWhite) wellClass = 'bg-[#dfdfdf] shadow-[inset_2px_4px_6px_rgba(0,0,0,0.2),0_1px_1px_rgba(255,255,255,0.8)]';
  if (isGrey) wellClass = 'bg-[#404448] shadow-[inset_2px_4px_8px_rgba(0,0,0,0.6),0_1px_1px_rgba(255,255,255,0.2)]';
  
  let knobClass = 'bg-[#333] shadow-[3px_5px_8px_rgba(0,0,0,0.7),inset_-2px_-4px_6px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1)]';
  if (isWhite) knobClass = 'bg-[#f4f4f4] shadow-[1px_3px_5px_rgba(0,0,0,0.2),inset_-1px_-2px_4px_rgba(0,0,0,0.05),inset_1px_2px_4px_rgba(255,255,255,1)]';
  if (isGrey) knobClass = 'bg-[#60656a] shadow-[2px_4px_7px_rgba(0,0,0,0.5),inset_-2px_-3px_5px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.2)]';

  let knobTopClass = 'bg-[#262626] border border-[#1a1a1a] shadow-[inset_1px_2px_4px_rgba(0,0,0,0.8)]';
  if (isWhite) knobTopClass = 'bg-[#e5e5e5] border border-[#d0d0d0] shadow-[inset_1px_2px_4px_rgba(0,0,0,0.1)]';
  if (isGrey) knobTopClass = 'bg-[#50555a] border border-[#404448] shadow-[inset_1px_2px_4px_rgba(0,0,0,0.4)]';

  return (
    <div 
      ref={stickRef}
      className={`relative w-28 h-28 rounded-full ${wellClass} flex items-center justify-center touch-none`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* The Knob */}
      <div 
        className={`w-[68px] h-[68px] rounded-full ${knobClass} pointer-events-none ${!isDragging ? 'transition-transform duration-300' : ''}`}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transitionTimingFunction: !isDragging ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'initial'
        }}
      >
         {/* Inner detail to make it look like a thumbstick (recessed top) */}
         <div className={`absolute inset-[8px] rounded-full ${knobTopClass}`}></div>
      </div>
    </div>
  );
};

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
      onPointerDown={(e) => { 
        e.preventDefault(); 
        e.target.setPointerCapture(e.pointerId); 
        if (navigator.vibrate) navigator.vibrate(5);
        onDown(); 
      }}
      onPointerUp={(e) => { e.preventDefault(); e.target.releasePointerCapture(e.pointerId); onUp(); }}
      onPointerCancel={(e) => { e.preventDefault(); onUp(); }}
      onPointerLeave={(e) => { e.preventDefault(); onUp(); }}
      className={`w-[2.15rem] h-[2.15rem] rounded-full flex items-center justify-center select-none touch-none border border-transparent transition-all duration-75 ease-out ${active ? 'scale-[0.92] translate-y-[2px] translate-x-[1px]' : ''} ${btnBg} ${shadow}`}
    >
      {label && (
        <span className={`font-sans font-bold text-[12px] pointer-events-none select-none ${textEmboss}`} style={{ textShadow: isWhite ? '0 -1px 1px rgba(0,0,0,0.1)' : '0 -1px 1px rgba(0,0,0,0.5)' }}>
          {label}
        </span>
      )}
    </button>
  );
};

const ControlPad = () => {
  const { inputState, updateInput, deviceColor } = useGamepad();
  const isWhite = deviceColor === 'white';
  const isGrey = deviceColor === 'grey';

  let wellShadow = 'shadow-[inset_2px_3px_5px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.05)]';
  if (isWhite) wellShadow = 'shadow-[inset_1px_2px_4px_rgba(0,0,0,0.15),0_1px_1px_rgba(255,255,255,0.8)]';
  if (isGrey) wellShadow = 'shadow-[inset_2px_3px_5px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.3)]';

  return (
    <div className="w-full flex-1 flex flex-col justify-between pt-10 pb-6 relative z-10 px-6">
      
      {/* Top section: Analog Stick & 4 Action Buttons */}
      <div className="flex justify-between items-start mt-4 px-2 relative w-full">
        
        {/* Analog Joystick */}
        <div 
          className="relative origin-left"
          style={{ transform: 'scale(calc(min(1.45, (min(100vw, 400px) - 84px) / 224)))' }}
        >
          <AnalogStick deviceColor={deviceColor} />
        </div>

        {/* 4 Action Buttons (Diamond Layout) */}
        <div 
          className="relative w-32 h-32 origin-right"
          style={{ transform: 'scale(calc(min(1.45, (min(100vw, 400px) - 84px) / 224)))' }}
        >
          {/* Circular wells with buttons centered inside */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full ${wellShadow} flex items-center justify-center`}>
            <ActionButton label="X" active={inputState.x} deviceColor={deviceColor} onDown={() => updateInput('x', true)} onUp={() => updateInput('x', false)} />
          </div>
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full ${wellShadow} flex items-center justify-center`}>
            <ActionButton label="B" active={inputState.b} deviceColor={deviceColor} onDown={() => updateInput('b', true)} onUp={() => updateInput('b', false)} />
          </div>
          <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-11 h-11 rounded-full ${wellShadow} flex items-center justify-center`}>
            <ActionButton label="Y" active={inputState.y} deviceColor={deviceColor} onDown={() => updateInput('y', true)} onUp={() => updateInput('y', false)} />
          </div>
          <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-11 h-11 rounded-full ${wellShadow} flex items-center justify-center`}>
            <ActionButton label="A" active={inputState.a} deviceColor={deviceColor} onDown={() => updateInput('a', true)} onUp={() => updateInput('a', false)} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ControlPad;
