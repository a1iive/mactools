
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
            <span className="mr-2">🌐</span> 网页工具仪表盘
          </h2>
          <p className="text-sm text-white/40 mt-1">集成内部仪表盘或开发工具。</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-sm shadow-lg shadow-blue-900/20"
        >
          + 添加新工具
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
                      外部打开 ↗
                    </span>
                  ) : (
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
                      内嵌框架 (IFRAME)
                    </span>
                  )}
                  {isMixedContent && !isExternal && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold">
                      混合内容错误
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
            <div className="text-white/40 font-medium">暂无已注册的工具</div>
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
        <h4 className="text-indigo-400 text-sm font-bold flex items-center mb-4 uppercase tracking-widest">
          <span className="mr-2">💡</span> 内网集成最佳实践
        </h4>
        <div className="space-y-4 text-xs text-white/40 leading-relaxed">
          <p>
            <strong>原因:</strong> 出于安全考虑，浏览器会阻止在 <code>https://</code> 中加载 <code>http://</code> 内容。
            此外，许多内部工具（如 Jenkins、GitLab）明确禁止在 Iframe 中显示。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-xl">
              <p className="text-white/60 font-bold mb-1">✅ 推荐: 独立窗口打开</p>
              适用于复杂的内部系统。它绕过了所有 Iframe 安全响应头和混合内容错误。
            </div>
            <div className="bg-black/20 p-4 rounded-xl">
              <p className="text-white/60 font-bold mb-1">🚀 进阶: 本地运行</p>
              下载此项目并在本地运行 <code>npm run dev</code>。浏览器允许 <code>localhost</code> 嵌入几乎任何内容。
            </div>
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-6 flex items-center">
               <span className="mr-2">➕</span> 添加网页工具
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">显示名称</label>
                <input 
                  type="text" 
                  value={newTool.name}
                  onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white focus:border-blue-500 transition-all"
                  placeholder="例如: Jenkins 面板"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 tracking-widest">URL 地址</label>
                <input 
                  type="text" 
                  value={newTool.url}
                  onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 outline-none text-white focus:border-blue-500 transition-all font-mono text-sm"
                  placeholder="http://192.168.1.50:8080"
                />
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <label className="block text-[10px] font-bold text-white/40 uppercase mb-3 tracking-widest">打开策略</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setNewTool({...newTool, openMode: 'iframe'})}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${newTool.openMode === 'iframe' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40'}`}
                  >
                    内嵌框架
                  </button>
                  <button 
                    onClick={() => setNewTool({...newTool, openMode: 'window'})}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${newTool.openMode === 'window' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/40'}`}
                  >
                    新窗口
                  </button>
                </div>
                <p className="text-[10px] text-white/30 mt-3 italic">
                  {newTool.openMode === 'window' ? '最适合具有安全响应头的内网/本地工具。' : '最适合现代 HTTPS 友好型网站。'}
                </p>
              </div>

              <div className="flex space-x-3 mt-8">
                <button onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2.5 text-white/40 font-bold">取消</button>
                <button onClick={addTool} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition-all">创建</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebToolManager;
