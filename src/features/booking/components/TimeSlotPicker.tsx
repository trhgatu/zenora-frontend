// src/features/booking/components/TimeSlotPicker.tsx
interface TimeSlotPickerProps {
  date: Date;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (timeSlot: string) => void;
  providerId: string;
  locationId: string;
}

export const TimeSlotPicker = ({ selectedTimeSlot, onTimeSlotSelect }: TimeSlotPickerProps) => {
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];

  return (
    <div className="grid grid-cols-3 gap-4">
      {timeSlots.map((slot) => (
        <button
          key={slot}
          onClick={() => onTimeSlotSelect(slot)}
          className={`p-4 rounded-lg ${
            selectedTimeSlot === slot ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'
          } border-2`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};