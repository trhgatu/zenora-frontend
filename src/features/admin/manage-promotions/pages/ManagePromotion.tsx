import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Typography,
  Tooltip,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Promotion } from "@/features/admin/manage-promotions/types/promotion";
import ROUTERS from "@/constants/router";
import { getAllPromotions } from "@/features/admin/manage-promotions/services";
import { toast } from "sonner";

const { Title } = Typography;
const { Search } = Input;

export const ManagePromotionPage = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const res = await getAllPromotions(page + 1, 10);
        setPromotions(res.data);
        setFilteredPromotions(res.data);
        setPageCount(res.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách khuyến mãi.");
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [page]);

  // Filter promotions based on search and status
  useEffect(() => {
    let filtered = promotions;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(promotion =>
        promotion.promotionName.toLowerCase().includes(searchText.toLowerCase()) ||
        (promotion.description && promotion.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    setFilteredPromotions(filtered);
  }, [promotions, searchText, statusFilter]);

  const handleRefresh = () => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const res = await getAllPromotions(page + 1, 10);
        setPromotions(res.data);
        setFilteredPromotions(res.data);
        setPageCount(res.totalPages);
        toast.success('Danh sách đã được làm mới');
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách khuyến mãi.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  };

  const handleEdit = (promotion: Promotion) => {
    navigate(ROUTERS.ADMIN.promotion.edit(promotion.id));
  };

  const handleShow = (promotion: Promotion) => {
    navigate(ROUTERS.ADMIN.promotion.show(promotion.id));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
  };

  const columns: ColumnsType<Promotion> = [
    {
      title: 'Tên khuyến mãi',
      dataIndex: 'promotionName',
      key: 'promotionName',
      sorter: (a, b) => a.promotionName.localeCompare(b.promotionName),
      render: (text: string) => (
        <Typography.Text strong>{text}</Typography.Text>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <Typography.Text type="secondary">
            {text || 'Không có mô tả'}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleShow(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const paginationConfig: TablePaginationConfig = {
    current: page + 1,
    total: pageCount * 10,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} của ${total} khuyến mãi`,
    onChange: (currentPage) => setPage(currentPage - 1),
    onShowSizeChange: (current, size) => {
      console.log('Page size changed:', current, size);
    },
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <Title level={2} className="!m-0">
            Quản lý khuyến mãi
          </Title>
          <Space className="flex-shrink-0">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              className="flex items-center"
            >
              Làm mới
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTERS.ADMIN.promotion.create)}
              className="flex items-center"
            >
              Tạo khuyến mãi
            </Button>
          </Space>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 lg:col-span-1">
            <Search
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className="w-full"
            />
          </div>

          <div>
            <Button onClick={clearFilters} className="w-full md:w-auto">
              Xóa bộ lọc
            </Button>
          </div>
          <div className="flex items-center">
            <Typography.Text type="secondary" className="text-sm">
              Hiển thị {filteredPromotions.length} / {promotions.length} khuyến mãi
            </Typography.Text>
          </div>
        </div>

        <Spin spinning={loading} tip="Đang tải khuyến mãi...">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredPromotions}
              rowKey="id"
              pagination={paginationConfig}
              scroll={{ x: 800 }}
              size="middle"
              bordered
              className="min-w-full"
            />
          </div>
        </Spin>
      </Card>
    </div>
  );
};