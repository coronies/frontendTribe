import React, { useState, createContext, useContext, useEffect } from 'react';
import { Login } from './Login';
import { Registration } from './Registration';
import '../styles/flip.css';
import '../styles/background-effects.css';

interface FlipContextType {
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export const FlipContext = createContext<FlipContextType | undefined>(undefined);

export function useFlip() {
  const context = useContext(FlipContext);
  if (!context) {
    throw new Error('useFlip must be used within a FlipProvider');
  }
  return context;
}

export function AuthCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Add effect to prevent body scrolling when modal is open
  useEffect(() => {
    // Set viewport height for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Update on resize
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FlipContext.Provider value={{ isFlipped, setIsFlipped }}>
      <div className="min-h-[100vh] min-h-[calc(var(--vh,1vh)*100)] w-full 
        flex items-center justify-center
        overflow-y-auto overflow-x-hidden
        fixed inset-0 z-50
        bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 font-mono">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
              <div className="firefly"></div>
            </div>
          </div>
        </div>
        <div className="w-full min-h-full py-6 px-4 flex items-center justify-center relative">
          <div className={`flip-container ${isFlipped ? 'flipped' : ''} w-full max-w-md mx-auto`}>
            <div className="flipper">
              <div className="front">
                <div className="w-full backdrop-blur-sm bg-white/30 rounded-3xl p-8
                  shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]
                  border border-white/20">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Welcome Back</h2>
                    <Login />
                  </div>
                </div>
              </div>
              <div className="back">
                <div className="w-full backdrop-blur-sm bg-white/30 rounded-3xl p-8
                  shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]
                  border border-white/20">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-700 tracking-tight">Create Account</h2>
                    <Registration />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlipContext.Provider>
  );
} 