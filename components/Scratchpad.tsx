import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Trash2, Download, FileText, Hash, AlignLeft, Type } from 'lucide-react';

const Scratchpad: React.FC = () => {
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem('mactools_scratchpad_content') || '';
  });

  useEffect(() => {
    localStorage.setItem('mactools_scratchpad_content', text);
  }, [text]);

  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    if (window.confirm('确定要清空所有内容吗？')) {
      setText('');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scratchpad_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileText className="mr-2 text-blue-400" /> 文本草稿箱
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/70 hover:text-white flex items-center space-x-2 px-4"
            title="复制全部"
          >
            <Copy size={18} />
            <span className="hidden sm:inline text-sm">复制全部</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/70 hover:text-white flex items-center space-x-2 px-4"
            title="下载为 .txt"
          >
            <Download size={18} />
            <span className="hidden sm:inline text-sm">下载</span>
          </button>
          <button
            onClick={handleClear}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all text-red-400 hover:text-red-300 flex items-center space-x-2 px-4"
            title="清空"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline text-sm">清空</span>
          </button>
        </div>
      </div>

      <div className="flex-1 relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full bg-black/30 border border-white/10 rounded-2xl p-6 text-white/90 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all placeholder:text-white/10"
          placeholder="在此输入或粘贴您的文字草稿... 内容会自动保存到本地。"
          spellCheck={false}
        />
        
        <div className="absolute bottom-4 right-6 flex items-center space-x-6 text-white/30 text-xs font-mono bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
          <div className="flex items-center">
            <Type size={12} className="mr-1.5" />
            <span>{stats.chars} 字符</span>
          </div>
          <div className="flex items-center">
            <AlignLeft size={12} className="mr-1.5" />
            <span>{stats.words} 单词</span>
          </div>
          <div className="flex items-center">
            <Hash size={12} className="mr-1.5" />
            <span>{stats.lines} 行</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-white/20 text-[10px] uppercase tracking-widest text-center">
        内容实时保存至浏览器本地存储 (LocalStorage)
      </div>
    </div>
  );
};

export default Scratchpad;
