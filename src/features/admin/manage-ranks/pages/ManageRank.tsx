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
import { Rank } from "@/features/admin/manage-ranks/types/rank";
import ROUTERS from "@/constants/router";
import { deleteRankById, getAllRanks } from "@/features/admin/manage-ranks/services/rankService";
import { toast } from "sonner";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export const ManageRankPage = () => {
  const navigate = useNavigate();
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [filteredRanks, setFilteredRanks] = useState<Rank[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rankToDelete, setRankToDelete] = useState<Rank | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRanks = async () => {
      setLoading(true);
      try {
        const res = await getAllRanks(page + 1, 10);
        setRanks(res.items);
        setFilteredRanks(res.items);
        setPageCount(res.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách cấp bậc.");
        setLoading(false);
      }
    };

    fetchRanks();
  }, [page]);

  // Filter ranks based on search and status
  useEffect(() => {
    let filtered = ranks;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(rank =>
        rank.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (rank.description && rank.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    setFilteredRanks(filtered);
  }, [ranks, searchText, statusFilter]);

  const handleRefresh = () => {
    const fetchRanks = async () => {
      setLoading(true);
      try {
        const res = await getAllRanks(page + 1, 10);
        setRanks(res.items);
        setFilteredRanks(res.items);
        setPageCount(res.totalPages);
        message.success('Danh sách đã được làm mới');
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách cấp bậc.");
      } finally {
        setLoading(false);
      }
    };
    fetchRanks();
  };

  const handleEdit = (rank: Rank) => {
    navigate(ROUTERS.ADMIN.rank.edit(rank.id));
  };

  const handleShow = (rank: Rank) => {
    navigate(ROUTERS.ADMIN.rank.show(rank.id));
  };

  const confirmDelete = async () => {
    if (rankToDelete) {
      try {
        await deleteRankById(rankToDelete.id);
        setRanks((prev) => prev.filter((r) => r.id !== rankToDelete.id));
        toast.success("Xóa cấp bậc thành công");
        message.success("Xóa cấp bậc thành công");
      } catch {
        toast.error("Xóa cấp bậc thất bại");
        message.error("Xóa cấp bậc thất bại");
      } finally {
        setRankToDelete(null);
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

  const columns: ColumnsType<Rank> = [
    {
      title: 'Tên cấp bậc',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
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
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa cấp bậc "${record.name}"?`}
              onConfirm={() => confirmDelete()}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
              onOpenChange={(open) => {
                if (open) setRankToDelete(record);
                else setRankToDelete(null);
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
      `${range[0]}-${range[1]} của ${total} cấp bậc`,
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
            Quản lý cấp bậc
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
              onClick={() => navigate(ROUTERS.ADMIN.rank.create)}
              className="flex items-center"
            >
              Tạo cấp bậc
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
              Hiển thị {filteredRanks.length} / {ranks.length} cấp bậc
            </Typography.Text>
          </div>
        </div>

        <Spin spinning={loading} tip="Đang tải cấp bậc...">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredRanks}
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