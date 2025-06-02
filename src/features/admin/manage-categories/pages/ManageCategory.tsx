import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Typography,
  Popconfirm,
  message,
  Select,
  Tag,
  Tooltip,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { getAllCategories, softDeleteCategoryById } from "@/features/admin/manage-categories/services/categoryService";
import ROUTERS from "@/constants/router";
import { toast } from "sonner";
import { ServiceCategory } from "@/types/category";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export const ManageCategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ServiceCategory[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories(page + 1, 10);
        setCategories(res.data);
        setFilteredCategories(res.data);
        setPageCount(res.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách danh mục.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page]);

  // Filter categories based on search and status
  useEffect(() => {
    let filtered = categories;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(category =>
        category.categoryName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => {
        if (statusFilter === 'active') return category.isActive;
        if (statusFilter === 'inactive') return !category.isActive;
        return true;
      });
    }

    setFilteredCategories(filtered);
  }, [categories, searchText, statusFilter]);

  const handleRefresh = () => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories(page + 1, 10);
        setCategories(res.data);
        setFilteredCategories(res.data);
        setPageCount(res.totalPages);
        message.success('Danh sách đã được làm mới');
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách danh mục.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await softDeleteCategoryById(categoryToDelete.id);
        setCategories((prev) => prev.filter((r) => r.id !== categoryToDelete.id));
        toast.success("Danh mục đã được xóa thành công");
        message.success("Danh mục đã được xóa thành công");
      } catch {
        toast.error("Không thể xóa danh mục");
        message.error("Không thể xóa danh mục");
      } finally {
        setCategoryToDelete(null);
      }
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
  };

  const columns: ColumnsType<ServiceCategory> = [
    {
      title: 'Tên danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
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
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Không hoạt động', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: (a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
      render: (date: string) => (
        <Typography.Text type="secondary">
          {new Date(date).toLocaleDateString('vi-VN')}
        </Typography.Text>
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
              onClick={() => navigate(ROUTERS.ADMIN.category.show(record.id))}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(ROUTERS.ADMIN.category.edit(record.id))}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa danh mục "${record.categoryName}"?`}
              onConfirm={() => confirmDelete()}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
              onOpenChange={(open) => {
                if (open) setCategoryToDelete(record);
                else setCategoryToDelete(null);
              }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
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
      `${range[0]}-${range[1]} của ${total} danh mục`,
    onChange: (currentPage) => setPage(currentPage - 1),
    onShowSizeChange: (current, size) => {
      // Handle page size change if needed
      console.log('Page size changed:', current, size);
    },
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <Title level={2} className="!m-0">
            Quản lý danh mục
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
              onClick={() => navigate(ROUTERS.ADMIN.category.create)}
              className="flex items-center"
            >
              Tạo danh mục
            </Button>
          </Space>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 lg:col-span-1">
            <Search
              placeholder="Tìm kiếm theo tên..."
              allowClear
              enterButton={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          <div>
            <Select
              className="w-full"
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </div>
          <div>
            <Button onClick={clearFilters} className="w-full md:w-auto">
              Xóa bộ lọc
            </Button>
          </div>
          <div className="flex items-center">
            <Typography.Text type="secondary" className="text-sm">
              Hiển thị {filteredCategories.length} / {categories.length} danh mục
            </Typography.Text>
          </div>
        </div>

        <Spin spinning={loading} tip="Đang tải danh mục...">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredCategories}
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