
import React, { useState } from 'react';

const BaseConverter: React.FC = () => {
  const [value, setValue] = useState('255');
  const [fromBase, setFromBase] = useState(10);

  const bases = [
    { name: 'Binary', value: 2 },
    { name: 'Octal', value: 8 },
    { name: 'Decimal', value: 10 },
    { name: 'Hexadecimal', value: 16 },
    { name: 'Base 32', value: 32 },
    { name: 'Base 36', value: 36 },
  ];

  const getConversions = () => {
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return [];
      
      return bases.map(b => ({
        ...b,
        result: decimal.toString(b.value).toUpperCase()
      }));
    } catch {
      return [];
    }
  };

  const results = getConversions();

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-2">🔢</span> Base Converter
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-white/40 uppercase">Input Value</label>
          <div className="flex space-x-2">
             <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xl"
              placeholder="Enter value..."
            />
            <select
              value={fromBase}
              onChange={(e) => setFromBase(parseInt(e.target.value))}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none"
            >
              {bases.map(b => (
                <option key={b.value} value={b.value}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.length > 0 ? results.map((res) => (
          <div key={res.value} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col group hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-semibold text-purple-400">{res.name} (Base {res.value})</span>
               <button 
                 onClick={() => navigator.clipboard.writeText(res.result)}
                 className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"
               >
                 📋
               </button>
            </div>
            <div className="font-mono text-lg break-all">{res.result}</div>
          </div>
        )) : (
          <div className="col-span-2 text-center py-12 text-white/30 italic">
            Enter a valid number to see conversions
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseConverter;
