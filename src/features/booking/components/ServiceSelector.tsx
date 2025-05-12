// src/features/booking/components/ServiceSelector.tsx
interface ServiceSelectorProps {
  selectedService: string | null;
  onServiceSelect: (serviceId: string, providerId: string) => void;
}

export const ServiceSelector = ({ selectedService, onServiceSelect }: ServiceSelectorProps) => {
  const services = [
    { id: 'service1', name: 'Cắt tóc nam', providerId: 'provider1' },
    { id: 'service2', name: 'Gội đầu thư giãn', providerId: 'provider2' },
  ];

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onServiceSelect(service.id, service.providerId)}
          className={`w-full p-4 rounded-lg text-left ${
            selectedService === service.id ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'
          } border-2`}
        >
          {service.name}
        </button>
      ))}
    </div>
  );
};