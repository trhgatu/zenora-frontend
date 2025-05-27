import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { updatePromotion, getPromotionById } from "@/features/admin/manage-promotions/services";
import { toast } from "sonner";
import {
    Card,
    Row,
    Col,
    Space,
    Typography,
    Divider,
    Spin,
    Switch,
    InputNumber,
    DatePicker,
    Select,
    Form
} from 'antd';
import { LoadingOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import BackButton from "@/components/BackButton";
import { getAllRanks } from "@/features/admin/manage-ranks/services/rankService";
import { Rank } from "@/features/admin/manage-ranks/types/rank";
import { Textarea } from "@/components/ui/textarea";

const { Title, Text } = Typography;

const schema = z.object({
    id: z.string(),
    promotionName: z.string().min(2, "Tên khuyến mãi phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    isActive: z.boolean(),
    rankIds: z.array(z.string()),
    quantity: z.number().min(0, "Số lượng phải >= 0"),
    discountPercent: z.number().min(0).max(100),
    discountAmount: z.number().min(0),
});

type EditPromotionFormData = z.infer<typeof schema>;

export const EditPromotionPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EditPromotionFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: id ?? "",
            promotionName: "",
            description: "",
            startDate: "",
            endDate: "",
            isActive: true,
            discountAmount: 0,
            discountPercent: 0,
            quantity: 0,
            rankIds: [],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;

                const [promotion, rankRes] = await Promise.all([
                    getPromotionById(id),
                    getAllRanks(1, 100)
                ]);

                setRanks(rankRes.items);

                setValue("id", promotion.id);
                setValue("promotionName", promotion.promotionName || "");
                setValue("description", promotion.description || "");
                setValue("startDate", promotion.startDate);
                setValue("endDate", promotion.endDate);
                setValue("isActive", promotion.isActive);
                setValue("discountAmount", promotion.discountAmount);
                setValue("discountPercent", promotion.discountPercent);
                setValue("quantity", promotion.quantity);
                setValue("rankIds", promotion.rankIds || []);
            } catch {
                toast.error("Không thể tải dữ liệu khuyến mãi hoặc rank.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, setValue]);

    const onSubmit = async (data: EditPromotionFormData) => {
        try {
            await updatePromotion({
                ...data,
                description: data.description || "",
            });
            toast.success("Cập nhật khuyến mãi thành công!");
            navigate("/admin/promotions");
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật khuyến mãi thất bại.");
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                background: '#f5f5f5'
            }}>
                <Card style={{ textAlign: 'center', minWidth: '300px' }}>
                    <Spin
                        indicator={<LoadingOutlined spin />}
                        size="large"
                    />
                    <div style={{ marginTop: '16px' }}>
                        <Text type="secondary">Đang tải dữ liệu...</Text>
                    </div>
                </Card>
            </div>
        );
    }

    const rankOptions = ranks.map((r: Rank) => ({
        label: r.name,
        value: r.id,
    }));

    return (
        <div style={{
            padding: '24px',
            background: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <Card
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                {/* Header */}
                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                    <Col>
                        <Space>
                            <EditOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Title level={2} style={{ margin: 0, color: '#262626' }}>
                                Chỉnh sửa khuyến mãi
                            </Title>
                        </Space>
                    </Col>
                    <Col>
                        <BackButton />
                    </Col>
                </Row>

                <Divider />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row gutter={[24, 24]}>
                        {/* Basic Information Section */}
                        <Col span={24}>
                            <Card
                                type="inner"
                                title="Thông tin cơ bản"
                                style={{ marginBottom: '24px' }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Tên khuyến mãi"
                                            validateStatus={errors.promotionName ? 'error' : ''}
                                            help={errors.promotionName?.message}
                                        >
                                            <Input
                                                {...register("promotionName")}
                                                placeholder="Nhập tên khuyến mãi"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Số lượng"
                                            validateStatus={errors.quantity ? 'error' : ''}
                                            help={errors.quantity?.message}
                                        >
                                            <InputNumber
                                                min={0}
                                                size="large"
                                                style={{ width: '100%' }}
                                                value={watch("quantity")}
                                                onChange={(val) => setValue("quantity", Number(val))}
                                                placeholder="Nhập số lượng"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Mô tả">
                                    <Textarea
                                        rows={3}
                                        {...register("description")}
                                        placeholder="Nhập mô tả khuyến mãi (không bắt buộc)"
                                    />
                                </Form.Item>

                                <Form.Item label="Áp dụng cho hạng hội viên">
                                    <Select
                                        mode="multiple"
                                        options={rankOptions}
                                        size="large"
                                        style={{ width: '100%' }}
                                        value={watch("rankIds")}
                                        onChange={(values) => setValue("rankIds", values)}
                                        placeholder="Chọn các hạng hội viên"
                                        allowClear
                                    />
                                </Form.Item>
                            </Card>
                        </Col>

                        {/* Discount Information Section */}
                        <Col span={24}>
                            <Card
                                type="inner"
                                title="Thông tin giảm giá"
                                style={{ marginBottom: '24px' }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Giảm giá (%)">
                                            <InputNumber
                                                min={0}
                                                max={100}
                                                size="large"
                                                style={{ width: '100%' }}
                                                value={watch("discountPercent")}
                                                onChange={(val) => setValue("discountPercent", Number(val))}
                                                placeholder="Nhập % giảm giá"
                                                formatter={value => `${value}%`}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item label="Giảm tiền (VNĐ)">
                                            <InputNumber
                                                min={0}
                                                size="large"
                                                style={{ width: '100%' }}
                                                value={watch("discountAmount")}
                                                onChange={(val) => setValue("discountAmount", Number(val))}
                                                placeholder="Nhập số tiền giảm"
                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Time & Status Section */}
                        <Col span={24}>
                            <Card
                                type="inner"
                                title="Thời gian & Trạng thái"
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item label="Ngày bắt đầu">
                                            <DatePicker
                                                size="large"
                                                style={{ width: '100%' }}
                                                value={dayjs(watch("startDate"))}
                                                showTime
                                                format="DD/MM/YYYY HH:mm"
                                                onChange={(val) => val && setValue("startDate", val.toISOString())}
                                                placeholder="Chọn ngày bắt đầu"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item label="Ngày kết thúc">
                                            <DatePicker
                                                size="large"
                                                style={{ width: '100%' }}
                                                value={dayjs(watch("endDate"))}
                                                showTime
                                                format="DD/MM/YYYY HH:mm"
                                                onChange={(val) => val && setValue("endDate", val.toISOString())}
                                                placeholder="Chọn ngày kết thúc"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Trạng thái hoạt động">
                                    <Space size="middle">
                                        <Switch
                                            checked={watch("isActive")}
                                            onChange={(val) => setValue("isActive", val)}
                                            size="default"
                                        />
                                        <Text strong style={{
                                            color: watch("isActive") ? '#52c41a' : '#ff4d4f'
                                        }}>
                                            {watch("isActive") ? "Đang hoạt động" : "Không hoạt động"}
                                        </Text>
                                    </Space>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Action Buttons */}
                    <Row justify="end">
                        <Space size="middle">
                            <Button
                                onClick={() => navigate("/admin/promotions")}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang cập nhật..." : "Cập nhật khuyến mãi"}
                            </Button>
                        </Space>
                    </Row>
                </form>
            </Card>
        </div>
    );
};