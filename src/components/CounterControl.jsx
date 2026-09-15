import { Minus, Plus } from 'lucide-react';

export default function CounterControl({ label, value, step = 1, min = 0, onChange, input = false }) {
  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(value + step);

  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label={`Decrease ${label}`} onClick={decrease} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Minus size={18} /></button>
      {input ? (
        <input type="number" aria-label={label} value={value} onChange={event => onChange(Math.max(min, Number.parseInt(event.target.value, 10) || 0))} className="w-16 text-center bg-transparent font-bold text-[#8c2a2a] border-b border-[#d2c2a5] focus:outline-none" />
      ) : (
        <span className="text-xl font-bold text-[#8c2a2a] w-8 text-center">{value}</span>
      )}
      <button type="button" aria-label={`Increase ${label}`} onClick={increase} className="p-1 bg-[#e8e0cc] rounded text-[#5c4a3d] hover:bg-[#d2c2a5]"><Plus size={18} /></button>
    </div>
  );
}
