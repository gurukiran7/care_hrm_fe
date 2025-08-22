import { SearchIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";
import type { Table } from "@tanstack/react-table";
export interface Status {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statusColumn: string;
  statuses: Status[];
  filterColumn?: string;
}

export default function DataTableToolbar<TData>({
  table,
  statusColumn,
  statuses,
  filterColumn = "name",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const statusCol = table.getColumn(statusColumn);
  const selectedValues = new Set(statusCol?.getFilterValue() as string[]);

  const FilterBadges = () => {
    if (selectedValues.size === 0) return null;
    return (
      <div className="flex flex-row gap-2 mt-2 mx-2">
        {statuses
          .filter((status) => selectedValues.has(status.value))
          .map((status) => (
            <Badge
              key={status.value}
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                selectedValues.delete(status.value);
                const filterValues = Array.from(selectedValues);
                statusCol?.setFilterValue(
                  filterValues.length ? filterValues : undefined
                );
              }}
            >
              {status.label}
              <Separator orientation="vertical" className="mx-1 h-4" />
              <span className="ml-1">×</span>
            </Badge>
          ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 -mt-2">
        <div className="relative flex-1 min-w-72 max-w-96 ml-2">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="search-by-filename"
            name={filterColumn}
            placeholder={`Search by ${filterColumn.charAt(0).toUpperCase() + filterColumn.slice(1)}...`}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="pointer-events-auto pl-10"
            data-cy="search-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="text-sm text-secondary-800"
                data-cy="files-filter-button"
              >
                <span className="flex flex-row items-center gap-1">
                  <span>Status</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {statuses.map((status) => {
                const isSelected = selectedValues.has(status.value);
                return (
                  <DropdownMenuItem
                    key={status.value}
                    className={cn("text-primary-900", isSelected && "bg-gray-100")}
                    onClick={() => {
                      if (isSelected) {
                        selectedValues.delete(status.value);
                      } else {
                        selectedValues.add(status.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      statusCol?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    {status.icon && (
                      <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{status.label}</span>
                    {isSelected && (
                      <span className="ml-auto text-primary-600 font-bold">✓</span>
                    )}
                  </DropdownMenuItem>
                );
              })}
              {selectedValues.size > 0 && (
                <>
                  <Separator />
                  <DropdownMenuItem
                    onClick={() => statusCol?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8"
          >
            Reset
          </Button>
        )}
      </div>
      <FilterBadges />
    </div>
  );
}