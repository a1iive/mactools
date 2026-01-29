
import React from 'react';

interface SettingsProps {
  onInstall?: () => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onInstall, isInstallable, isInstalled }) => {
  const version = "1.2.0";
  
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
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Application Info</h3>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/60">Current Version</span>
            <span className="font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-sm">{version}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/60">Update Channel</span>
            <span className="text-sm">Stable (Auto-sync)</span>
          </div>
          <div className="mt-4 text-xs text-white/30">
            Tip: New versions are automatically pushed from GitHub. Just refresh the app to sync.
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">MacOS Global Shortcut Guide</h3>
          <p className="text-sm text-white/60 mb-4">
            Set a global system shortcut to launch this tool from anywhere:
          </p>
          <ol className="text-sm text-white/50 space-y-3 list-decimal pl-4">
            <li>Open <strong>Automator.app</strong> on your Mac.</li>
            <li>Choose <strong>Quick Action</strong>.</li>
            <li>Search for <strong>"Run Shell Script"</strong> and drag it in.</li>
            <li>Paste this command: <code className="bg-black/40 px-2 py-1 rounded text-purple-300">open -a "Google Chrome" --args --app={window.location.origin}</code></li>
            <li>Save it as "Open MacTools".</li>
            <li>Go to <strong>System Settings &gt; Keyboard &gt; Shortcuts &gt; Services</strong> and bind it to <kbd className="bg-white/10 px-1 rounded">Cmd+Shift+T</kbd>.</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default Settings;
