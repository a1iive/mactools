
import React, { useState, useEffect, useCallback } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [shouldReset, setShouldReset] = useState(false);

  const calculate = useCallback(() => {
    try {
      // Basic safety check for eval-like behavior
      const sanitized = equation.replace(/[^-()\d/*+.]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(4).replace(/\.?0+$/, "");
      
      setHistory(prev => [`${equation} = ${resultStr}`, ...prev].slice(0, 10));
      setDisplay(resultStr);
      setEquation(resultStr);
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setShouldReset(true);
    }
  }, [equation]);

  const handleInput = useCallback((value: string) => {
    if (value === 'AC') {
      setDisplay('0');
      setEquation('');
      setShouldReset(false);
      return;
    }

    if (value === '=') {
      calculate();
      return;
    }

    if (value === '±') {
      setDisplay(prev => (parseFloat(prev) * -1).toString());
      setEquation(prev => (parseFloat(prev) * -1).toString());
      return;
    }

    if (value === '%') {
      const val = (parseFloat(display) / 100).toString();
      setDisplay(val);
      setEquation(val);
      return;
    }

    // Handle numbers and operators
    if (shouldReset && !['+', '-', '*', '/'].includes(value)) {
      setDisplay(value);
      setEquation(value);
      setShouldReset(false);
    } else {
      setShouldReset(false);
      const isOperator = ['+', '-', '*', '/'].includes(value);
      
      if (display === '0' && !isOperator) {
        setDisplay(value);
        setEquation(value);
      } else {
        setDisplay(prev => isOperator ? prev : (shouldReset ? value : prev + value));
        setEquation(prev => prev + value);
      }
    }
  }, [calculate, display, shouldReset]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      if (e.key === '.') handleInput('.');
      if (e.key === '+') handleInput('+');
      if (e.key === '-') handleInput('-');
      if (e.key === '*') handleInput('*');
      if (e.key === '/') handleInput('/');
      if (e.key === 'Enter' || e.key === '=') handleInput('=');
      if (e.key === 'Escape' || e.key === 'c') handleInput('AC');
      if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        setEquation(prev => prev.length > 1 ? prev.slice(0, -1) : '');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  const buttons = [
    { label: 'AC', className: 'bg-zinc-400 text-black hover:bg-zinc-300' },
    { label: '±', className: 'bg-zinc-400 text-black hover:bg-zinc-300' },
    { label: '%', className: 'bg-zinc-400 text-black hover:bg-zinc-300' },
    { label: '/', className: 'bg-orange-500 text-white hover:bg-orange-400', value: '/' },
    { label: '7', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '8', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '9', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '×', className: 'bg-orange-500 text-white hover:bg-orange-400', value: '*' },
    { label: '4', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '5', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '6', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '−', className: 'bg-orange-500 text-white hover:bg-orange-400', value: '-' },
    { label: '1', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '2', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '3', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '+', className: 'bg-orange-500 text-white hover:bg-orange-400', value: '+' },
    { label: '0', className: 'bg-zinc-700 text-white hover:bg-zinc-600 text-left px-8' },
    { label: '.', className: 'bg-zinc-700 text-white hover:bg-zinc-600' },
    { label: '=', className: 'bg-orange-500 text-white hover:bg-orange-400' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
          <span className="mr-2">🧮</span> Calculator
        </h2>
        
        <div className="bg-black/60 rounded-[30px] p-4 shadow-2xl border border-white/10 w-[320px]">
          <div className="h-24 flex flex-col justify-end items-end px-4 mb-4">
             <div className="text-white/40 text-sm font-mono truncate max-w-full">{equation || ' '}</div>
             <div className="text-white text-5xl font-light tracking-tight truncate max-w-full">
               {display}
             </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleInput(btn.value || btn.label)}
                // Removed the non-existent btn.colSpan property check and simplified the logic
                className={`${btn.className} h-14 rounded-full flex items-center justify-center text-xl font-medium transition-all active:scale-95 ${btn.label === '0' ? 'col-span-2 aspect-auto' : 'aspect-square'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl p-6 self-stretch">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">History</h3>
        <div className="space-y-3">
          {history.length > 0 ? history.map((item, i) => (
            <div key={i} className="text-sm font-mono text-white/70 border-b border-white/5 pb-2">
              {item}
            </div>
          )) : (
            <div className="text-xs text-white/20 italic">No history yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
