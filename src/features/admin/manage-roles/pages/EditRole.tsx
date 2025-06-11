import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoleById, updateRole } from "../services/roleService";
import { z } from "zod";
import { toast } from "sonner";
import { Form, Input, Button, Spin, Typography, Alert, Space } from "antd";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;

const schema = z.object({
  id: z.string(),
  roleName: z.string().min(2, "Tên vai trò phải có ít nhất 2 ký tự"),
});

type EditRoleFormData = z.infer<typeof schema>;

export const EditRolePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm<EditRoleFormData>();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!id) {
          setError("Không tìm thấy ID vai trò");
          return;
        }
        const role = await getRoleById(id);
        form.setFieldsValue({
          id: role.id,
          roleName: role.roleName,
        });
      } catch {
        setError("Không thể tải vai trò");
        toast.error("Không thể tải vai trò.");
        navigate("/admin/roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id, navigate, form]);

  const onFinish = async (values: EditRoleFormData) => {
    try {
      const validatedData = schema.parse(values);
      await updateRole(validatedData);
      toast.success("Cập nhật vai trò thành công!");
      navigate("/admin/roles");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật vai trò thất bại.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" tip="Đang tải..." />
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

  return (
    <div style={{ padding: "20px" }}>
      <Space align="center" style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Title level={3} style={{ margin: 0 }}>
          Chỉnh sửa vai trò
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/roles")}
        >
          Quay lại
        </Button>
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ id: id ?? "" }}
      >
        <Form.Item
          name="id"
          hidden
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="roleName"
          label="Tên vai trò"
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                try {
                  schema.parse({ id: id ?? "", roleName: value });
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    error instanceof z.ZodError
                      ? error.errors[0].message
                      : "Lỗi xác thực"
                  );
                }
              },
            },
          ]}
        >
          <Input placeholder="Nhập tên vai trò" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={form.isFieldsValidating()}
            block
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};