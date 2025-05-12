// src/features/booking/components/BookingForm.tsx
interface BookingFormProps {
  date: Date | null;
  timeSlot: string | null;
  service: string | null;
  providerId: string | null;
  locationId: string | null;
}

export const BookingForm = ({ date, timeSlot, service, providerId, locationId }: BookingFormProps) => {
  return (
    <div className="space-y-4">
      <p><strong>Dịch vụ:</strong> {service || 'Chưa chọn'}</p>
      <p><strong>Nhà cung cấp:</strong> {providerId || 'Chưa chọn'}</p>
      <p><strong>Chi nhánh:</strong> {locationId || 'Chưa chọn'}</p>
      <p><strong>Ngày:</strong> {date ? date.toLocaleDateString('vi-VN') : 'Chưa chọn'}</p>
      <p><strong>Giờ:</strong> {timeSlot || 'Chưa chọn'}</p>
      <button className="w-full p-4 bg-blue-600 text-white rounded-lg">Xác nhận đặt lịch</button>
    </div>
  );
};