import classnames from 'classnames';
import { FilterElement, FilterElementForQueryP2pHistory } from 'components/FilterElementOrdersHistory';
import {
	currenciesFetch,
	historyAllFetch,
	IHistoryBalance,
	resetHistory,
	selectCurrencies,
	selectHistory,
	selectHistoryLoading,
	selectMarkets,
	selectWallets,
	WalletHistoryList,
	THistoryBalanceType,
} from 'modules';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { localeDate, preciseData, setDocumentTitle } from '../../helpers';
// import { Pagination } from './../../components/PaginationOrdersHistory/index';
import ReactPaginate from 'react-paginate';
import {
	selectBankDepositHistoryList,
	selectBankDepositHistoryListLoading,
	selectBankWithdrawHistoryList,
	selectBankWithdrawHistoryListLoading,
} from 'modules/plugins/fiat/bank/selectors';
import { bankDepositHistoryListFetch } from 'modules/plugins/fiat/bank/actions/bankDepositActions';
import { BankDeposit, BankWithdraw } from 'modules/plugins/fiat/bank/types';
import { bankWithdrawHistoryListFetch } from 'modules/plugins/fiat/bank/actions/bankWithdrawActions';
import { useP2PHistoryBalances } from 'plugins/P2p/hooks';

const NUMBER_ITEM_DISPLAY = 15;

export interface IQueryForFunding {
	startedAt?: Date;
	endedAt?: Date;
	type?: THistoryBalanceType;
}

export const HistoryScreen = () => {
	const intl = useIntl();
	const [tab, setTab] = useState('deposits');
	const dispatch = useDispatch();
	const [queryForFunding, setQueryForFunding] = useState<IQueryForFunding>({});

	const [pageIndex, setPageIndex] = useState(1);
	// const [maxPage, setMaxPage] = useState(1);
	const [paginationState, setPaginationState] = useState(0);

	const currencies = useSelector(selectCurrencies);
	const marketsData = useSelector(selectMarkets);
	const wallets = useSelector(selectWallets);
	const list = useSelector(selectHistory);
	const fiatBankDepositHistoryList = useSelector(selectBankDepositHistoryList);
	const fiatBankWithdrawHistoryList = useSelector(selectBankWithdrawHistoryList);

	const fetching = useSelector(selectHistoryLoading);
	const fiatBankDepositHistoryListFetching = useSelector(selectBankDepositHistoryListLoading);
	const fiatBankWithdrawHistoryListFetching = useSelector(selectBankWithdrawHistoryListLoading);

	const { isLoading: historyBalanceLoading, historyBalances } = useP2PHistoryBalances({
		page: paginationState + 1,
		sort: 'createdAt:DESC',
		limit: NUMBER_ITEM_DISPLAY,
		...queryForFunding,
	});
	const [listData, setListData] = useState(list);

	useEffect(() => {
		setDocumentTitle('History');

		if (tab !== 'fiatDeposit' && tab !== 'fiatWithdraw' && tab !== 'funding') {
			dispatch(historyAllFetch({ page: 1, type: tab, limit: 25 }));
		}
		if (currencies.length === 0) {
			dispatch(currenciesFetch());
		}
		if (tab === 'fiatDeposit') {
			dispatch(bankDepositHistoryListFetch());
		}
		if (tab === 'fiatWithdraw') {
			dispatch(bankWithdrawHistoryListFetch());
		}
	}, [dispatch, currencies.length, tab]);

	useEffect(() => {
		if (currencies.length === 0) {
			dispatch(currenciesFetch());
		}
	}, [currencies, dispatch]);

	useEffect(() => {
		// const newMaxPage = Math.ceil(list.length / limitElem) === 0 ? 1 : Math.ceil(list.length / limitElem);
		// setMaxPage(Math.ceil(newMaxPage));
		setListData(list);
	}, [list]);

	const tabMapping = ['deposits', 'withdraws', 'trades', 'fiatDeposit', 'fiatWithdraw', 'funding'];
	const limitElem = 20;
	const onCurrentTabChange = (index: number) => {
		if (tabMapping[index] !== tab) {
			dispatch(resetHistory());

			if (tabMapping[index] !== 'fiatDeposit' && tabMapping[index] !== 'fiatWithdraw' && tabMapping[index] !== 'funding') {
				dispatch(historyAllFetch({ page: 1, type: tabMapping[index], limit: 25 }));
			}
			setPageIndex(1);
			setTab(tabMapping[index]);
		}
	};
	//-----------------           ------------------//
	const renderTabsLabel = () => {
		const labelTabs = [
			{
				className:
					tab === 'deposits'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.history.deposit' }),
			},
			{
				className:
					tab === 'withdraws'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.history.withdraw' }),
			},
			{
				className:
					tab === 'trades'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: intl.formatMessage({ id: 'page.body.history.trade' }),
			},
			{
				className:
					tab === 'fiatDeposit'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: 'Fiat Deposit',
			},
			{
				className:
					tab === 'fiatWithdraw'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: 'Fiat Withdraw',
			},

			{
				className:
					tab === 'funding'
						? 'history-screen__tabs__label__item history-screen__tabs__label__item--active'
						: 'history-screen__tabs__label__item',
				label: 'Funding',
			},
		];

		return (
			<React.Fragment>
				{labelTabs.map((label, index) => {
					return (
						<div className={label.className} onClick={() => onCurrentTabChange(index)} key={index}>
							{label.label}
						</div>
					);
				})}
			</React.Fragment>
		);
	};
	//-----------------           ------------------//
	const renderHeadersTable = (type: string) => {
		const headersTable = () => {
			switch (type) {
				case 'deposits':
					return [
						intl.formatMessage({ id: 'page.body.history.deposit.header.txid' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.date' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.currency' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.amount' }),
						intl.formatMessage({ id: 'page.body.history.deposit.header.status' }),
					];
				case 'withdraws':
					return [
						intl.formatMessage({ id: 'page.body.history.withdraw.header.address' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.date' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.currency' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.amount' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.fee' }),
						intl.formatMessage({ id: 'page.body.history.withdraw.header.status' }),
					];
				case 'trades':
					return [
						intl.formatMessage({ id: 'page.body.history.trade.header.date' }),
						intl.formatMessage({ id: 'page.body.history.trade.header.side' }),
						intl.formatMessage({ id: 'page.body.history.trade.header.market' }),
						intl.formatMessage({ id: 'page.body.history.trade.header.price' }),
						intl.formatMessage({ id: 'page.body.history.trade.header.amount' }),
						intl.formatMessage({ id: 'page.body.history.trade.header.total' }),
					];
				case 'fiatDeposit':
					return ['Date', 'Txid Address', 'Status', 'Amount'];
				case 'fiatWithdraw':
					return ['Date', 'Txid Address', 'Status', 'Amount'];

				case 'funding':
					return ['Date', 'Currency', 'Type', 'Reference', '-', '+'];
				default:
					return [];
			}
		};

		return headersTable().map((headerTable, index) => {
			return (
				<th scope="col" key={index}>
					{headerTable}
				</th>
			);
		});
	};

	const renderTableRow = (type: string, item, index) => {
		const getBlockchainLink = (currency: string, txid: string, rid?: string) => {
			const currencyInfo = wallets && wallets.find(wallet => wallet.currency === currency);
			if (currencyInfo) {
				if (txid && currencyInfo.explorerTransaction) {
					return currencyInfo.explorerTransaction.replace('#{txid}', txid);
				}
				if (rid && currencyInfo.explorerAddress) {
					return currencyInfo.explorerAddress.replace('#{address}', rid);
				}
			}

			return '';
		};
		switch (type) {
			case 'deposits': {
				const { amount, confirmations, created_at, currency, txid } = item;
				const blockchainLink = getBlockchainLink(currency, txid);
				const wallet = wallets.find(obj => obj.currency === currency);
				const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
				const minConfirmations = itemCurrency && itemCurrency.min_confirmations;

				const stateValue =
					item.state === 'submitted' && confirmations !== undefined && minConfirmations !== undefined
						? `${confirmations}/${minConfirmations}`
						: intl.formatMessage({ id: `page.body.history.deposit.content.status.${item.state}` });
				const classname = classnames({
					'history-screen__tabs__content__table__body__item-table--succeed':
						stateValue === 'Wait confirmation' || stateValue === 'Succeed',
					'history-screen__tabs__content__table__body__item-table--failed':
						stateValue === 'Rejected by Admin' || stateValue === 'Rejected by System',
				});

				return (
					<tr key={index}>
						<td>
							<a href={blockchainLink} target="_blank" rel="noopener noreferrer">
								{txid}
							</a>
						</td>
						<td>{localeDate(created_at, 'fullDate')}</td>
						<td>{currency && currency.toUpperCase()}</td>
						<td>{wallet && preciseData(amount, wallet.fixed)}</td>
						<td className={classname}>{stateValue}</td>
					</tr>
				);
			}
			case 'withdraws': {
				const { txid, created_at, currency, amount, fee, rid } = item;
				const state = intl.formatMessage({ id: `page.body.history.withdraw.content.status.${item.state}` });
				const blockchainLink = getBlockchainLink(currency, txid, rid);
				const wallet = wallets.find(obj => obj.currency === currency);

				const classname = classnames({
					'history-screen__tabs__content__table__body__item-table--succeed': state === 'Succeed',
					'history-screen__tabs__content__table__body__item-table--failed': state === 'Failed',
					'history-screen__tabs__content__table__body__item-table--wait': state === 'Waiting',
				});
				const stateString = state === 'Waiting' || state === 'Confirming' ? 'Checking...' : state;

				return (
					<tr key={index}>
						<td>
							<a href={blockchainLink} target="_blank" rel="noopener noreferrer">
								{txid || rid}
							</a>
						</td>
						<td>{localeDate(created_at, 'fullDate')}</td>
						<td>{currency && currency.toUpperCase()}</td>
						<td>{wallet && preciseData(amount, wallet.fixed)}</td>
						<td>{fee}</td>
						<td className={classname}>{stateString}</td>
					</tr>
				);
			}
			case 'trades': {
				const { created_at, side, market, price, amount, total, taker_type } = item;

				const marketToDisplay = marketsData.find(m => m.id === market) || {
					name: '',
					price_precision: 0,
					amount_precision: 0,
				};
				const marketName = marketToDisplay ? marketToDisplay.name : market;

				const tdSide = () => {
					const textSide = side || taker_type;
					const classname = classnames({
						'history-screen__tabs__content__table__body__item-table--succeed': textSide === 'buy',
						'history-screen__tabs__content__table__body__item-table--failed': textSide === 'sell',
					});

					return (
						<td className={classname}>
							{intl.formatMessage({ id: `page.body.history.trade.content.side.${textSide}` })}
						</td>
					);
				};

				return (
					<tr key={index}>
						<td>{localeDate(created_at, 'fullDate')}</td>
						{tdSide()}
						<td>{marketName}</td>
						<td>{price}</td>
						<td>{amount}</td>
						<td>{total}</td>
					</tr>
				);
			}
			case 'fiatDeposit': {
				const fiatDepositItem: BankDeposit = item;
				const currency = currencies.find(cur => cur.id.toLowerCase() === fiatDepositItem.currency_id.toLocaleLowerCase());

				const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
					const process = require('../../assets/status/wait.svg');
					const fail = require('../../assets/status/fail.svg');
					const success = require('../../assets/status/success.svg');
					const statusMapping = {
						succeed: <img src={success} alt="" />,
						failed: <img src={fail} alt="" />,
						accepted: <img src={process} alt="" />,
						collected: <img src={success} alt="" />,
						canceled: <img src={fail} alt="" />,
						rejected: <img src={fail} alt="" />,
						pending: <img src={process} alt="" />,
						prepared: <img src={process} alt="" />,
						fee_processing: <img src={process} alt="" />,
						skipped: <img src={success} alt="" />,
						submitted:
							confirmations !== undefined && minConfirmations !== undefined ? (
								`${confirmations}/${minConfirmations}`
							) : (
								<img src={process} alt="" />
							),
					};

					return statusMapping[tx];
				};

				return (
					<tr key={index}>
						<td>{localeDate(fiatDepositItem.created_at, 'fullDate')}</td>
						<td>{fiatDepositItem.txid}</td>
						<td>{formatTxState(fiatDepositItem.state)}</td>
						<td>{Number(fiatDepositItem.amount).toFixed(currency?.precision)}</td>
					</tr>
				);
			}
			case 'fiatWithdraw': {
				const fiatWithdrawItem: BankWithdraw = item;
				const currency = currencies.find(
					cur => cur.id.toLowerCase() === fiatWithdrawItem.currency_id.toLocaleLowerCase(),
				);

				const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
					const process = require('../../assets/status/wait.svg');
					const fail = require('../../assets/status/fail.svg');
					const success = require('../../assets/status/success.svg');
					const statusMapping = {
						succeed: <img src={success} alt="" />,
						failed: <img src={fail} alt="" />,
						accepted: <img src={process} alt="" />,
						collected: <img src={success} alt="" />,
						canceled: <img src={fail} alt="" />,
						rejected: <img src={fail} alt="" />,
						pending: <img src={process} alt="" />,
						prepared: <img src={process} alt="" />,
						fee_processing: <img src={process} alt="" />,
						skipped: <img src={success} alt="" />,
						submitted:
							confirmations !== undefined && minConfirmations !== undefined ? (
								`${confirmations}/${minConfirmations}`
							) : (
								<img src={process} alt="" />
							),
					};

					return statusMapping[tx];
				};

				return (
					<tr key={index}>
						<td>{localeDate(fiatWithdrawItem.created_at, 'fullDate')}</td>
						<td>{fiatWithdrawItem.txid}</td>
						<td>{formatTxState(fiatWithdrawItem.state)}</td>
						<td>{Number(fiatWithdrawItem.amount).toFixed(currency?.precision)}</td>
					</tr>
				);
			}

			case 'funding': {
				const itemTmp: IHistoryBalance = item;

				return (
					<tr key={itemTmp.id}>
						<td>{localeDate(itemTmp.createdAt, 'fullDate')}</td>
						<td>{itemTmp.currencyId.toUpperCase()}</td>
						<td>{itemTmp.referenceType}</td>
						<td>{itemTmp.referenceId}</td>
						<td>{itemTmp.debit}</td>
						<td>{itemTmp.credit}</td>
					</tr>
				);
			}
			default: {
				return [];
			}
		}
	};

	const renderTable = () => {
		const indexElemStart = (pageIndex - 1) * limitElem;
		const indexElemStop = (pageIndex - 1) * limitElem + limitElem;
		const bodyTable = () => {
			if (tab === 'fiatDeposit') {
				return fiatBankDepositHistoryList
					.slice(paginationState * NUMBER_ITEM_DISPLAY, paginationState * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY)
					.slice(indexElemStart, indexElemStop)
					.map((item, index) => {
						return renderTableRow(tab, item, index);
					});
			}

			if (tab === 'fiatWithdraw') {
				return fiatBankWithdrawHistoryList
					.slice(paginationState * NUMBER_ITEM_DISPLAY, paginationState * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY)
					.slice(indexElemStart, indexElemStop)
					.map((item, index) => {
						return renderTableRow(tab, item, index);
					});
			}

			if (tab === 'funding') {
				return historyBalances.data.map((item, index) => {
					return renderTableRow(tab, item, index);
				});
			}

			return listData
				.slice(paginationState * NUMBER_ITEM_DISPLAY, paginationState * NUMBER_ITEM_DISPLAY + NUMBER_ITEM_DISPLAY)
				.slice(indexElemStart, indexElemStop)
				.map((item, index) => {
					return renderTableRow(tab, item, index);
				});
		};

		const emptyData = () => {
			if (tab === 'fiatDeposit') {
				return (
					fiatBankDepositHistoryList.length === 0 ?? (
						<div className="text-center history-screen__tabs__content__table pt-5 pb-5">
							Empty data .
							<br /> Please try on next page or prev page{' '}
						</div>
					)
				);
			}
			if (tab === 'fiatWithdraw') {
				return (
					fiatBankDepositHistoryList.length === 0 ?? (
						<div className="text-center history-screen__tabs__content__table pt-5 pb-5">
							Empty data .
							<br /> Please try on next page or prev page{' '}
						</div>
					)
				);
			}
			if (tab === 'funding') {
				return (
					historyBalances.data.length === 0 ?? (
						<div className="text-center history-screen__tabs__content__table pt-5 pb-5">
							Empty data .
							<br /> Please try on next page or prev page{' '}
						</div>
					)
				);
			}
			return listData.length === 0 ? (
				<div className="text-center history-screen__tabs__content__table pt-5 pb-5">
					Empty data .
					<br /> Please try on next page or prev page{' '}
				</div>
			) : (
				''
			);
		};

		if (tab === 'fiatDeposit') {
			return fiatBankDepositHistoryListFetching ? (
				<div className="d-flex justify-content-center mt-5 mb-5">
					<div className="spinner-border text-success spinner-loadding" role="status"></div>
				</div>
			) : (
				<div>
					<table className="history-screen__tabs__content__table">
						<thead className=" history-screen__tabs__content__table__header">
							<tr>{renderHeadersTable(tab)}</tr>
						</thead>
						<tbody className="history-screen__tabs__content__table__body">{bodyTable()}</tbody>
					</table>
					{emptyData()}
				</div>
			);
		}
		if (tab === 'fiatWithdraw') {
			return fiatBankWithdrawHistoryListFetching ? (
				<div className="d-flex justify-content-center mt-5 mb-5">
					<div className="spinner-border text-success spinner-loadding" role="status"></div>
				</div>
			) : (
				<div>
					<table className="history-screen__tabs__content__table">
						<thead className=" history-screen__tabs__content__table__header">
							<tr>{renderHeadersTable(tab)}</tr>
						</thead>
						<tbody className="history-screen__tabs__content__table__body">{bodyTable()}</tbody>
					</table>
					{emptyData()}
				</div>
			);
		}

		if (tab === 'funding') {
			return historyBalanceLoading ? (
				<div className="d-flex justify-content-center mt-5 mb-5">
					<div className="spinner-border text-success spinner-loadding" role="status"></div>
				</div>
			) : (
				<div>
					<table className="history-screen__tabs__content__table">
						<thead className=" history-screen__tabs__content__table__header">
							<tr>{renderHeadersTable(tab)}</tr>
						</thead>
						<tbody className="history-screen__tabs__content__table__body">{bodyTable()}</tbody>
					</table>
					{emptyData()}
				</div>
			);
		}
		return fetching ? (
			<div className="d-flex justify-content-center mt-5 mb-5">
				<div className="spinner-border text-success spinner-loadding" role="status"></div>
			</div>
		) : (
			<div>
				<table className="history-screen__tabs__content__table">
					<thead className=" history-screen__tabs__content__table__header">
						<tr>{renderHeadersTable(tab)}</tr>
					</thead>
					<tbody className="history-screen__tabs__content__table__body">{bodyTable()}</tbody>
				</table>
				{emptyData()}
			</div>
		);
	};
	//--------------------------render pagination--------------------------//
	// const onClickToPage = (pageIndexTmp: number) => {
	// 	setPageIndex(pageIndexTmp);
	// };
	const handlePageClick = (selectedItem: { selected: number }) => {
		setPaginationState(selectedItem.selected);
	};

	const renderPagination = () => {
		let pageCount: number = list.length / NUMBER_ITEM_DISPLAY;

		if (tab === 'fiatDeposit') {
			pageCount = (tab === 'fiatDeposit' ? fiatBankDepositHistoryList.length : list.length) / NUMBER_ITEM_DISPLAY;
		}

		if (tab === 'funding') {
			pageCount = historyBalances.meta.pageCount;
		}

		return (
			<ReactPaginate
				previousLabel={'<'}
				nextLabel={'>'}
				breakLabel={'...'}
				breakClassName={'break-me'}
				pageCount={pageCount}
				marginPagesDisplayed={2}
				pageRangeDisplayed={5}
				onPageChange={handlePageClick}
				containerClassName={'pagination'}
				activeClassName={'active'}
				forcePage={paginationState}
			/>
		);
	};
	//-----------------      render fileter bar     ------------------//
	const renderFilterBar = () => {
		const onFilter = (dataFilter: WalletHistoryList) => {
			setPageIndex(1);
			setListData(dataFilter);
			// const newMaxPage = Math.ceil(dataFilter.length / limitElem) === 0 ? 1 : Math.ceil(dataFilter.length / limitElem);
			// setMaxPage(newMaxPage);
		};

		const onRestFilter = () => {
			setListData(list);
			setPageIndex(1);
			// const newMaxPage = Math.ceil(list.length / limitElem) === 0 ? 1 : Math.ceil(list.length / limitElem);
			// setMaxPage(newMaxPage);
		};

		if (tab === 'trades') {
			return <FilterElement onFilter={onFilter} onRestFilter={onRestFilter} data={list} />;
		}

		if (tab === 'funding') {
			return (
				<FilterElementForQueryP2pHistory
					setPage={setPaginationState}
					queryForFunding={queryForFunding}
					setQueryForFunding={setQueryForFunding}
				/>
			);
		}

		return '';
	};

	return (
		<div className="history-screen history-screen-container">
			<div className="history-screen__title">Orders</div>
			{renderFilterBar()}
			<div className="history-screen__tabs ">
				<div className="history-screen__tabs__label   d-flex">{renderTabsLabel()}</div>
				<div className="history-screen__tabs__content">{renderTable()}</div>
				<div className="history-screen__tabs__content__pagination w-100 d-flex justify-content-center">
					{renderPagination()}
				</div>
			</div>
		</div>
	);
};
