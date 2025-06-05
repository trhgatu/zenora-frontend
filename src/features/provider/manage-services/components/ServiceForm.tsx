import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ServiceCategory, ServiceFormData } from '../types/service.types';

interface ServiceFormProps {
  formData: ServiceFormData;
  setFormData: (data: ServiceFormData) => void;
  categories: ServiceCategory[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const ServiceForm = ({
  formData,
  setFormData,
  categories,
  loading,
  onSubmit,
  onCancel,
  isEditMode = false,
}: ServiceFormProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{isEditMode ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="category">Danh mục dịch vụ</Label>
          {loading ? (
            <p className="text-gray-600">Đang tải danh mục dịch vụ...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-600">Không có danh mục dịch vụ nào. Vui lòng liên hệ quản trị viên để tạo danh mục.</p>
          ) : (
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <Label htmlFor="serviceName">Tên dịch vụ</Label>
          <Input
            id="serviceName"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            placeholder="Nhập tên dịch vụ"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả dịch vụ"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Đơn giá (VNĐ)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Nhập đơn giá"
            required
            min="1"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="duration">Thời gian (phút)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="Nhập thời gian"
            required
            min="1"
            step="1"
          />
        </div>
        {isEditMode && (
          <div>
            <Label htmlFor="isAvailable">Trạng thái</Label>
            <Checkbox
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: !!checked })}
            />
            <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-600">
              Có sẵn
            </label>
          </div>
        )}
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading || categories.length === 0}>
            {loading ? (isEditMode ? 'Đang cập nhật...' : 'Đang tạo...') : isEditMode ? 'Cập nhật' : 'Tạo dịch vụ'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;