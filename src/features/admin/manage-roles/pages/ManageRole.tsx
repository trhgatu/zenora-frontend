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
import { getAllRoles, deleteRoleById } from "../services/roleService";
import { Role } from "@/features/admin/manage-roles/types/role";
import ROUTERS from "@/constants/router";
import { toast } from "sonner";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

export const ManageRolePage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await getAllRoles(page + 1, 10);
        setRoles(res.items);
        setFilteredRoles(res.items);
        setPageCount(res.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách vai trò.");
        setLoading(false);
      }
    };

    fetchRoles();
  }, [page]);

  // Filter roles based on search and status
  useEffect(() => {
    let filtered = roles;

    if (searchText) {
      filtered = filtered.filter(role =>
        role.roleName.toLowerCase().includes(searchText.toLowerCase())
      );
    }


    setFilteredRoles(filtered);
  }, [roles, searchText, statusFilter]);

  const handleRefresh = () => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await getAllRoles(page + 1, 10);
        setRoles(res.items);
        setFilteredRoles(res.items);
        setPageCount(res.totalPages);
        message.success('Danh sách đã được làm mới');
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách vai trò.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  };

  const handleEdit = (role: Role) => navigate(ROUTERS.ADMIN.role.edit(role.id));
  const handleShow = (role: Role) => navigate(ROUTERS.ADMIN.role.show(role.id));

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await deleteRoleById(roleToDelete.id);
        setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id));
        toast.success("Xóa vai trò thành công");
        message.success("Xóa vai trò thành công");
      } catch {
        toast.error("Có lỗi xảy ra khi xóa vai trò");
        message.error("Có lỗi xảy ra khi xóa vai trò");
      } finally {
        setRoleToDelete(null);
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

  const columns: ColumnsType<Role> = [
    {
      title: 'Tên vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
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
      title: 'Quyền hạn',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 200,
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions && permissions.length > 0 ?
            permissions.slice(0, 2).map((permission, index) => (
              <Tag key={index} color="purple" className="text-xs">
                {permission}
              </Tag>
            )) :
            <Typography.Text type="secondary" className="text-xs">
              Không có quyền
            </Typography.Text>
          }
          {permissions && permissions.length > 2 && (
            <Tag color="default" className="text-xs">
              +{permissions.length - 2}
            </Tag>
          )}
        </div>
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
              description={`Bạn có chắc chắn muốn xóa vai trò "${record.roleName}"?`}
              onConfirm={() => confirmDelete()}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
              onOpenChange={(open) => {
                if (open) setRoleToDelete(record);
                else setRoleToDelete(null);
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
      `${range[0]}-${range[1]} của ${total} vai trò`,
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
            Quản lý vai trò
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
              onClick={() => navigate(ROUTERS.ADMIN.role.create)}
              className="flex items-center"
            >
              Tạo vai trò
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
              Hiển thị {filteredRoles.length} / {roles.length} vai trò
            </Typography.Text>
          </div>
        </div>

        <Spin spinning={loading} tip="Đang tải vai trò...">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredRoles}
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