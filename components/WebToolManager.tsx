
import React, { useState } from 'react';
import { WebTool } from '../types';

interface WebToolManagerProps {
  webTools: WebTool[];
  setWebTools: React.Dispatch<React.SetStateAction<WebTool[]>>;
  onSelectTool: (tool: WebTool) => void;
}

const WebToolManager: React.FC<WebToolManagerProps> = ({ webTools, setWebTools, onSelectTool }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTool, setNewTool] = useState<Omit<WebTool, 'id'>>({ 
    name: '', 
    url: '', 
    icon: '🔗', 
    openMode: 'iframe' 
  });

  const isHttps = window.location.protocol === 'https:';

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
    setNewTool({ name: '', url: '', icon: '🔗', openMode: 'iframe' });
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
          <p className="text-sm text-white/40 mt-1">Integrate internal dashboards or dev utilities.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-sm shadow-lg shadow-blue-900/20"
        >
          + Add New Tool
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {webTools.map((tool) => {
          const isMixedContent = isHttps && tool.url.startsWith('http:');
          const isExternal = tool.openMode === 'window';
          
          return (
            <div 
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] transition-all"
            >
              <button 
                onClick={(e) => removeTool(tool.id, e)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all z-10"
              >
                ✕
              </button>
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl group-hover:scale-110 transition-transform origin-left">{tool.icon}</div>
                <div className="flex flex-col items-end space-y-1">
                  {isExternal ? (
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                      EXTERNAL ↗
                    </span>
                  ) : (
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
                      IFRAME
                    </span>
                  )}
                  {isMixedContent && !isExternal && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold">
                      MIXED ERR
                    </span>
                  )}
                </div>
              </div>
              <div className="font-bold text-lg mb-1 truncate">{tool.name}</div>
              <div className="text-xs text-white/30 truncate font-mono">{tool.url}</div>
            </div>
          );
        })}

        {webTools.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-24 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
            <div className="text-white/20 text-6xl mb-4">📦</div>
            <div className="text-white/40 font-medium">No tools registered</div>
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
        <h4 className="text-indigo-400 text-sm font-bold flex items-center mb-4 uppercase tracking-widest">
          <span className="mr-2">💡</span> Best Practice for Intranet
        </h4>
        <div className="space-y-4 text-xs text-white/40 leading-relaxed">
          <p>
            <strong>The "Why":</strong> Browsers block <code>http://</code> inside <code>https://</code> for safety. 
            Also, many internal tools (like Jenkins, GitLab) explicitly forbid being displayed in an Iframe.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-xl">
              <p className="text-white/60 font-bold mb-1">✅ Recommended: independent Window</p>
              Use this for complex internal systems. It bypasses all Iframe security headers and Mixed Content errors.
            </div>
            <div className="bg-black/20 p-4 rounded-xl">
              <p className="text-white/60 font-bold mb-1">🚀 Advanced: Run Locally</p>
              Download this project and run <code>npm run dev</code>. Browsers allow <code>localhost</code> to embed almost anything.
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center">
               <span className="mr-2">➕</span> Add Web Utility
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">Display Name</label>
                <input 
                  type="text" 
                  value={newTool.name}
                  onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white focus:border-blue-500 transition-all"
                  placeholder="e.g. Jenkins Dashboard"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">URL</label>
                <input 
                  type="text" 
                  value={newTool.url}
                  onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white focus:border-blue-500 transition-all font-mono text-sm"
                  placeholder="http://192.168.1.50:8080"
                />
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-3 tracking-widest">Opening Strategy</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setNewTool({...newTool, openMode: 'iframe'})}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${newTool.openMode === 'iframe' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40'}`}
                  >
                    Internal Frame
                  </button>
                  <button 
                    onClick={() => setNewTool({...newTool, openMode: 'window'})}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${newTool.openMode === 'window' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/40'}`}
                  >
                    New Window
                  </button>
                </div>
                <p className="text-[10px] text-white/30 mt-3 italic">
                  {newTool.openMode === 'window' ? 'Best for intranet/local tools with security headers.' : 'Best for modern HTTPS-friendly sites.'}
                </p>
              </div>

              <div className="flex space-x-3 mt-8">
                <button onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2.5 text-white/40 font-bold">Cancel</button>
                <button onClick={addTool} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebToolManager;
