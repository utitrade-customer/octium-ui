import { CurrencyIcon } from 'components/CurrencyIcon';
import { format } from 'currency-formatter';
import formatDate from 'date-fns/format';
import { setDocumentTitle } from 'helpers';
import _toLower from 'lodash/toLower';
import _toNumber from 'lodash/toNumber';
import _toUpper from 'lodash/toUpper';
import { currenciesFetch } from 'modules';
import { selectTransactionList, transactionsListFetch } from 'modules/plugins/transactions';
import { minus } from 'number-precision';
import React from 'react';
import { useIntl } from 'react-intl';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { usePagination, useTable } from 'react-table';
import EmptySVG from './empty.svg';
import WalletSVG from './wallet.svg';
import { CONFIG } from '../../../../constants';

interface TransactionTableProps {
	columns: any;
	data: any;
	total: number;
}
const NUMBER_ITEM_DISPLAY = 20;

const TransactionTable: React.FC<TransactionTableProps> = (props: TransactionTableProps) => {
	const { columns, data, total } = props;
	const intl = useIntl();
	const dispatch = useDispatch();
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
		dispatch(transactionsListFetch({ page: selectedItem.selected, limit: NUMBER_ITEM_DISPLAY }));
	};
	// render the UI for your table
	return (
		<div className="td-pg-transactions__table">
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
						<p>{intl.formatMessage({ id: 'page.transaction.table.empty' })}</p>
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
				pageCount={total / NUMBER_ITEM_DISPLAY}
				marginPagesDisplayed={2}
				pageRangeDisplayed={5}
				onPageChange={handlePageClick}
				containerClassName={'td-pg-wallet__pagination'}
				activeClassName={'active'}
				forcePage={pageIndex}
			/>
		</div>
	);
};

export const TransactionListScreen = () => {
	const PRIMARY_CURRENCY = 'udon';
	const USD_CURRENCY = 'usd';

	const intl = useIntl();

	setDocumentTitle(intl.formatMessage({ id: 'page.transaction.documentTitle' }));
	// selectors
	const transactions = useSelector(selectTransactionList);

	// dispatch
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(transactionsListFetch({ limit: NUMBER_ITEM_DISPLAY, page: 0 }));
		dispatch(currenciesFetch());
	}, []);

	const formatStatus = (state: string) => {
		const fail = require('../../../../assets/status/fail.svg');
		const success = require('../../../../assets/status/success.svg');
		const statusMapping = {
			success: <img src={success} alt="" />,
			fail: <img src={fail} alt="" />,
		};
		return statusMapping[state];
	};

	const columns = React.useMemo(
		() => [
			{ Header: intl.formatMessage({ id: 'page.transaction.table.time' }), accessor: 'timeStamp' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.hash' }), accessor: 'hash' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.from' }), accessor: 'from' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.currency' }), accessor: 'currency' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.amount' }), accessor: 'amount' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.price' }), accessor: 'value' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.total' }), accessor: 'uTotal' },
			{ Header: intl.formatMessage({ id: 'page.transaction.table.status' }), accessor: 'success' },
		],
		[],
	);

	const bscscanAddressLink = (address: string) => {
		return `https://bscscan.com/address/${address}`;
	};

	const bscscanHashLink = (hash: string) => {
		return `https://bscscan.com/tx/${hash}`;
	};

	const list =
		transactions && transactions[1].length > 0
			? [...transactions[1]].map(d => ({
					...d,
					currency: (
						<span>
							{d.currency} {'('}${format(_toNumber(d.usdPrice), { code: 'usd' })}
							{')'}
						</span>
					),
					hash: (
						<a href={bscscanHashLink(d.hash)} target="_blank" rel="noopener noreferrer">{`${d.hash.slice(
							0,
							15,
						)}...`}</a>
					),
					from: (
						<a href={bscscanAddressLink(d.from)} target="_blank" rel="noopener noreferrer">{`${d.from.slice(
							0,
							15,
						)}...`}</a>
					),
					uTotal: <span>{format(_toNumber(d.uTotal), { code: '', precision: 0 })}</span>,
					amount: <span>{format(_toNumber(d.amount), { code: '', precision: 6 })}</span>,
					value: <span>{_toNumber(d.value).toFixed(7)}</span>,
					success: formatStatus(
						d.success
							? intl.formatMessage({ id: 'page.transaction.table.status.success' })
							: intl.formatMessage({ id: 'page.transaction.table.status.fail' }),
					),
					timeStamp: formatDate(
						new Date(new Date(_toNumber(d.timeStamp) * 1000).toLocaleDateString('en-US')),
						'dd/MM/yyyy',
					),
			  }))
			: [];

	return (
		<div className="td-pg-transactions container-fluid">
			<div className="row td-pg-transactions__header">
				<div className="col-12">
					<h1 className="ml-2 mb-3">{intl.formatMessage({ id: 'page.transaction.list.title' })}</h1>
				</div>
				<div className="col-12">
					<div className="td-pg-transactions__header__container">
						<div
							className="td-pg-transactions__header__container__value-box d-flex flex-row align-items-center mr-5"
							style={{ backgroundColor: 'var(--thin-blue)' }}
						>
							<div>
								<CurrencyIcon
									style={{ borderRadius: '50%' }}
									width="50px"
									height="50px"
									currency_id={_toLower(USD_CURRENCY)}
									alt={USD_CURRENCY}
								/>
							</div>
							<div className="ml-3">
								<div className="td-pg-transactions__header__container__total">
									{intl.formatMessage({ id: 'page.transaction.list.totalSale' })}
								</div>
								<div>
									<span className="td-pg-transactions__header__container__value">
										{transactions[2]
											? format(transactions[2].udonTotal, {
													code: '',
													precision: 2,
											  })
											: '0.00'}
									</span>
									<span className="td-pg-transactions__header__container__value-sign ml-3">
										{_toUpper(USD_CURRENCY)}
									</span>
								</div>
							</div>
						</div>
						<div
							className="td-pg-transactions__header__container__value-box d-flex flex-row align-items-center mr-5"
							style={{ backgroundColor: 'var(--thin-blue)' }}
						>
							<div>
								<CurrencyIcon
									width="50px"
									height="50px"
									style={{ borderRadius: '50%' }}
									currency_id={_toLower(PRIMARY_CURRENCY)}
									alt={PRIMARY_CURRENCY}
								/>
							</div>
							<div className="ml-3">
								<div className="td-pg-transactions__header__container__total">
									{intl.formatMessage({ id: 'page.transaction.list.totalRemain' })}
								</div>
								<div>
									<span className="td-pg-transactions__header__container__value">
										{format(minus(CONFIG.udonTotalNumber, transactions[2].udonTotal), {
											code: '',
											precision: 0,
										})}
									</span>
									<span className="td-pg-transactions__header__container__value-sign ml-3">
										{_toUpper(PRIMARY_CURRENCY)}
									</span>
								</div>
							</div>
						</div>
						<div
							className="td-pg-transactions__header__container__value-box d-flex flex-row align-items-center mr-5"
							style={{ backgroundColor: 'var(--thin-blue)' }}
						>
							<div>
								<img width="50px" height="50px" src={WalletSVG} alt="wallet" />
							</div>
							<div className="ml-3">
								<div className="td-pg-transactions__header__container__total">
									{intl.formatMessage({ id: 'page.transaction.list.presale' })}
								</div>
								<div>
									<span className="td-pg-transactions__header__container__value">{CONFIG.address}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row mt-3 td-pg-transactions__body">
				<div className="col-12">
					<TransactionTable data={list} columns={columns} total={transactions[0].totalPage} />
				</div>
			</div>
		</div>
	);
};
