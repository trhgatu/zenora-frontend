import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appointmentService } from "../services/appointmentService";
import AppointmentDetails from "../components/AppointmentDetails";
import { Appointment } from "../types/appointmentTypes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const ShowAppointmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) {
        toast.error("Không tìm thấy ID lịch hẹn.");
        navigate("/provider/appointments");
        return;
      }
      setLoading(true);
      try {
        const data = await appointmentService.getAppointmentById(id);
        setAppointment(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải chi tiết lịch hẹn.");
        navigate("/provider/appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <AppointmentDetails appointment={appointment} />
      <Button className="mt-4" onClick={() => navigate("/provider/appointments")} variant="outline">
        Quay lại
      </Button>
    </div>
  );
};