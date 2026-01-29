
import React, { useState } from 'react';
import { WebTool } from '../types';

interface WebToolManagerProps {
  webTools: WebTool[];
  setWebTools: React.Dispatch<React.SetStateAction<WebTool[]>>;
  onSelectTool: (tool) => void;
}

const WebToolManager: React.FC<WebToolManagerProps> = ({ webTools, setWebTools, onSelectTool }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', url: '', icon: '🔗' });

  const addTool = () => {
    if (!newTool.name || !newTool.url) return;
    let finalUrl = newTool.url;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }
    const tool: WebTool = {
      ...newTool,
      url: finalUrl,
      id: Date.now().toString()
    };
    setWebTools([...webTools, tool]);
    setNewTool({ name: '', url: '', icon: '🔗' });
    setIsAdding(false);
  };

  const removeTool = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWebTools(webTools.filter(t => t.id !== id));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🌐</span> Web Tool Dashboard
          </h2>
          <p className="text-sm text-white/40 mt-1">Integrate your internal tools or favorite dev sites.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-sm shadow-lg shadow-blue-900/20"
        >
          + Add New Tool
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {webTools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all"
          >
            <button 
              onClick={(e) => removeTool(tool.id, e)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all"
            >
              ✕
            </button>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{tool.icon}</div>
            <div className="font-bold text-lg mb-1 truncate">{tool.name}</div>
            <div className="text-xs text-white/30 truncate font-mono">{tool.url}</div>
          </div>
        ))}

        {webTools.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-24 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
            <div className="text-white/20 text-6xl mb-4">📦</div>
            <div className="text-white/40 font-medium">No tools registered</div>
            <p className="text-sm text-white/20 mt-2">Start by adding an internal link or a useful web utility.</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
        <h4 className="text-yellow-500/80 text-sm font-bold flex items-center mb-2">
          <span className="mr-2">💡</span> Troubleshooting Internal Tools
        </h4>
        <ul className="text-xs text-white/40 space-y-2 list-disc pl-4">
          <li><strong>X-Frame-Options:</strong> If a site shows a blank screen or connection refused, it probably forbids embedding. Use the ↗️ button on the tool toolbar to open it in a separate tab.</li>
          <li><strong>Mixed Content:</strong> Ensure your tool uses <code>https://</code> if this app is accessed via HTTPS.</li>
          <li><strong>Auth:</strong> If the tool requires login, you might need to login in your main browser first so the cookies are available.</li>
        </ul>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl ring-1 ring-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center">
               <span className="mr-2">➕</span> Add New Tool
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">Tool Display Name</label>
                <input 
                  type="text" 
                  value={newTool.name}
                  onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all"
                  placeholder="e.g. Jenkins CI"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">URL</label>
                <input 
                  type="text" 
                  value={newTool.url}
                  onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-white transition-all font-mono text-sm"
                  placeholder="https://jenkins.internal.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">Emoji Icon</label>
                <input 
                  type="text" 
                  value={newTool.icon}
                  onChange={(e) => setNewTool({...newTool, icon: e.target.value})}
                  className="w-16 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-center text-xl"
                  placeholder="🚀"
                />
              </div>
              
              <div className="flex space-x-3 mt-10">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={addTool}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors font-bold text-white shadow-lg shadow-blue-900/40"
                >
                  Create Tool
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebToolManager;
