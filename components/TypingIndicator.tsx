import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-3 bg-zinc-800/50 rounded-2xl rounded-tl-none w-fit">
      <div className="w-2 h-2 bg-zinc-400 rounded-full typing-dot"></div>
      <div className="w-2 h-2 bg-zinc-400 rounded-full typing-dot"></div>
      <div className="w-2 h-2 bg-zinc-400 rounded-full typing-dot"></div>
    </div>
  );
};