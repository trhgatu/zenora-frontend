import { useState, useEffect } from "react";
import { Service } from "@/features/admin/manage-services/types/service";
import { getAllServices } from "@/features/admin/manage-services/services/serviceServices";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

export const ManageServicePage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await getAllServices(page + 1, 10);
      setServices(res.items);
      setPageCount(res.totalPages);
    };
    fetchServices();
  }, [page]);


  const columns: ColumnsType<Service> = [
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} phút`,
    },

    {
      title: "Thời gian tạo",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (time: string) => new Date(time).toLocaleString("vi-VN"),
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "lastUpdatedTime",
      key: "lastUpdatedTime",
      render: (time: string) => new Date(time).toLocaleString("vi-VN"),
    },

  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Quản lý dịch vụ</h2>

      </div>
      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
        pagination={{
          current: page + 1,
          total: pageCount * 10,
          pageSize: 10,
          onChange: (newPage) => setPage(newPage - 1),
        }}
      />
    </div>
  );
};