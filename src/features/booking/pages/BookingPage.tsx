// pages/BookingPage.tsx
import { useState } from 'react';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookingForm } from '../components/BookingForm';
import { LocationSelector } from '../components/LocationSelector';
import { ServiceSelector } from '../components/ServiceSelector';
import { TimeSlotPicker } from '../components/TimeSlotPicker';

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string, providerId: string) => {
    setSelectedService(serviceId);
    setSelectedProvider(providerId);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Đặt Lịch Dịch Vụ
          </h1>
          <p className="text-gray-600 text-lg">
            Chọn thời gian và dịch vụ phù hợp với bạn
          </p>
        </div>

        {/* Booking Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-3xl">
              <div className="flex-1">
                <div className={`relative flex flex-col items-center ${selectedService ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${selectedService ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    1
                  </div>
                  <span className="text-sm font-medium">Chọn dịch vụ</span>
                </div>
              </div>
              <div className={`flex-grow h-0.5 transition-colors duration-300 ${selectedService ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className="flex-1">
                <div className={`relative flex flex-col items-center ${selectedDate ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${selectedDate ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    2
                  </div>
                  <span className="text-sm font-medium">Chọn ngày</span>
                </div>
              </div>
              <div className={`flex-grow h-0.5 transition-colors duration-300 ${selectedDate ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className="flex-1">
                <div className={`relative flex flex-col items-center ${selectedTimeSlot ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${selectedTimeSlot ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    3
                  </div>
                  <span className="text-sm font-medium">Chọn giờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chọn Dịch Vụ</h2>
              <ServiceSelector selectedService={selectedService} onServiceSelect={handleServiceSelect} />
            </div>

            {selectedProvider && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chọn Chi Nhánh</h2>
                <LocationSelector
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  providerId={selectedProvider}
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {selectedProvider && selectedLocation && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chọn Ngày</h2>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  providerId={selectedProvider}
                  locationId={selectedLocation}
                />
              </div>
            )}

            {selectedProvider && selectedLocation && selectedDate && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chọn Giờ</h2>
                <TimeSlotPicker
                  date={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={setSelectedTimeSlot}
                  providerId={selectedProvider}
                  locationId={selectedLocation}
                />
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Thông Tin Đặt Lịch</h2>
          <BookingForm
            date={selectedDate}
            timeSlot={selectedTimeSlot}
            service={selectedService}
            providerId={selectedProvider}
            locationId={selectedLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;