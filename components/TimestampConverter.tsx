
import React, { useState, useEffect } from 'react';

const TimestampConverter: React.FC = () => {
  const [input, setInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [unit, setUnit] = useState<'s' | 'ms'>('s');
  
  const getFormattedDate = (val: string) => {
    try {
      const num = parseInt(val);
      if (isNaN(num)) return null;
      const date = new Date(unit === 's' ? num * 1000 : num);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch {
      return null;
    }
  };

  const date = getFormattedDate(input);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-2">🕒</span> Timestamp Converter
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-white/50 uppercase tracking-wider">
            Enter Unix Timestamp
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-mono"
              placeholder="e.g. 1672531200"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 's' | 'ms')}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              <option value="s">Seconds (s)</option>
              <option value="ms">Milliseconds (ms)</option>
            </select>
            <button 
              onClick={() => setInput(unit === 's' ? Math.floor(Date.now()/1000).toString() : Date.now().toString())}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors font-medium"
            >
              Now
            </button>
          </div>
        </div>
      </div>

      {date ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Local Time', value: date.toLocaleString() },
            { label: 'ISO 8601', value: date.toISOString() },
            { label: 'UTC Time', value: date.toUTCString() },
            { label: 'Date String', value: date.toDateString() },
            { label: 'Time String', value: date.toTimeString() },
            { label: 'Unix (Seconds)', value: Math.floor(date.getTime() / 1000).toString() }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between group">
              <span className="text-xs text-white/40 mb-1">{item.label}</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm break-all">{item.value}</span>
                <button 
                  onClick={() => copyToClipboard(item.value)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg"
                >
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white/5 border border-dashed border-white/20 rounded-2xl text-white/40">
          Invalid timestamp format. Please check your input.
        </div>
      )}
    </div>
  );
};

export default TimestampConverter;
