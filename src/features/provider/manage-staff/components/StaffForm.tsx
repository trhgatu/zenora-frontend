import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StaffFormData, Branch, ServiceCategory } from '../types/staff.types';

interface StaffFormProps {
  branches: Branch[];
  serviceCategories: ServiceCategory[];
  staffData: StaffFormData;
  setStaffData: (data: StaffFormData) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onBranchChange: (branchId: string) => void;
}

const StaffForm = ({
  branches,
  serviceCategories,
  staffData,
  setStaffData,
  handleSubmit,
  loading,
  isEditing,
  onCancel,
  onBranchChange,
}: StaffFormProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStaffData({
      ...staffData,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value,
    });

    if (name === 'branchId') {
      onBranchChange(value);
    }
  };

  const handleServiceCategoryChange = (categoryId: string) => {
    setStaffData({
      ...staffData,
      serviceCategoryIds: staffData.serviceCategoryIds.includes(categoryId)
        ? staffData.serviceCategoryIds.filter(id => id !== categoryId)
        : [...staffData.serviceCategoryIds, categoryId],
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="branchId">Chi nhánh</Label>
          <select
            id="branchId"
            name="branchId"
            value={staffData.branchId}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn chi nhánh</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.branchName}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="fullName">Họ tên</Label>
          <Input
            id="fullName"
            name="fullName"
            value={staffData.fullName}
            onChange={handleInputChange}
            placeholder="Nhập họ tên nhân viên"
            required
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={staffData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={staffData.email}
            onChange={handleInputChange}
            placeholder="Nhập email"
            required
          />
        </div>
        <div>
          <Label htmlFor="avatarUrl">URL ảnh đại diện</Label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            value={staffData.avatarUrl}
            onChange={handleInputChange}
            placeholder="Nhập URL ảnh đại diện (nếu có)"
          />
          {staffData.avatarUrl && (
            <div className="mt-2">
              <img
                src={staffData.avatarUrl}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/128')}
              />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            name="gender"
            value={staffData.gender}
            onChange={handleInputChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <Label htmlFor="yearsOfExperience">Số năm kinh nghiệm</Label>
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            value={staffData.yearsOfExperience}
            onChange={handleInputChange}
            placeholder="Nhập số năm kinh nghiệm"
            min="0"
            required
          />
        </div>
        <div>
          <Label>Danh mục dịch vụ</Label>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={staffData.serviceCategoryIds.includes(category.id)}
                  onCheckedChange={() => handleServiceCategoryChange(category.id)}
                />
                <Label htmlFor={category.id}>{category.categoryName}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {isEditing ? 'Cập nhật' : 'Thêm nhân viên'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;