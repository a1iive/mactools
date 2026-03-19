
import React, { useState, useEffect } from 'react';

const TimestampConverter: React.FC = () => {
  const [input, setInput] = useState<string>((Date.now() * 1000000).toString());
  const [unit, setUnit] = useState<'s' | 'ms' | 'us' | 'ns'>('ns');
  
  const getFormattedDate = (val: string) => {
    try {
      const num = parseInt(val);
      if (isNaN(num)) return null;
      let date: Date;
      if (unit === 's') {
        date = new Date(num * 1000);
      } else if (unit === 'ms') {
        date = new Date(num);
      } else if (unit === 'us') {
        // us (微秒) 转换为 ms (毫秒)
        date = new Date(Math.floor(num / 1000));
      } else {
        // ns (纳秒) 转换为 ms (毫秒)
        date = new Date(Math.floor(num / 1000000));
      }
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  };

  const date = getFormattedDate(input);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // 使用更现代的提示方式，避免 alert 阻塞
  };

  const handleNow = () => {
    const now = Date.now();
    if (unit === 's') {
      setInput(Math.floor(now / 1000).toString());
    } else if (unit === 'ms') {
      setInput(now.toString());
    } else if (unit === 'us') {
      setInput((now * 1000).toString());
    } else {
      setInput((now * 1000000).toString());
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-2">🕒</span> 时间戳转换器
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-white/50 uppercase tracking-wider">
            输入 Unix 时间戳
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-mono transition-all"
              placeholder="例如: 1672531200000"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 's' | 'ms' | 'us' | 'ns')}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none cursor-pointer hover:bg-black/50 transition-colors"
            >
              <option value="s">秒 (s)</option>
              <option value="ms">毫秒 (ms)</option>
              <option value="us">微秒 (us)</option>
              <option value="ns">纳秒 (ns)</option>
            </select>
            <button 
              onClick={handleNow}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-medium active:scale-95 shadow-lg shadow-blue-900/20"
            >
              现在
            </button>
          </div>
        </div>
      </div>

      {date ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: '本地时间 (Local)', value: date.toLocaleString() },
            { label: 'ISO 8601', value: date.toISOString() },
            { label: 'UTC 时间', value: date.toUTCString() },
            { label: '日期字符串', value: date.toDateString() },
            { label: '时间字符串', value: date.toTimeString() },
            { label: 'Unix 时间戳 (秒)', value: Math.floor(date.getTime() / 1000).toString() },
            { label: 'Unix 时间戳 (毫秒)', value: date.getTime().toString() },
            { label: 'Unix 时间戳 (微秒)', value: (date.getTime() * 1000).toString() },
            { label: 'Unix 时间戳 (纳秒)', value: (date.getTime() * 1000000).toString() }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-all cursor-default">
              <span className="text-xs text-white/40 mb-1 font-medium">{item.label}</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm break-all text-white/90">{item.value}</span>
                <button 
                  onClick={() => copyToClipboard(item.value)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/20 rounded-lg text-white/60 hover:text-white"
                  title="复制到剪贴板"
                >
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white/5 border border-dashed border-white/20 rounded-2xl text-white/40">
          时间戳格式无效，请检查输入。
        </div>
      )}
    </div>
  );
};

export default TimestampConverter;
