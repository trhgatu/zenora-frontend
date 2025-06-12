import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Spin, Button, Typography, Tag, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { fetchWorkingHourById } from "@/features/provider/manage-working-hours/services/workingHourApi";
import { WorkingHour, ErrorResponse } from "../types/workingHour.types";
import { AxiosError } from "axios";
import { useAppSelector } from "@/hooks";

const { Title } = Typography;

const dayOfWeekMap: Record<number, string> = {
  0: "Chủ Nhật",
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
};

export const WorkingHourDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  const [workingHour, setWorkingHour] = useState<WorkingHour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !token) return;

      setLoading(true);
      try {
        const data = await fetchWorkingHourById(token, id);
        setWorkingHour(data);
      } catch (error: unknown) {
        const err = error as AxiosError<ErrorResponse>;
        const msg = err.response?.data?.message || "Không thể tải thông tin giờ làm việc.";
        message.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  return (
    <div className="p-6">
      <Card bordered className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Title level={3} className="!mb-0">Chi tiết giờ làm việc</Title>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>

        <Spin spinning={loading}>
          {workingHour && (
            <Descriptions bordered column={1} labelStyle={{ fontWeight: 600 }}>
              <Descriptions.Item label="Ngày làm việc">
                {dayOfWeekMap[workingHour.dayOfWeek]}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ mở cửa">
                {workingHour.openingTime}
              </Descriptions.Item>
              <Descriptions.Item label="Giờ đóng cửa">
                {workingHour.closingTime}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái làm việc">
                <Tag color={workingHour.isWorking ? "green" : "red"}>
                  {workingHour.isWorking ? "Có làm việc" : "Nghỉ"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="ID Chi nhánh spa">
                {workingHour.spaBranchLocationId}
              </Descriptions.Item>
              <Descriptions.Item label="ID Nhà cung cấp">
                {workingHour.providerId}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Spin>
      </Card>
    </div>
  );
};

