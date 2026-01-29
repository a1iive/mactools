
import React, { useState } from 'react';

interface SettingsProps {
  onInstall?: () => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onInstall, isInstallable, isInstalled }) => {
  const version = "1.2.1";
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm('This will clear all your custom web tools, translation history, and reset the app. Are you sure?')) return;
    
    setIsResetting(true);
    // 1. Clear LocalStorage
    localStorage.clear();
    
    // 2. Unregister Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }
    
    // 3. Clear Caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // 4. Reload
    window.location.reload();
  };
  
  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-8 flex items-center">
        <span className="mr-2">⚙️</span> Settings & Desktop Integration
      </h2>

      <div className="space-y-6">
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
              <span className="text-xs text-white/30 italic">Already standalone or check browser bar</span>
            )}
          </div>
          
          <div className="bg-black/20 rounded-xl p-4 text-sm text-white/50 space-y-2">
            <p>• Fast switching with <kbd className="bg-white/10 px-1 rounded">Cmd + Tab</kbd></p>
            <p>• Clean window without browser UI</p>
            <p>• Works offline after first load</p>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Troubleshooting</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reset Application Data</p>
              <p className="text-xs text-white/40">Clear cache and local storage if you experience sync issues.</p>
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

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Application Info</h3>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/60">Current Version</span>
            <span className="font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-sm">{version}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/60">Update Channel</span>
            <span className="text-sm">Stable (Auto-sync)</span>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-orange-400">Quick Shortcut Guide</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Search Palette</span>
                <kbd className="bg-white/10 px-2 py-1 rounded border border-white/10 text-white/80 font-mono">⌘ K</kbd>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Close Palette</span>
                <kbd className="bg-white/10 px-2 py-1 rounded border border-white/10 text-white/80 font-mono">ESC</kbd>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
