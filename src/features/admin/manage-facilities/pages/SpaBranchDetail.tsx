import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Typography,
  Alert,
  Spin,
} from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { getSpaBranchById } from "@/features/admin/manage-facilities/services/facilityServices";

const { Title, Text } = Typography;

// Interface cho chi nhánh spa
interface SpaBranch {
  id: string;
  branchName: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  provinceId: string;
  districtId: string;
  provinceName: string;
  districtName: string;
  workingHours: Array<{
    id: string;
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
    isWorking: boolean;
    providerId: string | null;
    spaBranchLocationId: string;
    branchName: string | null;
  }>;
}

export const SpaBranchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<SpaBranch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranch = async () => {
      if (!id) {
        setError("ID không hợp lệ.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getSpaBranchById(id);
        console.log("Branch Detail Response:", res); // Debug response
        setBranch(res);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch branch detail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [id]);

  const formatTime = (timeString: string) => timeString.slice(0, 5); // Lấy HH:MM

  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} fullscreen />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="p-6">
        <Alert
          message="Không tìm thấy"
          description="Không tìm thấy thông tin chi nhánh."
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate("/admin/facilities")} type="primary">
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Space className="mb-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/facilities")}
          >
            Quay lại
          </Button>
        </Space>

        <Title level={2} className="mb-4">
          Chi tiết chi nhánh: {branch.branchName}
        </Title>

        <Card>
          <Descriptions
            bordered
            column={1} // Đặt số cột là 1 để tất cả mục trên cùng một dòng
            labelStyle={{ fontWeight: "bold", width: "200px" }}
            contentStyle={{ padding: "8px" }} // Thêm padding để nội dung gọn gàng hơn
          >
            <Descriptions.Item label="Tên chi nhánh">
              {branch.branchName || <Text type="secondary">(Chưa có tên)</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {`${branch.street}, ${branch.districtName}, ${branch.provinceName}`}
            </Descriptions.Item>
            <Descriptions.Item label="Mã bưu chính">
              {branch.postalCode || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành">
              {branch.provinceName || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Quận/Huyện">
              {branch.districtName || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Giờ làm việc">
              {branch.workingHours.length > 0 ? (
                <Space wrap>
                  {branch.workingHours
                    .filter((wh) => wh.isWorking)
                    .map((wh) => (
                      <Tag key={wh.id}>
                        {["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][wh.dayOfWeek]}: {formatTime(wh.openingTime)} - {formatTime(wh.closingTime)}
                      </Tag>
                    ))}
                </Space>
              ) : (
                <Text type="secondary">Chưa có giờ làm việc</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};