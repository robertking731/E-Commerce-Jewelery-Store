"use client"

import * as React from "react"
import Link from "next/link"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types"
import type { Table } from "@tanstack/react-table"

import { cn, translateFilterNamesToPolish } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Icons } from "@/components/icons"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: DataTableFilterableColumn<TData>[]
  searchableColumns?: DataTableSearchableColumn<TData>[]
  newRowLink?: string
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  newRowLink,
  deleteRowsAction,
}: Readonly<DataTableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={`Filtruj ${translateFilterNamesToPolish(column.title)}..`}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className="h-8 w-[150px] lg:w-[250px]"
                />
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFacetedFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.title}
                  options={column.options}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Zresetuj filtry"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Zresetuj
            <Icons.close className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {deleteRowsAction && table.getSelectedRowModel().rows.length > 0 ? (
          <Button
            aria-label="Usuń zaznaczone pozycje"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={(event) => {
              startTransition(() => {
                table.toggleAllPageRowsSelected(false)
                deleteRowsAction(event)
              })
            }}
            disabled={isPending}
          >
            <Icons.delete className="mr-2 size-4" aria-hidden="true" />
            Usuń
          </Button>
        ) : newRowLink ? (
          <Link aria-label="Dodaj pozycję" href={newRowLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "h-8",
                })
              )}
            >
              <Icons.plusCircle className="mr-2 size-4" aria-hidden="true" />
              Dodaj
            </div>
          </Link>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
