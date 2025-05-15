import * as React from "react"
import { Role } from "@/features/admin/manage-roles/types/role"
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RoleTableProps {
  data: Role[]
  onEdit?: (role: Role) => void
  onDelete?: (role: Role) => void
  pagination?: {
    pageIndex: number
    pageCount: number
    onPageChange: (index: number) => void
  }
}

export const RoleTable: React.FC<RoleTableProps> = ({
  data,
  onEdit,
  onDelete,
  pagination

}) => {
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "roleName",
      header: "Role Name",
    },
    {
      accessorKey: "normalizedName",
      header: "Normalized",
    },
    {
      accessorKey: "createdTime",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdTime).toLocaleString(),
    },
    {
      accessorKey: "lastUpdatedTime",
      header: "Updated At",
      cell: ({ row }) =>
        new Date(row.original.lastUpdatedTime).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
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
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
                No roles found.
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
  )
}
