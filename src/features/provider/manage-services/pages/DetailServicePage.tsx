import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Button, Tag, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getServiceById } from '../services/serviceApi';
import { Service } from '../types/service.types';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../types/service.types';

const { Title } = Typography;

export const DetailServicePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchService = async () => {
            setLoading(true);
            try {
                const data = await getServiceById(id!);
                setService(data);
            } catch (err) {
                const axiosError = err as AxiosError<ErrorResponse>;
                const errorMsg =
                    axiosError.response?.data?.message || "Không thể tải thông tin dịch vụ.";
                message.error(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchService();
    }, [id]);

    return (
        <div className="p-6">
            <Card bordered className="shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <Title level={3} className="!mb-0">Chi tiết dịch vụ : {service?.serviceName}</Title>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </Button>
                </div>

                <Spin spinning={loading}>
                    {service && (
                        <Descriptions bordered column={1} labelStyle={{ fontWeight: 600 }}>
                            <Descriptions.Item label="Tên dịch vụ">
                                {service.serviceName}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả">
                                {service.description || 'Không có mô tả'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá">
                                {service.price} VNĐ
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời lượng">
                                {service.duration} phút
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={service.isAvailable ? 'green' : 'red'}>
                                    {service.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tạo">
                                {new Date(service.createdTime).toLocaleString("vi-VN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày cập nhật">
                                {new Date(service.lastUpdatedTime).toLocaleString("vi-VN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã xóa">
                                {new Date(service.deletedTime).toLocaleString("vi-VN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Spin>
            </Card>
        </div>
    );
};
