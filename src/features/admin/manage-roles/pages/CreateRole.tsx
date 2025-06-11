import { useNavigate } from "react-router-dom";
import { createRole } from "../services/roleService";
import { z } from "zod";
import { toast } from "sonner";
import { Form, Input, Button, Typography, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const schema = z.object({
  roleName: z
    .string()
    .min(2, "Tên vai trò phải có ít nhất 2 ký tự")
    .max(50, "Tên vai trò không được vượt quá 50 ký tự"),
});

type CreateRoleFormData = z.infer<typeof schema>;

export const CreateRolePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateRoleFormData>();

  const onFinish = async (values: CreateRoleFormData) => {
    const toastId = toast.loading("Đang tạo vai trò...");
    try {
      const validatedData = schema.parse(values);
      await createRole(validatedData);
      toast.success("Tạo vai trò thành công!", { id: toastId });
      navigate("/admin/roles");
    } catch (error) {
      console.error("Lỗi khi tạo vai trò:", error);
      const errorMessage =
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Tạo vai trò thất bại.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div style={{ padding: "24px"}}>
      <Space align="center" style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Title level={3} style={{ margin: 0 }}>
          Tạo vai trò mới
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/roles")}
        >
          Quay lại
        </Button>
      </Space>

      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Vui lòng nhập tên vai trò mới (từ 2 đến 50 ký tự).
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="roleName"
          label="Tên vai trò"
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                try {
                  schema.parse({ roleName: value });
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
          <Input
            placeholder="Nhập tên vai trò"
            allowClear
            maxLength={50}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={form.isFieldsValidating()}
            block
            style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
          >
            Tạo vai trò
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};