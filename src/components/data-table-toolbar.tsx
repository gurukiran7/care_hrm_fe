"use client";
import type { Table } from "@tanstack/react-table";
import { Input } from "../components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { CheckIcon, PlusCircleIcon, X } from "lucide-react";
import { cn } from "../lib/utils";

export interface Status{
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
  const columns = table.getColumn(statusColumn); 
  const selectedValues = new Set(columns?.getFilterValue() as string[]);

  return (
    <div className="ml-1 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Search by ${filterColumn.charAt(0).toUpperCase() + filterColumn.slice(1)}...`}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn(statusColumn) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Status
                {selectedValues?.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-2" />
                    <Badge
                      variant={"secondary"}
                      className="rounded-sm h-4 px-1 font-normal lg:hidden"
                    >
                      {selectedValues.size}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                      {selectedValues.size > 2 ? (
                        <Badge
                          variant={"secondary"}
                          className="rounded-sm px-1 font-normal"
                        >
                          {selectedValues.size} selected
                        </Badge>
                      ) : (
                        statuses
                          .filter((status) => selectedValues.has(status.value))
                          .map((status) => (
                            <Badge
                              variant={"secondary"}
                              key={status.value}
                              className="rounded-sm ml-2 px-1 font-normal"
                            >
                              {status.label}
                            </Badge>
                          ))
                      )}
                    </div>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-40">
              <Command>
                <CommandInput placeholder={"Status"} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => {
                      const isSelected = selectedValues.has(status.value);
                      return (
                        <CommandItem
                          key={status.value}
                          onSelect={() => {
                            if (isSelected) {
                              selectedValues.delete(status.value);
                            } else {
                              selectedValues.add(status.value);
                            }
                            const filterValues = Array.from(selectedValues);
                            columns?.setFilterValue(
                              filterValues.length ? filterValues : undefined
                            );
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <CheckIcon className={cn("h-4 w-4")} />
                          </div>
                          {status.icon && (
                            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{status.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  {selectedValues.size > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => columns?.setFilterValue(undefined)}
                          className="justify-center text-center"
                        >
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8"
          >
            Reset
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
