"use client";

import { formatDate } from "@/lib/utils";
import { Session } from "@prisma/client";
import { SessionRowActions } from "./row-actions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableFilterField } from "@/types/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export const filterFields: DataTableFilterField<Session>[] = [
  {
    id: "location",
    label: "Location",
    placeholder: "Filter locations...",
  },
];

export const columns: ColumnDef<Session>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ipAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate font-medium">
          {row.getValue("ipAddress")}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="location" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate">
          {row.getValue("location")}
        </div>
      );
    },
  },
  {
    accessorKey: "userAgent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Agent" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[31.25rem] truncate">
          {row.getValue("userAgent")}
        </div>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires At" />
    ),
    cell: ({ cell }) =>
      formatDate(cell.getValue() as Date, {
        hour: "numeric",
        minute: "numeric",
      }),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) =>
      formatDate(cell.getValue() as Date, {
        hour: "numeric",
        minute: "numeric",
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <SessionRowActions
        userId={row.original.userId}
        sessionId={row.original.id}
      />
    ),
    size: 40,
  },
];
