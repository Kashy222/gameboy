import React from 'react';
import EmulatorWrapper from './EmulatorWrapper';
import { useGamepad } from '../context/GamepadContext';

const GameScreen = () => {
  const { deviceColor } = useGamepad();
  const isWhite = deviceColor === 'white';
  const textColor = isWhite ? 'text-[#888]' : 'text-[#444]';

  return (
    <div 
      className="w-full relative bg-[#050505] overflow-hidden flex flex-col items-center justify-center z-20"
      style={{ padding: '7%' }}
    >
      
      {/* 10:9 Display Area (Analogue Pocket specific ratio) */}
      <div className="relative w-full aspect-[10/9] bg-[#000] overflow-hidden flex items-center justify-center">
        
        <EmulatorWrapper />
        
        {/* Advanced LCD Sub-pixel Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzIiBoZWlnaHQ9IjMiPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48cmVjdCB4PSIyIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIzIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PHJlY3QgeD0iMCIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgwLDAsMCwwLjA1KSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay z-40 opacity-70"></div>
      </div>
    </div>
  );
};

export default GameScreen;
