
import React from 'react';

const Settings: React.FC = () => {
  const version = "1.1.0";
  
  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-8 flex items-center">
        <span className="mr-2">⚙️</span> Settings & Desktop Integration
      </h2>

      <div className="space-y-6">
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
            Tip: To update, simply refresh the application. If deployed on Vercel/GitHub Pages, new versions load automatically.
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">MacOS Global Shortcut Guide</h3>
          <p className="text-sm text-white/60 mb-4">
            Since this is a Web/PWA tool, you can set a global system shortcut to launch it instantly:
          </p>
          <ol className="text-sm text-white/50 space-y-3 list-decimal pl-4">
            <li>Open <strong>Automator.app</strong> on your Mac.</li>
            <li>Choose <strong>Quick Action</strong>.</li>
            <li>Search for <strong>"Run Shell Script"</strong> and drag it in.</li>
            <li>Paste this command: <code className="bg-black/40 px-2 py-1 rounded text-purple-300">open -a "Google Chrome" --args --app=YOUR_APP_URL</code> (or the name of the installed PWA).</li>
            <li>Save it as "Open MacTools".</li>
            <li>Go to <strong>System Settings > Keyboard > Shortcuts > Services</strong> and bind it to a key like <kbd className="bg-white/10 px-1 rounded">Cmd+Shift+T</kbd>.</li>
          </ol>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Desktop App Mode</h3>
          <p className="text-sm text-white/60 mb-4">
            For the best experience, click the <strong>Install Icon</strong> in your browser's address bar. This will:
          </p>
          <ul className="text-sm text-white/50 space-y-2 list-disc pl-4">
            <li>Remove the browser tab and address bar.</li>
            <li>Allow the app to stay in the Dock.</li>
            <li>Enable <strong>Cmd + Tab</strong> switching.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Settings;
