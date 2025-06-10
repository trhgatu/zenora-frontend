import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Space,
  Typography,
  message,
  Row,
  Col,
  Divider
} from "antd"
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { createCategory } from "@/features/admin/manage-categories/services/categoryService"
import { baseCategorySchema } from "../validator/category"

const { Title, Text } = Typography

type CreateServiceCategoryFormData = z.infer<typeof baseCategorySchema>

export const CreateCategoryPage = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceCategoryFormData>({
    resolver: zodResolver(baseCategorySchema),
    defaultValues: {
      categoryName: "",
      isActive: false,
    },
  })

  const onSubmit = async (data: CreateServiceCategoryFormData) => {
    const hide = messageApi.loading("Đang tạo danh mục...", 0)
    try {
      await createCategory(data)
      hide()
      messageApi.success("Tạo danh mục thành công!")
      setTimeout(() => navigate("/admin/categories"), 1000)
    } catch (error) {
      hide()
      console.error(error)
      messageApi.error("Có lỗi khi tạo danh mục.")
    }
  }

  const handleBack = () => {
    navigate("/admin/categories")
  }

  return (
    <>
      {contextHolder}
      <div className="p-6">
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="mb-4 hover:bg-gray-100"
          >
            Về trang danh mục
          </Button>
          <Title level={2} className="!mb-2">
            Tạo danh mục mới
          </Title>
          <Text type="secondary">
            Add a new service category to organize your offerings
          </Text>
        </div>

        {/* Form Card */}
        <Card
          className="shadow-sm border-0"
          styles={{
            body: { padding: '32px' }
          }}
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label={
                    <Text strong className="text-gray-700">
                      Tên danh mục
                    </Text>
                  }
                  validateStatus={errors.categoryName ? "error" : ""}
                  help={errors.categoryName?.message}
                  className="mb-6"
                >
                  <Controller
                    name="categoryName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        size="large"
                        placeholder="Enter category name"
                        className="rounded-lg"
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider className="my-6" />

            {/* Status Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <Text strong className="text-gray-700 block mb-3">
                Trạng thái
              </Text>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Space align="center">
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      size="default"
                    />
                    <Text className="text-gray-600">
                      {field.value ? "Active" : "Inactive"}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      {field.value
                        ? "Category is visible and available for use"
                        : "Category is hidden and not available for use"
                      }
                    </Text>
                  </Space>
                )}
              />
            </div>

            <Divider className="my-6" />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                size="large"
                onClick={handleBack}
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SaveOutlined />}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Đang tạo..." : "Tạo danh mục"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </>
  )
}