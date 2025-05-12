// src/features/booking/components/BookingCalendar.tsx
import { useState } from 'react';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  providerId: string;
  locationId: string;
}

export const BookingCalendar = ({ selectedDate, onDateSelect }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Lấy số ngày trong tháng
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Lấy ngày đầu tiên của tháng (0 = Chủ nhật, 1 = Thứ hai, ...)
  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Tạo mảng các ngày để hiển thị
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(month, year);
    const firstDay = firstDayOfMonth(month, year);

    const days: (number | null)[] = [];
    // Thêm các ô trống trước ngày đầu tiên của tháng
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Thêm các ngày trong tháng
    for (let day = 1; day <= totalDays; day++) {
      days.push(day);
    }
    return days;
  };

  const days = generateCalendarDays();

  // Chuyển tháng trước
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  // Chuyển tháng sau
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Xử lý chọn ngày
  const handleDayClick = (day: number | null) => {
    if (day) {
      const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateSelect(selected);
    }
  };

  // Kiểm tra ngày có được chọn hay không
  const isSelectedDay = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Điều hướng tháng */}
      <div className="flex items-center justify-between">
        <button onClick={handlePrevMonth} className="p-2 bg-gray-200 rounded-lg">
          &lt;
        </button>
        <span className="text-lg font-semibold">
          {currentMonth.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={handleNextMonth} className="p-2 bg-gray-200 rounded-lg">
          &gt;
        </button>
      </div>

      {/* Tiêu đề các ngày trong tuần */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
        <div>CN</div>
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div>T7</div>
      </div>

      {/* Lưới các ngày */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            disabled={!day}
            className={`p-3 rounded-lg text-center ${
              day
                ? isSelectedDay(day)
                  ? 'bg-blue-100 border-blue-500 border-2'
                  : 'bg-gray-100 hover:bg-gray-200'
                : 'bg-transparent'
            }`}
          >
            {day || ''}
          </button>
        ))}
      </div>
    </div>
  );
};