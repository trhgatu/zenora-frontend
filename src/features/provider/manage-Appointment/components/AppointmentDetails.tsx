import { Appointment } from "../types/appointmentTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment }) => {
  if (!appointment) {
    return <div className="text-center text-red-500">Không tìm thấy lịch hẹn.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết lịch hẹn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Khách hàng</Label>
          <p className="text-sm text-gray-600">{appointment.customerName || 'Khách vãng lai'}</p>
        </div>
        <div>
          <Label>Ngày hẹn</Label>
          <p className="text-sm text-gray-600">{new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</p>
        </div>
        <div>
          <Label>Giờ bắt đầu</Label>
          <p className="text-sm text-gray-600">{appointment.startTime || 'Không xác định'}</p>
        </div>
        <div>
          <Label>Chi nhánh</Label>
          <p className="text-sm text-gray-600">{appointment.branchName || appointment.spaBranchLocationId || 'Không xác định'}</p>
        </div>
        <div>
          <Label>Phương thức thanh toán</Label>
          <p className="text-sm text-gray-600">{appointment.paymentMethod || 'Không xác định'}</p>
        </div>
        <div>
          <Label>Trạng thái</Label>
          <p className="text-sm text-gray-600">{appointment.bookingStatus ? appointment.bookingStatus.replace('_', ' ').toUpperCase() : 'Không xác định'}</p>
        </div>
        <div>
          <Label>Ghi chú</Label>
          <p className="text-sm text-gray-600">{appointment.notes || 'Không có'}</p>
        </div>
        <div>
          <Label>Khuyến mãi</Label>
          <p className="text-sm text-gray-600">{appointment.promotionId || 'Không có'}</p>
        </div>
        <div>
          <Label>Khuyến mãi admin</Label>
          <p className="text-sm text-gray-600">{appointment.promotionAdminId || 'Không có'}</p>
        </div>
        <div>
          <Label>Dịch vụ</Label>
          {appointment.services && appointment.services.length > 0 ? (
            <ul className="list-disc pl-5">
              {appointment.services.map((service, index) => (
                <li key={index}>
                  {service.serviceName || service.serviceId}, Số lượng: {service.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">Không có dịch vụ</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentDetails;