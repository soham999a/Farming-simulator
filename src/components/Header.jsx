export default function Header({ money, fieldsCount, growingCrops }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow">
      <div>💰 <span className="font-bold">{money}</span></div>
      <div>🌾 Fields: <span className="font-bold">{fieldsCount}</span></div>
      <div>🌱 Growing: <span className="font-bold">{growingCrops}</span></div>
    </div>
  );
} 