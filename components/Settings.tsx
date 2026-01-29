
import React, { useState, useEffect } from 'react';
import { AIProvider, AIConfig } from '../types';

interface SettingsProps {
  onInstall?: () => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onInstall, isInstallable, isInstalled }) => {
  const version = "1.3.0";
  const [isResetting, setIsResetting] = useState(false);
  
  // AI Config State
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('mac_ai_config');
    return saved ? JSON.parse(saved) : {
      provider: AIProvider.GEMINI,
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-3.5-turbo'
    };
  });

  useEffect(() => {
    localStorage.setItem('mac_ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  const handleReset = async () => {
    if (!confirm('This will clear all your custom web tools, translation history, and reset the app. Are you sure?')) return;
    setIsResetting(true);
    localStorage.clear();
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    window.location.reload();
  };
  
  return (
    <div className="p-8 max-w-3xl mx-auto text-white pb-24">
      <h2 className="text-2xl font-bold mb-8 flex items-center">
        <span className="mr-2">⚙️</span> Settings
      </h2>

      <div className="space-y-6">
        {/* AI Engine Configuration */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-indigo-400 flex items-center">
            <span className="mr-2">🤖</span> AI Translation Engine
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2 tracking-widest">Provider</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setAiConfig({...aiConfig, provider: AIProvider.GEMINI})}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${aiConfig.provider === AIProvider.GEMINI ? 'bg-indigo-600 border-indigo-500 shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                  Built-in Gemini
                </button>
                <button 
                  onClick={() => setAiConfig({...aiConfig, provider: AIProvider.OPENAI_COMPATIBLE})}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${aiConfig.provider === AIProvider.OPENAI_COMPATIBLE ? 'bg-purple-600 border-purple-500 shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                  Custom (OpenAI/DeepSeek)
                </button>
              </div>
            </div>

            {aiConfig.provider === AIProvider.OPENAI_COMPATIBLE && (
              <div className="space-y-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 ml-1">Base URL</label>
                  <input 
                    type="text"
                    value={aiConfig.baseUrl}
                    onChange={(e) => setAiConfig({...aiConfig, baseUrl: e.target.value})}
                    placeholder="https://api.deepseek.com/v1"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-purple-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 ml-1">API Key</label>
                  <input 
                    type="password"
                    value={aiConfig.apiKey}
                    onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                    placeholder="sk-..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-purple-500 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1.5 ml-1">Model Name</label>
                  <input 
                    type="text"
                    value={aiConfig.model}
                    onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                    placeholder="deepseek-chat or gpt-4"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-purple-500 outline-none transition-all font-mono"
                  />
                </div>
                <p className="text-[10px] text-white/30 italic px-1">
                  💡 Note: Custom keys are stored locally in your browser.
                </p>
              </div>
            )}

            {aiConfig.provider === AIProvider.GEMINI && (
              <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 text-xs text-indigo-300/70">
                Currently using the system-defined Gemini API Key. Ensure your environment variables are configured correctly for direct access.
              </div>
            )}
          </div>
        </section>

        {/* Desktop Installation */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400">Desktop Installation</h3>
              <p className="text-sm text-white/60">Run MacTools as a native desktop application.</p>
            </div>
            {isInstalled ? (
              <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                ✓ Installed
              </span>
            ) : isInstallable ? (
              <button 
                onClick={onInstall}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 active:scale-95"
              >
                Install Now
              </button>
            ) : (
              <span className="text-xs text-white/30 italic">Already standalone</span>
            )}
          </div>
        </section>

        {/* Reset Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">Advanced</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reset Application Data</p>
              <p className="text-xs text-white/40">Clear everything including custom AI keys and web tools.</p>
            </div>
            <button 
              onClick={handleReset}
              disabled={isResetting}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 transition-all"
            >
              {isResetting ? 'Resetting...' : 'Reset Now'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
