import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Appointment } from "../types/appointmentTypes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { appointmentService } from "../services/appointmentService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface AppointmentTableProps {
  data: Appointment[];
  pagination: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  data,
  pagination,
  onStatusUpdate,
}) => {
  const navigate = useNavigate();
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const statusOrder = ['pending', 'confirmed', 'checked_in', 'completed', 'canceled', 'no_show'];

  const getAvailableStatuses = (currentStatus?: string) => {
    if (!currentStatus) return statusOrder;
    if (currentStatus === 'canceled' || currentStatus === 'no_show') return [currentStatus];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex === -1) return statusOrder;
    return statusOrder.slice(currentIndex);
  };

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: ({ row }) => row.original.customerName || "Khách vãng lai",
    },
    {
      accessorKey: "appointmentDate",
      header: "Ngày hẹn",
      cell: ({ row }) => new Date(row.original.appointmentDate).toLocaleDateString('vi-VN'),
    },
    {
      accessorKey: "startTime",
      header: "Giờ bắt đầu",
    },
    {
      accessorKey: "branchName",
      header: "Chi nhánh",
      cell: ({ row }) => row.original.branchName || row.original.spaBranchLocationId || "Chưa xác định",
    },
    {
      accessorKey: "bookingStatus",
      header: "Trạng thái",
      cell: ({ row }) => {
        console.log('AppointmentTable: Status for row:', row.original.id, row.original.bookingStatus); // Log
        const status = row.original.bookingStatus;
        return status ? status.replace('_', ' ').toUpperCase() : "Chưa xác định";
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/provider/appointments/show/${row.original.id}`)}
          >
            Xem
          </Button>
          <Select
            value={row.original.bookingStatus || 'pending'}
            onValueChange={async (value) => {
              if (value === row.original.bookingStatus) return;
              setStatusLoading(row.original.id!);
              try {
                await appointmentService.updateStatus(row.original.id!, value);
                onStatusUpdate(row.original.id!, value);
                toast.success("Cập nhật trạng thái thành công!");
              } catch (error) {
                toast.error("Lỗi khi cập nhật trạng thái.");
                console.error('AppointmentTable: Update status error:', error);
              } finally {
                setStatusLoading(null);
              }
            }}
            disabled={statusLoading === row.original.id}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getAvailableStatuses(row.original.bookingStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              try {
                await appointmentService.softDeleteAppointment(row.original.id!);
                toast.success("Xóa lịch hẹn thành công!");
                window.location.reload();
              } catch (error) {
                toast.error("Lỗi khi xóa lịch hẹn.");
                console.error('AppointmentTable: Delete error:', error);
              }
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Không tìm thấy lịch hẹn.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center gap-4 p-4">
        <span>
          Trang {pagination.pageIndex + 1} / {pagination.pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
          disabled={pagination.pageIndex <= 0}
        >
          Trang trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
          disabled={pagination.pageIndex >= pagination.pageCount - 1}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};