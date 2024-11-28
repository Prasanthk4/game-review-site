import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated Spinner */}
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-zinc-800" />
        
        {/* Spinning Gradient Ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-red-500 animate-spin" />
        
        {/* Middle Ring */}
        <div className="absolute inset-3 rounded-full border-[3px] border-zinc-800" />
        
        {/* Middle Spinning Ring */}
        <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-t-purple-500 animate-spin" style={{ animationDuration: '0.75s', animationDirection: 'reverse' }} />
        
        {/* Inner Ring */}
        <div className="absolute inset-6 rounded-full border-[3px] border-zinc-800" />
        
        {/* Inner Spinning Ring */}
        <div className="absolute inset-6 rounded-full border-[3px] border-transparent border-t-teal-500 animate-spin" style={{ animationDuration: '0.5s' }} />
      </div>
      
      {/* Loading Text */}
      <div className="mt-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
