// src/features/home/components/ServiceSection.tsx
import { useEffect, useState } from "react";
import { fetchServices } from "@/services/service"; // hoặc: "../../services/service"
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ServiceSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices({ pageNumber: 1, pageSize: 6 })
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold py-2 text-gradient">Dịch vụ phổ biến</h2>
      <div
            className="h-2 bg-gradient-to-r from-blue-300 to-blue-600 w-24 md:w-40 mt-1 origin-left rounded-r-full"
          />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))
          : services.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <img
                  src={s.imageUrl || "https://via.placeholder.com/300x200?text=Dich+vu"}
                  alt={s.serviceName}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{s.serviceName}</h3>
                  <p className="text-gray-500 text-sm">{s.description}</p>
                  <p className="text-blue-600 font-bold mt-2">{s.price.toLocaleString()} ₫</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default ServiceSection;
