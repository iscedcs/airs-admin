'use client';

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	getFilteredRowModel,
	ColumnFiltersState,
	VisibilityState,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '../button';
import React from 'react';
import { Input } from '../input';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../dropdown-menu';
import { searchIcon } from '@/lib/icons';
import { DataTablePagination } from './data-table-pagination';

export function DataTable<TData, TValue>({
	columns,
	data,
	showSearch,
	searchWith,
	searchWithPlaceholder,
	showColumns,
	showPagination,
	showSelected,
	showRowsPerPage,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageIndex: 0, //custom initial page index
				pageSize: 15, //custom default page size
			},
		},
	});

	return (
		<div>
			{showSearch && searchWith && (
				<div className='flex items-center py-4 text-title2'>
					<div className='relative flex  items-center w-full'>
						<div className='h-6 w-6 left-2 opacity-60 shrink-0 absolute'>
							{searchIcon}
						</div>
						<Input
							placeholder={
								searchWithPlaceholder || 'Search Here'
							}
							value={
								(table
									.getColumn(searchWith)
									?.getFilterValue() as string) ?? ''
							}
							onChange={(event) =>
								table
									.getColumn(searchWith)
									?.setFilterValue(
										event.target.value
									)
							}
							className='pl-10'
						/>
					</div>
					{showColumns && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='outline'
									className='ml-5'
								>
									Filter
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								{table
									.getAllColumns()
									.filter((column) =>
										column.getCanHide()
									)
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className='capitalize'
												checked={column.getIsVisible()}
												onCheckedChange={(
													value
												) =>
													column.toggleVisibility(
														!!value
													)
												}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			)}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header
															.column
															.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() &&
										'selected'
									}
								>
									{row
										.getVisibleCells()
										.map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column
														.columnDef
														.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{showPagination && (
				<div className='flex items-center py-4 mb-20 md:mb-0'>
					<DataTablePagination
						showSelected={showSelected}
						rowsPerPage={showRowsPerPage}
						table={table}
					/>
				</div>
			)}
		</div>
	);
}
