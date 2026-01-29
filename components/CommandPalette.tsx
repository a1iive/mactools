
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ToolView, WebTool } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (view: ToolView) => void;
  onSelectWebTool: (tool: WebTool) => void;
  webTools: WebTool[];
}

interface CommandItem {
  id: string;
  name: string;
  icon: string;
  shortcut?: string;
  type: 'system' | 'web';
  view?: ToolView;
  tool?: WebTool;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelect, onSelectWebTool, webTools = [] }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCommands = useMemo(() => {
    const systemCommands: CommandItem[] = [
      { id: 'dash', name: 'Home / Dashboard', icon: '🏠', shortcut: 'H', type: 'system', view: ToolView.DASHBOARD },
      { id: 'trans', name: 'Smart Translator', icon: '🌍', shortcut: 'F', type: 'system', view: ToolView.TRANSLATOR },
      { id: 'calc', name: 'Calculator', icon: '🧮', shortcut: 'C', type: 'system', view: ToolView.CALCULATOR },
      { id: 'time', name: 'Timestamp Converter', icon: '🕒', shortcut: 'T', type: 'system', view: ToolView.TIMESTAMP },
      { id: 'base', name: 'Base Converter (Hex/Bin)', icon: '🔢', shortcut: 'B', type: 'system', view: ToolView.BASE_CONVERTER },
      { id: 'manage', name: 'Manage Web Tools', icon: '🌐', shortcut: 'W', type: 'system', view: ToolView.WEB_TOOLS },
      { id: 'settings', name: 'Settings', icon: '⚙️', shortcut: 'S', type: 'system', view: ToolView.SETTINGS },
    ];

    const webToolCommands: CommandItem[] = (webTools || []).map(tool => ({
      id: `web-${tool.id}`,
      name: tool.name,
      icon: tool.icon || '🔗',
      type: 'web',
      tool: tool
    }));

    return [...systemCommands, ...webToolCommands];
  }, [webTools]);

  const filteredCommands = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allCommands;
    return allCommands.filter(c => 
      c.name.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Ensure index stays in bounds if filter changes
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length && filteredCommands.length > 0) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, selectedIndex]);

  const handleSelection = (cmd: CommandItem) => {
    if (cmd.type === 'system' && cmd.view) {
      onSelect(cmd.view);
    } else if (cmd.type === 'web' && cmd.tool) {
      onSelectWebTool(cmd.tool);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      if (filteredCommands[selectedIndex]) {
        handleSelection(filteredCommands[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-black/20">
          <span className="text-2xl opacity-50">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, commands, or your web apps..."
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-white/20"
          />
          <div className="hidden sm:block px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/30 font-mono uppercase tracking-tighter">
            ESC to close
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto p-2 custom-scrollbar">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => handleSelection(cmd)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                  index === selectedIndex ? 'bg-indigo-600 shadow-lg scale-[1.01]' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className={`text-xl transition-transform ${index === selectedIndex ? 'scale-110' : ''}`}>
                    {cmd.icon}
                  </span>
                  <div className="flex flex-col truncate">
                    <span className={`font-medium truncate ${index === selectedIndex ? 'text-white' : 'text-white/80'}`}>
                      {cmd.name}
                    </span>
                    {cmd.type === 'web' && (
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${index === selectedIndex ? 'text-indigo-200' : 'text-white/20'}`}>
                        Custom Web Tool
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {cmd.shortcut && (
                    <div className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      index === selectedIndex 
                        ? 'bg-white/20 border-white/30 text-white' 
                        : 'bg-white/5 border-white/10 text-white/20'
                    }`}>
                      {cmd.shortcut}
                    </div>
                  )}
                  {cmd.type === 'web' && (
                    <span className={`text-[10px] ${index === selectedIndex ? 'text-white/60' : 'text-white/20'}`}>↗</span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="text-4xl mb-3 opacity-20">📭</span>
              <div className="text-white/30 italic text-sm">
                No matching tools or commands for "{query}"
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between">
           <div className="flex space-x-4">
              <span className="text-[10px] text-white/30 flex items-center font-medium">
                <kbd className="bg-white/10 px-1 rounded mr-1 text-white/50 border border-white/10">↑↓</kbd> Navigate
              </span>
              <span className="text-[10px] text-white/30 flex items-center font-medium">
                <kbd className="bg-white/10 px-1 rounded mr-1 text-white/50 border border-white/10">↵</kbd> Select
              </span>
           </div>
           <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Command Center</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
