import { crops } from '../constants/crops';

export default function CropSelector({ value, onChange }) {
  return (
    <select
      className="border rounded px-2 py-1"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>Select crop</option>
      {Object.entries(crops).map(([key, crop]) => (
        <option key={key} value={key}>{crop.name}</option>
      ))}
    </select>
  );
} 