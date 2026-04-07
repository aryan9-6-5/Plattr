import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
};

const QuantitySelector = ({ value, min = 1, max = 99, onChange }: QuantitySelectorProps) => (
  <div className="inline-flex items-center gap-3 bg-white border border-[#D4E8DA] rounded-full px-1 py-1">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      className="w-8 h-8 rounded-full flex items-center justify-center text-[#2D6A4F] hover:bg-[#EEF8F1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="text-sm font-bold text-[#1B2D24] min-w-[24px] text-center">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      className="w-8 h-8 rounded-full flex items-center justify-center text-[#2D6A4F] hover:bg-[#EEF8F1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

export default QuantitySelector;
