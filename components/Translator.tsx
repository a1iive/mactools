
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AIProvider, AIConfig } from '../types';

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

  const [aiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('mac_ai_config');
    return saved ? JSON.parse(saved) : { provider: AIProvider.GEMINI };
  });

  useEffect(() => {
    localStorage.setItem('mac_translate_history', JSON.stringify(history));
  }, [history]);

  const retryWithBackoff = async <T,>(
    fn: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1500
  ): Promise<T> => {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        const errorMsg = error.message?.toLowerCase() || '';
        const isRetryable = errorMsg.includes('503') || 
                            errorMsg.includes('429') || 
                            errorMsg.includes('overloaded') || 
                            errorMsg.includes('unavailable');
                            
        if (!isRetryable || i === maxRetries - 1) throw error;
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setTargetText('');
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const targetLangName = languages.find(l => l.code === targetLang)?.name;
      const promptText = `Translate the following text to ${targetLangName}. 
      Source language hint: ${sourceLang === 'auto' ? 'detect automatically' : sourceLang}.
      Provide only the translated text, no explanation.
      Text: "${sourceText}"`;

      let translated = '';

      if (aiConfig.provider === AIProvider.OPENAI_COMPATIBLE) {
        // --- Custom OpenAI Compatible Logic ---
        if (!aiConfig.apiKey) {
          throw new Error('Custom API Key is missing. Please check Settings.');
        }

        const response = await fetch(`${aiConfig.baseUrl.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.apiKey}`
          },
          body: JSON.stringify({
            model: aiConfig.model,
            messages: [{ role: 'user', content: promptText }],
            temperature: 0.3
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `HTTP ${response.status}: Failed to fetch translation.`);
        }

        const data = await response.json();
        translated = data.choices?.[0]?.message?.content?.trim() || '';

      } else {
        // --- Built-in Gemini Logic ---
        const apiKey = process.env.API_KEY;
        if (!apiKey || apiKey === 'undefined') {
          throw new Error('Built-in Gemini API Key is not configured in environment.');
        }

        const response = await retryWithBackoff(async () => {
          const ai = new GoogleGenAI({ apiKey });
          return await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: promptText,
          });
        });
        translated = response.text?.trim() || '';
      }

      setTargetText(translated);
      if (translated) {
        setHistory(prev => {
          const newHistory = [{ source: sourceText, target: translated }, ...prev];
          return newHistory.filter((v, i, a) => a.findIndex(t => t.source === v.source) === i).slice(0, 10);
        });
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      setErrorMessage(error.message || 'Unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang, aiConfig]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText.length > 0) handleTranslate();
    }, 1000);
    return () => clearTimeout(timer);
  }, [sourceText, sourceLang, targetLang, handleTranslate]);

  const swapLanguages = () => {
    if (sourceLang === 'auto') return;
    const oldSourceLang = sourceLang;
    const oldSourceText = sourceText;
    const oldTargetText = targetText;
    setSourceLang(targetLang);
    setTargetLang(oldSourceLang);
    setSourceText(oldTargetText);
    setTargetText(oldSourceText);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🌍</span> Smart Translator
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Using: <span className="text-indigo-400 font-bold">{aiConfig.provider === AIProvider.GEMINI ? 'Gemini' : `Custom (${aiConfig.model})`}</span>
          </p>
        </div>
        <button 
          onClick={() => { setSourceText(''); setTargetText(''); setErrorMessage(null); }}
          className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div className="text-sm text-red-400">
            <p className="font-bold">Engine Error</p>
            <p className="opacity-80">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.name}</option>
              ))}
            </select>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type text to translate..."
            className="w-full h-48 bg-black/30 border border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="hidden lg:flex items-center justify-center -mx-3 z-10">
          <button 
            onClick={swapLanguages}
            disabled={sourceLang === 'auto'}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90"
          >
            ⇄
          </button>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {languages.filter(l => l.code !== 'auto').map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.name}</option>
              ))}
            </select>
            <button 
              onClick={() => navigator.clipboard.writeText(targetText)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
            >
              📋
            </button>
          </div>
          <div className={`w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-lg overflow-auto ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-white/30">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Connecting to {aiConfig.provider === AIProvider.GEMINI ? 'Gemini' : 'Custom Provider'}...</span>
              </div>
            ) : (
              targetText || <span className="text-white/20 italic">Result will appear here</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Recent History</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-auto pr-2 custom-scrollbar">
          {history.map((item, i) => (
            <div 
              key={i} 
              onClick={() => setSourceText(item.source)}
              className="bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl cursor-pointer transition-colors group"
            >
              <div className="text-xs text-white/60 truncate mb-1">{item.source}</div>
              <div className="text-xs text-indigo-400 font-medium truncate">{item.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Translator;
