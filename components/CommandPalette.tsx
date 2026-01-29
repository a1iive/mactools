
import React, { useState, useEffect, useRef } from 'react';
import { ToolView } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (view: ToolView) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: ToolView.DASHBOARD, name: 'Home / Dashboard', icon: '🏠', shortcut: 'H' },
    { id: ToolView.CALCULATOR, name: 'Calculator', icon: '🧮', shortcut: 'C' },
    { id: ToolView.TIMESTAMP, name: 'Timestamp Converter', icon: '🕒', shortcut: 'T' },
    { id: ToolView.BASE_CONVERTER, name: 'Base Converter (Hex/Bin)', icon: '🔢', shortcut: 'B' },
    { id: ToolView.WEB_TOOLS, name: 'Manage Web Tools', icon: '🌐', shortcut: 'W' },
  ];

  const filteredCommands = commands.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-slate-900/90 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-black/20">
          <span className="text-2xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-white/30"
          />
          <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono">
            ESC to close
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto p-2">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => onSelect(cmd.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors text-left group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">{cmd.icon}</span>
                  <span className="text-white/80 font-medium">{cmd.name}</span>
                </div>
                <div className="text-xs text-white/20 font-mono px-2 py-1 rounded border border-white/5 group-hover:border-white/20">
                  {cmd.shortcut}
                </div>
              </button>
            ))
          ) : (
            <div className="p-12 text-center text-white/30 italic">
              No commands matching "{query}"
            </div>
          )}
        </div>
        
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between">
           <div className="flex space-x-4">
              <span className="text-[10px] text-white/30 flex items-center">
                <kbd className="bg-white/10 px-1 rounded mr-1">↑↓</kbd> to navigate
              </span>
              <span className="text-[10px] text-white/30 flex items-center">
                <kbd className="bg-white/10 px-1 rounded mr-1">↵</kbd> to select
              </span>
           </div>
           <span className="text-[10px] text-white/20">MacTools Assistant</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
