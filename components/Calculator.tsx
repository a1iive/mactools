
import React, { useState, useEffect, useCallback } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [lastOperator, setLastOperator] = useState<string | null>(null);

  const calculate = useCallback(() => {
    if (!equation) return;
    try {
      // 基础安全检查
      const sanitized = equation.replace(/[^-()\d/*+.]/g, '');
      if (!sanitized) return;
      
      // 使用 Function 代替 eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      const resultStr = Number.isFinite(result) 
        ? (Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString())
        : 'Error';
      
      setHistory(prev => [`${equation} = ${resultStr}`, ...prev].slice(0, 10));
      setDisplay(resultStr);
      setEquation(resultStr);
      setShouldResetDisplay(true);
      setLastOperator(null);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setShouldResetDisplay(true);
    }
  }, [equation]);

  const handleInput = useCallback((value: string) => {
    if (value === 'AC') {
      setDisplay('0');
      setEquation('');
      setShouldResetDisplay(false);
      setLastOperator(null);
      return;
    }

    if (value === '=') {
      calculate();
      return;
    }

    if (value === '±') {
      setDisplay(prev => {
        const num = parseFloat(prev);
        const res = isNaN(num) ? '0' : (num * -1).toString();
        // 同时更新 equation 中的最后一个数字
        setEquation(eq => {
          const parts = eq.split(/([/*+-])/);
          if (parts.length > 0) {
            parts[parts.length - 1] = res;
            return parts.join('');
          }
          return res;
        });
        return res;
      });
      return;
    }

    if (value === '%') {
      const num = parseFloat(display);
      if (isNaN(num)) return;
      const val = (num / 100).toString();
      setDisplay(val);
      setEquation(eq => {
        const parts = eq.split(/([/*+-])/);
        if (parts.length > 0) {
          parts[parts.length - 1] = val;
          return parts.join('');
        }
        return val;
      });
      return;
    }

    const isOperator = ['+', '-', '*', '/'].includes(value);
    
    if (isOperator) {
      setShouldResetDisplay(true);
      setLastOperator(value);
      setEquation(prev => {
        if (!prev && display !== '0') return display + value;
        const lastChar = prev.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
          return prev.slice(0, -1) + value;
        }
        return prev + value;
      });
    } else {
      // 输入的是数字或小数点
      if (shouldResetDisplay) {
        setDisplay(value === '.' ? '0.' : value);
        setShouldResetDisplay(false);
      } else {
        setDisplay(prev => {
          if (prev === '0' && value !== '.') return value;
          if (value === '.' && prev.includes('.')) return prev;
          return prev + value;
        });
      }
      setEquation(prev => {
        if (prev === '0' && value !== '.') return value;
        return prev + value;
      });
    }
  }, [calculate, display, shouldResetDisplay]);

  const handlePaste = useCallback((text: string) => {
    // 过滤掉非数字和非运算符
    const sanitized = text.replace(/[^-()\d/*+.]/g, '');
    if (!sanitized) return;

    // 如果粘贴的是纯数字
    if (/^\d*\.?\d+$/.test(sanitized)) {
      setDisplay(sanitized);
      setEquation(prev => {
        const lastChar = prev.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) return prev + sanitized;
        return sanitized;
      });
      setShouldResetDisplay(false);
    } else {
      // 如果粘贴的是表达式
      setEquation(sanitized);
      const parts = sanitized.split(/[/*+-]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart) setDisplay(lastPart);
      setShouldResetDisplay(false);
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(display);
  }, [display]);

  // 监听键盘和粘贴事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        handleCopy();
        return;
      }
      
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      if (e.key === '.') handleInput('.');
      if (e.key === '+') handleInput('+');
      if (e.key === '-') handleInput('-');
      if (e.key === '*') handleInput('*');
      if (e.key === '/') handleInput('/');
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleInput('=');
      }
      if (e.key === 'Escape') handleInput('AC');
      if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        setEquation(prev => prev.length > 1 ? prev.slice(0, -1) : '');
      }
    };

    const onPaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text');
      if (text) handlePaste(text);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', onPaste);
    };
  }, [handleInput, handleCopy, handlePaste]);

  const buttons = [
    { label: 'AC', className: 'bg-zinc-400 text-black hover:bg-zinc-300' },
    { label: '±', className: 'bg-zinc-400 text-black hover:bg-zinc-300' },
    { label: '%', className: 'bg-zinc-400 text-black hover:bg-zinc-300' },
    { label: '÷', className: 'bg-orange-500 text-white hover:bg-orange-400', value: '/' },
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
    <div className="p-8 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center min-h-[600px]">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8 text-white flex items-center self-start">
          <span className="mr-3">🧮</span> 计算器
        </h2>
        
        <div className="bg-black/80 rounded-[40px] p-6 shadow-2xl border border-white/10 w-[360px] relative">
          {/* 显示区域 */}
          <div 
            className="h-32 flex flex-col justify-end items-end px-4 mb-6 cursor-pointer group"
            onClick={handleCopy}
            title="点击复制结果"
          >
             <div className="text-white/40 text-sm font-mono overflow-x-auto whitespace-nowrap w-full text-right no-scrollbar mb-1">
               {equation || ' '}
             </div>
             <div className="text-white text-6xl font-light tracking-tighter overflow-x-auto whitespace-nowrap w-full text-right no-scrollbar">
               {display}
             </div>
             <div className="absolute top-8 right-10 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/40 uppercase tracking-widest">
               点击复制
             </div>
          </div>
          
          {/* 按钮网格 */}
          <div className="grid grid-cols-4 gap-4">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleInput(btn.value || btn.label)}
                className={`${btn.className} h-16 rounded-full flex items-center justify-center text-2xl font-medium transition-all active:scale-90 shadow-lg ${btn.label === '0' ? 'col-span-2 aspect-auto' : 'aspect-square'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col items-center space-y-2">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            支持键盘操作 & 粘贴 (Ctrl+V)
          </p>
          <button 
            onClick={async () => {
              const text = await navigator.clipboard.readText();
              handlePaste(text);
            }}
            className="px-4 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] text-white/40 uppercase tracking-widest transition-colors border border-white/10"
          >
            点击粘贴剪贴板内容
          </button>
        </div>
      </div>

      {/* 历史记录面板 */}
      <div className="w-full lg:w-80 bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col h-[540px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">历史记录</h3>
          {history.length > 0 && (
            <button 
              onClick={() => setHistory([])}
              className="text-[10px] text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest"
            >
              清空
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {history.length > 0 ? history.map((item, i) => (
            <div 
              key={i} 
              className="text-sm font-mono text-white/60 border-b border-white/5 pb-3 hover:text-white transition-colors cursor-pointer"
              onClick={() => {
                const result = item.split('=')[1]?.trim();
                if (result) {
                  setDisplay(result);
                  setEquation(result);
                  setShouldResetDisplay(true);
                }
              }}
            >
              <div className="opacity-40 text-[10px] mb-1">{item.split('=')[0]}</div>
              <div className="text-lg text-white/90">= {item.split('=')[1]}</div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-2">
              <span className="text-4xl">📜</span>
              <span className="text-xs italic">暂无历史记录</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
