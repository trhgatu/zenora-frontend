import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Typography,
  message,
  Select,
  Tooltip,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { getAllUsers } from "@/features/admin/manage-users/services/userServices";
import { User } from "@/features/admin/manage-users/types/user";
import ROUTERS from "@/constants/router";
import { toast } from "sonner";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export const ManageUserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers(page + 1, 10);
        setUsers(res.items);
        setFilteredUsers(res.items);
        setPageCount(res.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Không thể tải danh sách người dùng.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  // Filter users based on search and status
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(user =>
        (user.fullName && user.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (statusFilter === 'active') return user.isActive === true;
        if (statusFilter === 'inactive') return user.isActive === false;
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchText, statusFilter]);

  const handleRefresh = () => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers(page + 1, 10);
        setUsers(res.items);
        setFilteredUsers(res.items);
        setPageCount(res.totalPages);
        message.success('Danh sách đã được làm mới');
      } catch (error) {
        console.error("Error loading users:", error);
        toast.error("Không thể tải danh sách người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id));
  };

  const handleShow = (user: User) => {
    navigate(ROUTERS.ADMIN.user.show(user.id));
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

  /* const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      await deleteUserById(user.id)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    }
  } */

  const columns: ColumnsType<User> = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
      render: (text: string) => (
        <Typography.Text strong>{text || 'N/A'}</Typography.Text>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
      render: (text: string) => (
        <Typography.Text type="secondary">
          {text || 'N/A'}
        </Typography.Text>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
      render: (text: string) => (
        <Typography.Text>{text || 'N/A'}</Typography.Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Không hoạt động', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </span>
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
          {/* <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa người dùng "${record.name}"?`}
              onConfirm={() => handleDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
          </Tooltip> */}
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
      `${range[0]}-${range[1]} của ${total} người dùng`,
    onChange: (currentPage) => setPage(currentPage - 1),
    onShowSizeChange: (current, size) => {
      console.log('Page size changed:', current, size);
    },
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserOutlined className="text-blue-600 text-lg" />
            </div>
            <Title level={2} className="!m-0">
              Quản lý người dùng
            </Title>
          </div>
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
              onClick={() => navigate(ROUTERS.ADMIN.user.create)}
              className="flex items-center"
            >
              Tạo người dùng
            </Button>
          </Space>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2 lg:col-span-1">
            <Search
              placeholder="Tìm kiếm theo tên, email, username..."
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
              Hiển thị {filteredUsers.length} / {users.length} người dùng
            </Typography.Text>
          </div>
        </div>

        <Spin spinning={loading} tip="Đang tải danh sách người dùng...">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredUsers}
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