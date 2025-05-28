import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRankById } from "@/features/admin/manage-ranks/services/rankService";
import { Rank } from "@/features/admin/manage-ranks/types/rank";
import { Alert, Button, Spin, Descriptions, Card, Space, Typography } from "antd";
import { LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const DetailRankPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rank, setRank] = useState<Rank | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRankById(id)
        .then((res) => {
          setRank(res);
        })
        .catch(() => {
          setRank(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <Spin indicator={<LoadingOutlined spin />} fullscreen />;
  }
  if (!rank) {
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

      <Title level={3}>Chi tiết vai trò: {rank.name}</Title>

      <Card>
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          labelStyle={{ fontWeight: "bold", width: "200px" }}
        >
          <Descriptions.Item label="ID">{rank.id}</Descriptions.Item>
          <Descriptions.Item label="Tên vai trò">{rank.name}</Descriptions.Item>
          <Descriptions.Item label="Mô tả vai trò">{rank.description}</Descriptions.Item>
          <Descriptions.Item label="Giảm (%)">{rank.discountPercent}</Descriptions.Item>
          <Descriptions.Item label="Điểm">{rank.minPoints}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};
