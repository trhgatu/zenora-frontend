// src/features/booking/components/LocationSelector.tsx
interface LocationSelectorProps {
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
  providerId: string;
}

export const LocationSelector = ({ selectedLocation, onLocationSelect }: LocationSelectorProps) => {
  const locations = [
    { id: 'location1', name: 'Chi nhánh Quận 1' },
    { id: 'location2', name: 'Chi nhánh Quận 7' },
  ];

  return (
    <div className="space-y-4">
      {locations.map((location) => (
        <button
          key={location.id}
          onClick={() => onLocationSelect(location.id)}
          className={`w-full p-4 rounded-lg text-left ${
            selectedLocation === location.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'
          } border-2`}
        >
          {location.name}
        </button>
      ))}
    </div>
  );
};