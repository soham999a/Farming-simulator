import Header from '../components/Header';
import FieldCard from '../components/FieldCard';
import { useCrops } from '../hooks/useCrops';

export default function Dashboard() {
  const { farm, loading, error, plantCrop, harvestCrop, buyField, getFieldStatus } = useCrops();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-bold">Error: {error}</div>;

  const growingCrops = farm.fields.filter(f => f.cropType && getFieldStatus(f).status === 'Growing').length;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Header money={farm.money} fieldsCount={farm.fields.length} growingCrops={growingCrops} />
      <div className="grid grid-cols-2 gap-4 mt-8">
        {farm.fields.map(field => (
          <FieldCard
            key={field.fieldId}
            field={field}
            getFieldStatus={getFieldStatus}
            plantCrop={plantCrop}
            harvestCrop={harvestCrop}
          />
        ))}
      </div>
      <button
        className="mt-8 bg-purple-600 text-white px-4 py-2 rounded shadow"
        onClick={buyField}
      >
        Buy New Field
      </button>
    </div>
  );
} 