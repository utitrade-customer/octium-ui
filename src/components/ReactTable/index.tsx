import * as React from 'react';
import { usePagination, useTable } from 'react-table';
import EmptySVG from './empty.svg';
import ReactPaginate from 'react-paginate';
interface ReactTableProps {
	columns: any;
	data: any;
	onGoToPage?: (index: number) => void;
	pageCount?: number;
	index?: number;
}
const NUMBER_ITEM_DISPLAY = 20;

export const ReactTable: React.FC<ReactTableProps> = (props: ReactTableProps) => {
	const { columns, data, onGoToPage, index, pageCount } = props;
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		state: { pageIndex },
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: NUMBER_ITEM_DISPLAY },
			autoResetPage: false,
		},
		usePagination,
	);

	const handlePageClick = (selectedItem: { selected: number }) => {
		gotoPage(selectedItem.selected);
		onGoToPage && onGoToPage(selectedItem.selected);
	};
	// render the UI for your table
	return (
		<div className="td-pg-wallet">
			<table {...getTableProps()} style={{ position: 'relative' }}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th {...column.getHeaderProps()}>
									<span style={{ fontWeight: 'normal' }}>{column.render('Header')}</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				{[...page].length === 0 ? (
					<div className="text-center empty">
						<img className="text-center" width="100px" src={EmptySVG} alt="empty" />
						<br />
						<p>No Data</p>
					</div>
				) : (
					<tbody {...getTableBodyProps()}>
						{page.map(row => {
							prepareRow(row);

							return (
								<tr {...row.getRowProps()}>
									{row.cells.map(cell => {
										return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
									})}
								</tr>
							);
						})}
					</tbody>
				)}
			</table>
			<ReactPaginate
				previousLabel={'<'}
				nextLabel={'>'}
				breakLabel={'...'}
				breakClassName={'break-me'}
				pageCount={pageCount || data.length / NUMBER_ITEM_DISPLAY}
				marginPagesDisplayed={2}
				pageRangeDisplayed={5}
				onPageChange={handlePageClick}
				containerClassName={'td-pg-wallet__pagination'}
				activeClassName={'active'}
				forcePage={index || pageIndex}
			/>
		</div>
	);
};
