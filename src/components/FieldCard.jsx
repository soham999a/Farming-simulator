import { useState } from 'react';
import CropSelector from './CropSelector';

export default function FieldCard({ field, getFieldStatus, plantCrop, harvestCrop }) {
  const [selectedCrop, setSelectedCrop] = useState('');
  const status = getFieldStatus(field);

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center">
      <div className="text-lg font-bold mb-2">Field #{field.fieldId}</div>
      {status.status === 'Empty' && (
        <>
          <CropSelector value={selectedCrop} onChange={setSelectedCrop} />
          <button
            className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            disabled={!selectedCrop}
            onClick={() => plantCrop(field.fieldId, selectedCrop)}
          >
            Plant
          </button>
        </>
      )}
      {status.status === 'Growing' && (
        <>
          <div>🌱 {field.cropType}</div>
          <div className="w-full bg-gray-200 rounded h-2 mt-2">
            <div
              className="bg-yellow-400 h-2 rounded"
              style={{ width: `${100 - (status.timeLeft / status.crop.growTime) * 100}%` }}
            />
          </div>
          <div className="text-xs mt-1">{Math.ceil(status.timeLeft / 1000)}s left</div>
        </>
      )}
      {status.status === 'Ready' && (
        <>
          <div>🌾 {field.cropType} (Ready!)</div>
          <button
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => harvestCrop(field.fieldId)}
          >
            Harvest
          </button>
        </>
      )}
    </div>
  );
} 