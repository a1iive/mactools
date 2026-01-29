
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

const languages = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

const Translator: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<{source: string, target: string}[]>(() => {
    const saved = localStorage.getItem('mac_translate_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mac_translate_history', JSON.stringify(history));
  }, [history]);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setTargetText('');
      setErrorMessage(null);
      return;
    }

    // Capture the key from the environment
    const apiKey = process.env.API_KEY;
    
    // Check if key is actually present and not just the string "undefined" (a common build-time issue)
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      setErrorMessage('API Key is missing or invalid. Please check your Vercel Environment Variables.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptText = `Translate the following text to ${languages.find(l => l.code === targetLang)?.name}. 
      Source language hint: ${sourceLang === 'auto' ? 'detect automatically' : sourceLang}.
      Provide only the translated text.
      Text: "${sourceText}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
      });

      const translated = response.text?.trim() || '';
      setTargetText(translated);
      
      if (translated) {
        setHistory(prev => {
          const newHistory = [{ source: sourceText, target: translated }, ...prev];
          return newHistory.filter((v, i, a) => a.findIndex(t => t.source === v.source) === i).slice(0, 10);
        });
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      // Handle quota or safety errors specifically
      if (error.message?.includes('quota')) {
        setErrorMessage('Translation failed: API Quota exceeded. Please try again later.');
      } else {
        setErrorMessage(`Translation failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang]);

  // Debounced effect for automatic translation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText.length > 0) handleTranslate();
    }, 1000);
    return () => clearTimeout(timer);
  }, [sourceText, sourceLang, targetLang]);

  const swapLanguages = () => {
    if (sourceLang === 'auto') return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🌍</span> Smart Translator
          </h2>
          <p className="text-sm text-white/40 mt-1">AI-powered context-aware translations.</p>
        </div>
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button 
            onClick={() => { setSourceText(''); setTargetText(''); setErrorMessage(null); }}
            className="px-4 py-1.5 text-xs font-bold text-white/40 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
          <span className="text-red-500">⚠️</span>
          <div className="text-sm text-red-400">
            <p className="font-bold">Error</p>
            <p>{errorMessage}</p>
            <p className="text-[10px] mt-1 opacity-60">Tip: If you just added the key in Vercel, you need to trigger a NEW DEPLOYMENT for it to take effect.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Source Section */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Type something to translate..."
              className="w-full h-48 bg-black/30 border border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-indigo-500 transition-all resize-none font-sans"
            />
          </div>
        </div>

        {/* Swap Button (Middle for desktop) */}
        <div className="hidden lg:flex items-center justify-center -mx-3 z-10">
          <button 
            onClick={swapLanguages}
            disabled={sourceLang === 'auto'}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90"
          >
            ⇄
          </button>
        </div>

        {/* Target Section */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {languages.filter(l => l.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.name}</option>
              ))}
            </select>
            <button 
              onClick={() => copyToClipboard(targetText)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
              title="Copy result"
            >
              📋
            </button>
          </div>
          <div className="relative flex-1">
            <div className={`w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-lg overflow-auto ${isLoading ? 'opacity-50' : ''}`}>
              {isLoading ? (
                <div className="flex items-center space-x-2 text-white/30 italic">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Translating...</span>
                </div>
              ) : (
                targetText || <span className="text-white/20 italic">Translation will appear here</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mt-auto">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Recent Translations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-auto pr-2">
          {history.length > 0 ? history.map((item, i) => (
            <div 
              key={i} 
              onClick={() => { setSourceText(item.source); setTargetText(item.target); setErrorMessage(null); }}
              className="bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl cursor-pointer transition-colors group"
            >
              <div className="text-xs text-white/60 truncate mb-1">{item.source}</div>
              <div className="text-xs text-indigo-400 font-medium truncate group-hover:text-indigo-300 transition-colors">{item.target}</div>
            </div>
          )) : (
            <div className="text-xs text-white/20 italic">Your translation history will appear here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Translator;
