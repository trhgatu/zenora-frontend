import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks";
import { appointmentService } from "../services/appointmentService";
import { Appointment, AppointmentServiceData, Branch, Service, Promotion, PromotionAdmin } from "../types/appointmentTypes";
import { useNavigate } from "react-router-dom";

interface AppointmentFormProps {
  onSubmit: (data: Appointment) => Promise<void>;
  initialData?: Appointment;
}

const AppointmentForm = ({ onSubmit, initialData }: AppointmentFormProps) => {
  const [formData, setFormData] = useState<Appointment>(
    initialData || {
      appointmentDate: new Date().toISOString(),
      startTime: '',
      spaBranchLocationId: '',
      notes: '',
      services: [{ serviceId: '', quantity: 1 }],
      paymentMethod: '',
    }
  );
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [adminPromotions, setAdminPromotions] = useState<PromotionAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isInitialized } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const providerId = user?._id;
        console.log('AppointmentForm: Provider ID:', providerId); // Log để debug
        if (!providerId) {
          throw new Error('Không tìm thấy ID nhà cung cấp. Vui lòng đăng nhập lại.');
        }
        const [branchesData, servicesData, promotionsData, adminPromotionsData] = await Promise.all([
          appointmentService.getProviderBranches(providerId),
          appointmentService.getProviderServices(providerId),
          appointmentService.getPromotions(),
          appointmentService.getAdminPromotions(),
        ]);
        console.log('AppointmentForm: Branches:', branchesData); // Log để debug
        console.log('AppointmentForm: Services:', servicesData);
        console.log('AppointmentForm: Promotions:', promotionsData);
        console.log('AppointmentForm: Admin Promotions:', adminPromotionsData);
        setBranches(branchesData);
        setServices(servicesData);
        setPromotions(promotionsData);
        setAdminPromotions(adminPromotionsData);
        if (branchesData.length === 0) {
          setError('Không tìm thấy chi nhánh nào. Vui lòng thêm chi nhánh trước khi tạo lịch hẹn.');
          toast.info('Vui lòng thêm chi nhánh để tiếp tục.');
        }
      } catch (error) {
        const errorMessage = (error as Error).message || 'Lỗi khi tải dữ liệu chi nhánh/dịch vụ/khuyến mãi';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('AppointmentForm: Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id, isInitialized]);

  const handleServiceChange = (index: number, field: keyof AppointmentServiceData, value: string | number) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { serviceId: '', quantity: 1 }],
    });
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      console.log('AppointmentForm: Submitting data:', formData); // Log để debug
      await onSubmit(formData);
      toast.success('Tạo lịch hẹn thành công!');
    } catch (error) {
      const errorMessage = (error as Error).message || 'Lỗi khi tạo lịch hẹn';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('AppointmentForm: Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return <div className="text-center text-gray-500">Đang tải trạng thái đăng nhập...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
        <Button
          className="mt-4"
          onClick={() => navigate('/provider/spa-location')}
          variant="outline"
        >
          Thêm chi nhánh
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="appointmentDate">Ngày hẹn</Label>
          <Input
            id="appointmentDate"
            type="datetime-local"
            value={formData.appointmentDate.slice(0, 16)}
            onChange={(e) => setFormData({ ...formData, appointmentDate: new Date(e.target.value).toISOString() })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="startTime">Giờ bắt đầu</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="spaBranchLocationId">Chi nhánh Spa</Label>
          <Select
            value={formData.spaBranchLocationId}
            onValueChange={(value) => setFormData({ ...formData, spaBranchLocationId: value })}
            disabled={loading || branches.length === 0}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder={branches.length === 0 ? "Không có chi nhánh" : "Chọn chi nhánh"} />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            disabled={loading}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phương thức" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Tiền mặt</SelectItem>
              <SelectItem value="Card">Thẻ</SelectItem>
              <SelectItem value="Online">Thanh toán online</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Ghi chú</Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Nhập ghi chú (nếu có)"
            disabled={loading}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Dịch vụ</Label>
          {formData.services.map((service, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              <Select
                value={service.serviceId}
                onValueChange={(value) => handleServiceChange(index, 'serviceId', value)}
                disabled={loading || services.length === 0}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={services.length === 0 ? "Không có dịch vụ" : "Chọn dịch vụ"} />
                </SelectTrigger>
                <SelectContent>
                  {services.map((svc) => (
                    <SelectItem key={svc.id} value={svc.id}>
                      {svc.serviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Số lượng"
                value={service.quantity}
                onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value))}
                min={1}
                required
                disabled={loading}
              />
              <Button type="button" variant="destructive" onClick={() => removeService(index)} disabled={loading}>
                Xóa
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addService} className="mt-2" disabled={loading}>
            Thêm dịch vụ
          </Button>
        </div>
        {promotions.length > 0 && (
          <div>
            <Label htmlFor="promotionId">Khuyến mãi</Label>
            <Select
              value={formData.promotionId || undefined}
              onValueChange={(value) => setFormData({ ...formData, promotionId: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khuyến mãi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có</SelectItem>
                {promotions.map((promo) => (
                  <SelectItem key={promo.id} value={promo.id}>
                    {promo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {adminPromotions.length > 0 && (
          <div>
            <Label htmlFor="promotionAdminId">Khuyến mãi admin</Label>
            <Select
              value={formData.promotionAdminId || undefined}
              onValueChange={(value) => setFormData({ ...formData, promotionAdminId: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khuyến mãi admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có</SelectItem>
                {adminPromotions.map((promo) => (
                  <SelectItem key={promo.id} value={promo.id}>
                    {promo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Button type="submit" disabled={loading || branches.length === 0}>
        {loading ? 'Đang xử lý...' : 'Tạo lịch hẹn'}
      </Button>
    </form>
  );
};

export default AppointmentForm;