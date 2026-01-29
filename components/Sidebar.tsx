
import React, { useState } from 'react';
import { ToolView } from '../types';

interface SidebarProps {
  activeView: ToolView;
  setActiveView: (view: ToolView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const items = [
    { view: ToolView.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { view: ToolView.CALCULATOR, label: 'Calculator', icon: '🧮' },
    { view: ToolView.TIMESTAMP, label: 'Timestamp', icon: '🕒' },
    { view: ToolView.BASE_CONVERTER, label: 'Base Conv', icon: '🔢' },
    { view: ToolView.WEB_TOOLS, label: 'Web Tools', icon: '🌐' },
    { view: ToolView.SETTINGS, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-black/40 border-r border-white/10 flex flex-col p-4 relative group`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white/10 border border-white/20 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white/20"
      >
        {isCollapsed ? '›' : '‹'}
      </button>

      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-2 mb-8 overflow-hidden`}>
        <div className="flex space-x-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          {!isCollapsed && <div className="w-3 h-3 rounded-full bg-yellow-500" />}
          {!isCollapsed && <div className="w-3 h-3 rounded-full bg-green-500" />}
        </div>
        {!isCollapsed && <span className="text-white/60 font-bold ml-4 tracking-tight truncate">MacTools Pro</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-hidden">
        {items.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-3'} py-2 rounded-lg transition-all ${
              activeView === item.view 
                ? 'bg-white/15 text-white shadow-lg' 
                : 'text-white/60 hover:bg-white/5 hover:text-white/80'
            }`}
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="mt-auto pt-4 border-t border-white/10">
          <div className="px-3 py-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
            System
          </div>
          <div className="px-3 py-1 text-white/50 text-[10px]">
            v1.1.0 Stable
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
