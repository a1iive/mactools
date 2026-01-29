
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TimestampConverter from './components/TimestampConverter';
import BaseConverter from './components/BaseConverter';
import WebToolManager from './components/WebToolManager';
import Calculator from './components/Calculator';
import CommandPalette from './components/CommandPalette';
import Settings from './components/Settings';
import { ToolView, WebTool } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ToolView>(ToolView.DASHBOARD);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedWebTool, setSelectedWebTool] = useState<WebTool | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [webTools, setWebTools] = useState<WebTool[]>(() => {
    const saved = localStorage.getItem('mac_web_tools');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Google (Search Only)', url: 'https://www.google.com/search?igu=1', icon: '🔍' },
      { id: '2', name: 'GitHub', url: 'https://github.com', icon: '🐙' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mac_web_tools', JSON.stringify(webTools));
  }, [webTools]);

  // PWA Install Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA Install prompt deferred');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const toggleCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  const refreshIframe = () => {
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 10);
    }
  };

  const openExternally = () => {
    if (selectedWebTool) {
      window.open(selectedWebTool.url, '_blank');
    }
  };

  const renderView = () => {
    switch (activeView) {
      case ToolView.TIMESTAMP: return <TimestampConverter />;
      case ToolView.BASE_CONVERTER: return <BaseConverter />;
      case ToolView.CALCULATOR: return <Calculator />;
      case ToolView.SETTINGS: 
        return <Settings 
          onInstall={installPWA} 
          isInstallable={!!deferredPrompt} 
          isInstalled={isInstalled} 
        />;
      case ToolView.WEB_TOOLS:
        return (
          <WebToolManager 
            webTools={webTools} 
            setWebTools={setWebTools} 
            onSelectTool={(tool) => {
              setSelectedWebTool(tool);
              setActiveView(ToolView.WEB_TOOLS);
            }}
          />
        );
      case ToolView.DASHBOARD:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/80 p-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to MacTools</h1>
            <p className="text-lg opacity-60 mb-8">Press <kbd className="bg-white/10 px-2 py-1 rounded">⌘K</kbd> to open command palette</p>
            
            {deferredPrompt && !isInstalled && (
              <button 
                onClick={installPWA}
                className="mb-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold shadow-xl shadow-indigo-900/40 transition-all flex items-center space-x-2 animate-bounce"
              >
                <span>📥</span>
                <span>Install to Desktop</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              {[
                { view: ToolView.CALCULATOR, icon: '🧮', label: 'Calculator', sub: 'Math & History' },
                { view: ToolView.TIMESTAMP, icon: '🕒', label: 'Timestamp', sub: 'Unix converter' },
                { view: ToolView.BASE_CONVERTER, icon: '🔢', label: 'Base Converter', sub: 'Hex/Bin/Oct' },
                { view: ToolView.WEB_TOOLS, icon: '🌐', label: 'Web Tools', sub: 'Embedded apps' }
              ].map(card => (
                <button 
                  key={card.view}
                  onClick={() => setActiveView(card.view)}
                  className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-left group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{card.icon}</div>
                  <div className="font-semibold">{card.label}</div>
                  <div className="text-sm opacity-50">{card.sub}</div>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 overflow-auto relative mac-blur bg-black/20 flex flex-col">
        <div className="window-drag-handle shrink-0" />
        
        <div className="flex-1 overflow-auto">
          {activeView === ToolView.WEB_TOOLS && selectedWebTool ? (
            <div className="h-full w-full flex flex-col">
              <div className="h-10 bg-black/60 border-b border-white/10 flex items-center px-4 justify-between">
                <div className="flex items-center space-x-4 overflow-hidden">
                  <div className="flex items-center space-x-2">
                      <span className="text-lg">{selectedWebTool.icon}</span>
                      <span className="text-sm font-medium text-white/80 truncate">{selectedWebTool.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                      <button onClick={refreshIframe} className="p-1.5 hover:bg-white/10 rounded text-white/40" title="Refresh">🔄</button>
                      <button onClick={openExternally} className="p-1.5 hover:bg-white/10 rounded text-white/40" title="Open in browser">↗️</button>
                  </div>
                </div>
                <button onClick={() => setSelectedWebTool(null)} className="px-3 py-1 bg-white/5 hover:bg-white/15 rounded-md text-white/60 text-xs transition-colors">Close</button>
              </div>
              <div className="flex-1 relative bg-white/5">
                <iframe ref={iframeRef} src={selectedWebTool.url} className="absolute inset-0 w-full h-full border-none" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-popups-to-escape-sandbox" />
              </div>
            </div>
          ) : (
            renderView()
          )}
        </div>
      </main>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onSelect={(view) => {
          setActiveView(view);
          setIsCommandPaletteOpen(false);
          setSelectedWebTool(null);
        }}
      />
    </div>
  );
};

export default App;
