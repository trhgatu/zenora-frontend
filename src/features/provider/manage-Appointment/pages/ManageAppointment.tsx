import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointmentService } from "../services/appointmentService";
import { AppointmentTable } from "../components/AppointmentTable";
import { Appointment, PaginatedResponse } from "../types/appointmentTypes";
import { toast } from "sonner";

export const ManageAppointmentPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<PaginatedResponse<Appointment>>({
    data: { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize: 10 },
    statusCode: 200,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await appointmentService.getAppointments(pageIndex + 1, 10);
        console.log('ManageAppointmentPage: API response:', data); // Log để debug
        setAppointments(data);
        if (data.data.items.length === 0 && pageIndex === 0) {
          toast.info('Không có lịch hẹn nào.');
        }
      } catch (error) {
        const errorMessage = (error as Error).message || 'Lỗi khi tải danh sách lịch hẹn';
        console.error('ManageAppointmentPage: Error:', error);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [pageIndex]);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setAppointments((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        items: prev.data.items.map((item) =>
          item.id === id ? { ...item, bookingStatus: newStatus } : item
        ),
      },
    }));
  };

  if (loading) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý lịch hẹn</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentTable
            data={appointments.data.items}
            pagination={{
              pageIndex,
              pageCount: appointments.data.totalPages,
              onPageChange: (index) => setPageIndex(index),
            }}
            onStatusUpdate={handleStatusUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAppointmentPage;