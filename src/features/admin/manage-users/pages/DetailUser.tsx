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
import {
  ArrowLeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { getUserById } from "@/features/admin/manage-users/services/userServices";
import { User } from "@/features/admin/manage-users/types/user";

const { Title, Text } = Typography;

export const DetailUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getUserById(id)
        .then((res) => {
          setUser(res);
          setError(null);
        })
        .catch(() => {
          setUser(null);
          setError("Không thể tải thông tin người dùng. Vui lòng thử lại.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (date.getFullYear() === 1) return "Không xác định";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTag = (isActive: boolean) => (
    <Tag color={isActive ? "green" : "red"}>
      {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
    </Tag>
  );

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

  if (!user) {
    return (
      <div className="p-6">
        <Alert
          message="Không tìm thấy"
          description="Không tìm thấy thông tin người dùng."
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate("/admin/users")} type="primary">
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
            onClick={() => navigate("/admin/users")}
          >
            Quay lại
          </Button>
        </Space>

        <Title level={2} className="mb-4">
          Thông tin người dùng
        </Title>

        <Card>
          <Descriptions
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            labelStyle={{ fontWeight: "bold", width: "200px" }}
          >
            <Descriptions.Item label="Họ tên">
              {user.fullName || <Text type="secondary">(Không có tên)</Text>}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>

            <Descriptions.Item label="Số điện thoại">
              {user.phoneNumber || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Giới tính">
              {user.gender || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày sinh">
              {formatDate(user.dateOfBirth)}
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              {getStatusTag(user.isActive)}
            </Descriptions.Item>

            <Descriptions.Item label="Vai trò">
              {user.roleName}
            </Descriptions.Item>

            <Descriptions.Item label="Tỉnh/Thành">
              {user.provinceName || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Quận/Huyện">
              {user.districtName || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Địa chỉ chi tiết">
              {user.addressDetail || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Thời gian tạo">
              {formatDate(user.createdTime)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  );
};
