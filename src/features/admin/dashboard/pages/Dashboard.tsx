import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminStatistics } from "@/features/admin/dashboard/services/getAdminStatistics";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
    completedCount: 0,
    cancelledCount: 0,
    noShowCount: 0,
    topServices: [] as { name: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(new Date("2025-06-01"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-06-11T13:16:00+07:00"));

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminStatistics(1, 10, {
        startDate: startDate?.toISOString() || "2025-06-01T00:00:00Z",
        endDate: endDate?.toISOString() || "2025-06-11T13:16:00+07:00",
      });
      setStats({
        totalAppointments: data.totalAppointments,
        totalRevenue: data.totalRevenue,
        completedCount: data.completedCount,
        cancelledCount: data.cancelledCount,
        noShowCount: data.noShowCount,
        topServices: data.topServices.map((service: any) => ({
          name: service.name || "Unknown",
          count: service.count || 0,
        })),
      });
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thống kê.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApplyDateRange = () => {
    if (startDate && endDate && startDate > endDate) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc.");
      return;
    }
    fetchStats();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  // Chart data for total revenue
  const chartData = {
    labels: [`Doanh thu từ ${startDate?.toLocaleDateString("vi-VN")} đến ${endDate?.toLocaleDateString("vi-VN")}`],
    datasets: [
      {
        label: "Doanh thu",
        data: [stats.totalRevenue],
        backgroundColor: "#3b82f6", // Blue-500 for consistency with Shadcn UI
        borderColor: "#2563eb", // Blue-600
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Tổng doanh thu",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VND)",
        },
        ticks: {
          callback: (value: number) => new Intl.NumberFormat("vi-VN").format(value),
        },
      },
    },
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Thống kê Admin</h2>
      <div className="flex space-x-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            isClearable={true}
            dateFormat="dd/MM/yyyy"
            className="border rounded p-2"
            placeholderText="Chọn ngày bắt đầu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            isClearable={true}
            dateFormat="dd/MM/yyyy"
            className="border rounded p-2"
            placeholderText="Chọn ngày kết thúc"
          />
        </div>
        <Button onClick={handleApplyDateRange}>Áp dụng</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tổng số cuộc hẹn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalAppointments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.completedCount}</p>
            <Badge className="mt-2 bg-green-500">Hoàn tất</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đã hủy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.cancelledCount}</p>
            <Badge className="mt-2 bg-red-500">Hủy</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Không xuất hiện</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.noShowCount}</p>
            <Badge className="mt-2 bg-yellow-500">Không đến</Badge>
          </CardContent>
        </Card>
        {/* New Chart Card for Total Revenue */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Thống kê doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={chartData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ hàng đầu</CardTitle>
          <Button variant="outline" onClick={fetchStats}>Làm mới</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Số lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.topServices.length > 0 ? (
                stats.topServices.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;