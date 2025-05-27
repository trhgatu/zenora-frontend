import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Promotion } from "@/features/admin/manage-promotions/types/promotion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface PromotionTableProps {
  data: Promotion[];
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
  onShow?: (promotion: Promotion) => void;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
}

export const PromotionTable: React.FC<PromotionTableProps> = ({
  data,
  onEdit,
  onShow,
}) => {
  const columns: ColumnDef<Promotion>[] = [
    {
      accessorKey: "promotionName",
      header: "Tên khuyến mãi",
      cell: ({ row }) => row.original.promotionName || "(Không có tên)",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    {
      accessorKey: "discountPercent",
      header: "Giảm %",
      cell: ({ row }) => `${row.original.discountPercent}%`,
    },
    {
      accessorKey: "discountAmount",
      header: "Giảm tiền",
      cell: ({ row }) => `${row.original.discountAmount.toLocaleString()} đ`,
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
    },
    {
      accessorKey: "startDate",
      header: "Bắt đầu",
      cell: ({ row }) => new Date(row.original.startDate).toLocaleString(),
    },
    {
      accessorKey: "endDate",
      header: "Kết thúc",
      cell: ({ row }) => new Date(row.original.endDate).toLocaleString(),
    },
    {
      accessorKey: "isActive",
      header: "Hoạt động",
      cell: ({ row }) => (row.original.isActive ? "✔️" : "❌"),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onShow?.(row.original)}>
            Show
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit?.(row.original)}>
            Edit
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
                Không có khuyến mãi nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
