import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Descriptions,
  Card,
  Button,
  Alert,
  Typography,
  Spin,
  Space
} from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { getRoleById } from "@/features/admin/manage-roles/services/roleService";
import { Role } from "@/features/admin/manage-roles/types/role";

const { Title } = Typography;

export const DetailRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getRoleById(id)
        .then((res) => {
          setRole(res);
          setError(null);
        })
        .catch(() => {
          setRole(null);
          setError("Không thể tải thông tin vai trò.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Không có";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  if (!role) {
    return (
      <div className="p-6">
        <Alert
          message="Không tìm thấy"
          description="Không tìm thấy vai trò."
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate("/admin/roles")} type="primary">
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/roles")}>
          Quay lại
        </Button>
      </Space>

      <Title level={3}>Chi tiết vai trò: {role.roleName}</Title>

      <Card>
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          labelStyle={{ fontWeight: "bold", width: "200px" }}
        >
          <Descriptions.Item label="ID">{role.id}</Descriptions.Item>
          <Descriptions.Item label="Tên vai trò">{role.roleName}</Descriptions.Item>
          <Descriptions.Item label="Tên chuẩn hóa">{role.normalizedName}</Descriptions.Item>
          <Descriptions.Item label="Thời gian tạo">{formatDate(role.createdTime)}</Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">{formatDate(role.lastUpdatedTime)}</Descriptions.Item>
          <Descriptions.Item label="Đã xóa vào">{formatDate(role.deletedTime)}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
