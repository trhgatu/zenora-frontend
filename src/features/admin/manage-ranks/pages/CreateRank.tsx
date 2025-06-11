import { useNavigate } from "react-router-dom";
import { createRank } from "@/features/admin/manage-ranks/services/rankService";
import { createRankSchema } from "@/features/admin/manage-ranks/validators/rankValidators";
import { z } from "zod";
import { toast } from "sonner";
import { Form, Input, Button, Typography, Space, InputNumber } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ROUTERS from "@/constants/router";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

type FormData = z.infer<typeof createRankSchema>;

export const CreateRankPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormData>();

  const onFinish = async (values: FormData) => {
    const toastId = toast.loading("Đang tạo rank...");
    try {
      const validatedData = createRankSchema.parse(values);
      await createRank(validatedData);
      toast.success("Tạo rank thành công!", { id: toastId });
      navigate(ROUTERS.ADMIN.rank.root);
    } catch (error) {
      console.error("Lỗi khi tạo rank:", error);
      const errorMessage =
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Tạo rank thất bại.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div style={{ padding: "24px"}}>
      <Space align="center" style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
        <Title level={3} style={{ margin: 0 }}>
          Tạo Rank mới
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(ROUTERS.ADMIN.rank.root)}
        >
          Quay lại
        </Button>
      </Space>

      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Vui lòng nhập thông tin rank mới (tên, điểm tối thiểu, phần trăm giảm giá, và mô tả nếu có).
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Tên Rank"
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                try {
                  createRankSchema.parse({ name: value, minPoints: 0, discountPercent: 0 });
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    error instanceof z.ZodError
                      ? error.errors.find(e => e.path[0] === "name")?.message
                      : "Lỗi xác thực"
                  );
                }
              },
            },
          ]}
        >
          <Input
            placeholder="Nhập tên rank"
            allowClear
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          name="minPoints"
          label="Điểm tối thiểu"
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                try {
                  createRankSchema.parse({ name: "temp", minPoints: value, discountPercent: 0 });
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    error instanceof z.ZodError
                      ? error.errors.find(e => e.path[0] === "minPoints")?.message
                      : "Lỗi xác thực"
                  );
                }
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            placeholder="Nhập điểm tối thiểu"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="discountPercent"
          label="Phần trăm giảm giá"
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                try {
                  createRankSchema.parse({ name: "temp", minPoints: 0, discountPercent: value });
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    error instanceof z.ZodError
                      ? error.errors.find(e => e.path[0] === "discountPercent")?.message
                      : "Lỗi xác thực"
                  );
                }
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            max={100}
            placeholder="Nhập phần trăm giảm giá"
            style={{ width: "100%" }}
            formatter={value => `${value}%`}
            parser={value => {
              const num = Number(value?.replace("%", ""));
              if (num <= 0) return 0;
              if (num >= 100) return 100;
              return num as 0 | 100;
            }}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            {
              validator: async (_, value) => {
                try {
                  createRankSchema.parse({ name: "temp", minPoints: 0, discountPercent: 0, description: value });
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(
                    error instanceof z.ZodError
                      ? error.errors.find(e => e.path[0] === "description")?.message
                      : "Lỗi xác thực"
                  );
                }
              },
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Nhập mô tả (không bắt buộc)"
            allowClear
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
            Tạo Rank
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};