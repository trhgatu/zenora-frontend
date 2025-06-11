import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Tooltip,
  Spin,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { getAllSpaBranches } from "@/features/admin/manage-facilities/services/facilityServices";
import { toast } from "sonner";

const { Title } = Typography;

interface SpaBranch {
  id: string;
  branchName: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  provinceId: string;
  districtId: string;
  provinceName: string;
  districtName: string;
  workingHours: Array<{
    id: string;
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
    isWorking: boolean;
    providerId: string | null;
    spaBranchLocationId: string;
    branchName: string | null;
  }>;
}

export default function ManageFacilityPage() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<SpaBranch[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await getAllSpaBranches(page + 1, 10);
      const data = res.items || [];
      const totalPages = res.totalPages || 1;
      setFacilities(data);
      setPageCount(totalPages);
      toast.success("Danh sách chi nhánh đã được tải.");
    } catch (error) {
      console.error("Failed to fetch facilities", error);
      toast.error("Không thể tải danh sách chi nhánh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [page]);

  const handleRefresh = () => {
    fetchFacilities();
  };

  const handleShow = (facility: SpaBranch) => {
    navigate(`/admin/facilities/show/${facility.id}`);
  };

  const columns: ColumnsType<SpaBranch> = [
    {
      title: "Tên chi nhánh",
      dataIndex: "branchName",
      key: "branchName",
      sorter: (a, b) => a.branchName.localeCompare(b.branchName),
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) => (
        <Typography.Text>
          {`${record.street}, ${record.districtName}, ${record.provinceName}`}
        </Typography.Text>
      ),
    },
    {
      title: "Giờ làm việc",
      key: "workingHours",
      render: (_, record) => (
        <Typography.Text>
          {record.workingHours
            .filter((wh) => wh.isWorking)
            .map((wh) => {
              const days = [
                "Chủ Nhật",
                "Thứ Hai",
                "Thứ Ba",
                "Thứ Tư",
                "Thứ Năm",
                "Thứ Sáu",
                "Thứ Bảy",
              ];
              return `${days[wh.dayOfWeek]}: ${wh.openingTime.slice(0, 5)} - ${wh.closingTime.slice(0, 5)}`;
            })
            .join("; ")}
        </Typography.Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
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
      `${range[0]}-${range[1]} của ${total} chi nhánh`,
    onChange: (currentPage) => setPage(currentPage - 1),
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <Title level={2} className="!m-0">
            Quản lý chi nhánh
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
          </Space>
        </div>

        <Spin spinning={loading} tip="Đang tải danh sách chi nhánh...">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={facilities}
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
}