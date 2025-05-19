import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { ServiceCategory } from "@/types/category";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryTableProps {
  data: ServiceCategory[];
  onEdit?: (category: ServiceCategory) => void;
  onDelete?: (category: ServiceCategory) => void;
  onShow?: (category: ServiceCategory) => void;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  data,
  onEdit,
  onDelete,
  onShow,
  pagination,
}) => {
  const columns: ColumnDef<ServiceCategory>[] = [
    {
      accessorKey: "categoryName",
      header: "Tên danh mục",
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (row.original.isActive ? "Yes" : "No"),
    },
    {
      accessorKey: "createdTime",
      header: "Thời gian tạo",
      cell: ({ row }) => new Date(row.original.createdTime).toLocaleString(),
    },
    {
      accessorKey: "lastUpdatedTime",
      header: "Thời gian cập nhật",
      cell: ({ row }) => new Date(row.original.lastUpdatedTime).toLocaleString(),
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
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete?.(row.original)}
          >
            Delete
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
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex justify-end items-center gap-4 p-4">
          <span>
            Page {pagination.pageIndex + 1} of {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex <= 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex >= pagination.pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
