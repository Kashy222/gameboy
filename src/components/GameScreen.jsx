import React from 'react';
import { RotateCcw } from 'lucide-react';
import EmulatorWrapper from './EmulatorWrapper';
import { useGamepad } from '../context/GamepadContext';

const GameScreen = () => {
  const { deviceColor, isLandscape, toggleLandscape } = useGamepad();
  const isWhite = deviceColor === 'white';
  const textColor = isWhite ? 'text-[#888]' : 'text-[#444]';

  return (
    <div 
      className={`relative bg-[#050505] overflow-hidden flex flex-col items-center justify-center z-20 ${isLandscape ? 'w-full h-[100dvh]' : 'w-full'}`}
      style={{ padding: isLandscape ? '0' : '7%' }}
    >
      
      {/* 10:9 Display Area (Analogue Pocket specific ratio) OR Fullscreen */}
      <div className={`relative bg-[#000] overflow-hidden flex items-center justify-center ${isLandscape ? 'w-full h-full' : 'w-full aspect-[10/9]'}`}>
        
        <EmulatorWrapper />
        
        {/* Advanced LCD Sub-pixel Grid Overlay */}
        {!isLandscape && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzIiBoZWlnaHQ9IjMiPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48cmVjdCB4PSIyIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIzIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PHJlY3QgeD0iMCIgeT0iMiIgd2lkdGg9IjMiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgwLDAsMCwwLjA1KSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay z-40 opacity-70"></div>
        )}

        {/* Rotate Icon to trigger Landscape Mode */}
        <button 
          onClick={toggleLandscape}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/50 hover:text-white transition-all backdrop-blur-sm"
          title="Toggle Landscape Mode"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
