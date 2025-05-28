import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    Descriptions,
    Tag,
    Button,
    Space,
    Typography,
    Row,
    Col,
    Statistic,
    Alert,
    Spin
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    PercentageOutlined,
    NumberOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import { Promotion } from "@/features/admin/manage-promotions/types/promotion";
import PageLoaderWrapper from "@/components/PageLoaderWrapper";
import { getPromotionById } from "@/features/admin/manage-promotions/services";

const { Title, Text } = Typography;

export const DetailPromotionPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getPromotionById(id)
                .then((res) => {
                    setPromotion(res);
                    setError(null);
                })
                .catch(() => {
                    setPromotion(null);
                    setError("Không thể tải thông tin khuyến mãi. Vui lòng thử lại.");
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusTag = (isActive: boolean) => {
        return (
            <Tag color={isActive ? "green" : "red"}>
                {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </Tag>
        );
    };

    const getDiscountDisplay = () => {
        if (!promotion) return "";

        if (promotion.discountPercent > 0) {
            return `${promotion.discountPercent}%`;
        }
        return formatCurrency(promotion.discountAmount);
    };
    if(loading) {
        return (
            <Spin indicator={<LoadingOutlined/>} fullscreen/>
        )
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

    if (!promotion) {
        return (
            <div className="p-6">
                <Alert
                    message="Không tìm thấy"
                    description="Không tìm thấy thông tin khuyến mãi."
                    type="warning"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/admin/promotions')}>
                            Quay lại danh sách
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <PageLoaderWrapper loading={loading} tip="Đang tải thông tin khuyến mãi...">
            <div className="p-6 max-w-6xl mx-auto">
                <div className="mb-6">
                    <Space className="mb-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/admin/promotions')}
                        >
                            Quay lại
                        </Button>
                    </Space>

                    <div className="flex justify-between items-start">
                        <div>
                            <Title level={2} className="mb-2">
                                {promotion.promotionName || "Khuyến mãi không tên"}
                            </Title>
                        </div>


                    </div>
                </div>

                {/* Statistics Cards */}
                <Row gutter={16} className="mb-6">
                    <Col xs={12} sm={8} md={6}>
                        <Card>
                            <Statistic
                                title="Giảm giá"
                                value={getDiscountDisplay()}
                                prefix={<PercentageOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                        <Card>
                            <Statistic
                                title="Số lượng"
                                value={promotion.quantity}
                                prefix={<NumberOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8} md={12}>
                        <Card>
                            <Statistic
                                title="Thời gian còn lại"
                                value={new Date(promotion.endDate).getTime() - Date.now() > 0 ?
                                    Math.ceil((new Date(promotion.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0}
                                suffix="ngày"
                                prefix={<CalendarOutlined />}
                                valueStyle={{
                                    color: new Date(promotion.endDate).getTime() - Date.now() > 0 ? '#3f8600' : '#cf1322'
                                }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main Content */}
                <div className="mb-6">
                    <Card title="Thông tin chi tiết" className="mb-6">
                        <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2 }}
                            labelStyle={{ fontWeight: 'bold', width: '200px' }}
                        >
                            <Descriptions.Item label="Tên khuyến mãi">
                                {promotion.promotionName || <Text type="secondary">(Không có tên)</Text>}
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {getStatusTag(promotion.isActive)}
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại giảm giá">
                                {promotion.discountPercent > 0 ? (
                                    <Tag color="blue">Phần trăm</Tag>
                                ) : (
                                    <Tag color="green">Số tiền cố định</Tag>
                                )}
                            </Descriptions.Item>

                            <Descriptions.Item label="Giá trị giảm">
                                <Text strong style={{ color: '#cf1322', fontSize: '16px' }}>
                                    {getDiscountDisplay()}
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Số lượng khả dụng">
                                <Text strong>{promotion.quantity.toLocaleString('vi-VN')}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày bắt đầu">
                                {formatDate(promotion.startDate)}
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày kết thúc">
                                {formatDate(promotion.endDate)}
                            </Descriptions.Item>

                            {/*  <Descriptions.Item label="Thời gian tạo">
                        {promotion.createdAt ? formatDate(promotion.createdAt) : 'N/A'}
                    </Descriptions.Item> */}
                        </Descriptions>
                    </Card>
                </div>

                {/* Description */}
                {promotion.description && (
                    <div className="mb-6">
                        <Card title="Mô tả khuyến mãi">
                            <div
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6',
                                    fontSize: '14px'
                                }}
                            >
                                {promotion.description}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Warning for expired promotions */}
                {new Date(promotion.endDate) < new Date() && (
                    <Alert
                        className="mt-4"
                        message="Khuyến mãi đã hết hạn"
                        description={`Khuyến mãi này đã kết thúc vào ${formatDate(promotion.endDate)}`}
                        type="warning"
                        showIcon
                    />
                )}
            </div>

        </PageLoaderWrapper>
    );
};