import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById } from "@/features/admin/manage-categories/services/categoryService";
import { ServiceCategory } from "@/types/category";
import { Card, Typography, Image, Tag, Spin, Alert, Row, Col } from "antd";

const { Title, Text } = Typography;

export const DetailCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError("Không tìm thấy ID danh mục");
        setLoading(false);
        return;
      }

      try {
        const res = await getCategoryById(id);
        setCategory(res.data); // Giả sử API trả về response.data chứa ServiceCategory
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        setError("Không thể tải thông tin danh mục");
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  if (!category) {
    return (
      <Alert
        message="Không tìm thấy"
        description="Không tìm thấy danh mục với ID này."
        type="warning"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết danh mục: {category.categoryName}
          </Title>
        }
        style={{ margin: "0 auto" }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>ID: </Text>
            <Text>{category.id}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Tên danh mục: </Text>
            <Text>{category.categoryName}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Icon: </Text>
            {category.iconUrl ? (
              <Image
                src={category.iconUrl}
                alt={category.categoryName}
                width={64}
                height={64}
                style={{ objectFit: "cover" }}
                fallback="https://via.placeholder.com/64?text=No+Image"
              />
            ) : (
              <Text type="secondary">Không có icon</Text>
            )}
          </Col>
          <Col span={24}>
            <Text strong>Trạng thái: </Text>
            <Tag color={category.isActive ? "green" : "red"}>
              {category.isActive ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </Col>
          <Col span={24}>
            <Text strong>Ngày tạo: </Text>
            <Text>
              {new Date(category.createdTime).toLocaleString("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </Col>
          <Col span={24}>
            <Text strong>Ngày cập nhật: </Text>
            <Text>
              {new Date(category.lastUpdatedTime).toLocaleString("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
