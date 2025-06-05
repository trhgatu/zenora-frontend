import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkingHour } from '../types/workingHour.types';

interface WorkingHourFormProps {
  workingHourData: WorkingHour;
  setWorkingHourData: (data: WorkingHour) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  isEditing: boolean;
  onCancel: () => void;
  branches: { id: string; branchName: string }[];
}

const WorkingHourForm = ({
  workingHourData,
  setWorkingHourData,
  handleSubmit,
  loading,
  isEditing,
  onCancel,
  branches,
}: WorkingHourFormProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWorkingHourData({
      ...workingHourData,
      [name]: name === 'dayOfWeek' ? parseInt(value) : value,
    });
  };

  const handleCheckboxChange = () => {
    setWorkingHourData({
      ...workingHourData,
      isWorking: !workingHourData.isWorking,
    });
  };

  const daysOfWeek = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Chỉnh sửa giờ làm việc' : 'Thêm giờ làm việc mới'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="spaBranchLocationId">Chi nhánh</Label>
          <select
            id="spaBranchLocationId"
            name="spaBranchLocationId"
            value={workingHourData.spaBranchLocationId}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn chi nhánh</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="dayOfWeek">Ngày trong tuần</Label>
          <select
            id="dayOfWeek"
            name="dayOfWeek"
            value={workingHourData.dayOfWeek}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn ngày</option>
            {daysOfWeek.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="openingTime">Giờ mở cửa</Label>
          <Input
            id="openingTime"
            name="openingTime"
            type="time"
            value={workingHourData.openingTime}
            onChange={handleInputChange}
            placeholder="Nhập giờ mở cửa (HH:mm)"
            required
          />
        </div>
        <div>
          <Label htmlFor="closingTime">Giờ đóng cửa</Label>
          <Input
            id="closingTime"
            name="closingTime"
            type="time"
            value={workingHourData.closingTime}
            onChange={handleInputChange}
            placeholder="Nhập giờ đóng cửa (HH:mm)"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isWorking"
            checked={workingHourData.isWorking}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="isWorking">Có làm việc</Label>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {isEditing ? 'Cập nhật' : 'Thêm giờ làm việc'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WorkingHourForm;