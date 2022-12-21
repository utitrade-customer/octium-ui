import { Empty } from 'antd';
import classnames from 'classnames';
import { localeDate } from 'helpers';
import { useCurrenciesFetch, useHistoryFetch, useWalletsFetch } from 'hooks';
import { selectCurrencies, selectHistory, selectNextPageExists, selectWallets } from 'modules';
import { bankDepositHistoryListFetch } from 'modules/plugins/fiat/bank/actions/bankDepositActions';
import { selectBankDepositHistoryList, selectBankWithdrawHistoryList } from 'modules/plugins/fiat/bank/selectors';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_CCY_PRECISION } from '../../../constants';
import { PaginationMobile } from '../Pagination';
import { RowItem } from './Rowitem';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import _find from 'lodash/find';
import { bankWithdrawHistoryListFetch } from 'modules/plugins/fiat/bank/actions/bankWithdrawActions';
import { useP2PHistoryBalances } from 'plugins/P2p/hooks';

type CellData = string | number | React.ReactNode | undefined;

const DEFAULT_LIMIT = 6;

const HistoryTable = (props: any) => {
	const dispatch = useDispatch();

	const [pageIndex, setPageIndex] = React.useState(1);
	const list = useSelector(selectHistory);
	const fiatBankDepositHistoryList = useSelector(selectBankDepositHistoryList);
	const fiatBankWithdrawHistoryList = useSelector(selectBankWithdrawHistoryList);

	const wallets = useSelector(selectWallets);
	const currencies = useSelector(selectCurrencies);
	const nextPageExists = useSelector(state => selectNextPageExists(state as any, props.limit || DEFAULT_LIMIT));

	useWalletsFetch();
	useCurrenciesFetch();

	useHistoryFetch({
		type: props.type,
		currency: props.currency,
		limit: props.limit || DEFAULT_LIMIT,
		page: pageIndex - 1,
		enable: props.type !== 'fiatDeposit' && props.type !== 'fiatWithdraw' && props.type !== 'funding',
	});

	const { isLoading: historyBalanceLoading, historyBalances } = useP2PHistoryBalances({
		page: pageIndex,
		sort: 'createdAt:DESC',
		limit: 20,
	});

	React.useEffect(() => {
		if (props.type === 'fiatDeposit') {
			dispatch(bankDepositHistoryListFetch());
		}
		if (props.type === 'fiatWithdraw') {
			dispatch(bankWithdrawHistoryListFetch());
		}
	}, [props.type]);

	const formatTxState = (tx: string, confirmations?: number, minConfirmations?: number) => {
		const process = require('assets/status/wait.svg');
		const fail = require('assets/status/fail.svg');
		const success = require('assets/status/success.svg');
		const checking = <span style={{ color: 'var(--yellow)' }}>Checking...</span>;

		const statusMapping = {
			succeed: <img src={success} alt="success" />,
			failed: <img src={fail} alt="fail" />,
			accepted: <img src={process} alt="process" />,
			collected: <img src={success} alt="success" />,
			canceled: <img src={fail} alt="fail" />,
			rejected: <img src={fail} alt="fail" />,
			processing: <img src={process} alt="process" />,
			pending: <img src={process} alt="process" />,
			prepared: <img src={process} alt="process" />,
			submitted:
				confirmations !== undefined && minConfirmations !== undefined ? (
					<img src={process} alt="process" />
				) : (
					`${confirmations}/${minConfirmations}`
				),
			skipped: props.type === 'withdraws' ? checking : <img src={success} alt="success" />,
		};

		return statusMapping[tx];
	};
	const retrieveData = () => {
		const { currency, type } = props;

		if (type === 'fiatDeposit') {
			if (fiatBankDepositHistoryList.length === 0) {
				return [[<Empty />]];
			}

			const histories = fiatBankDepositHistoryList.map(bankAccount => {
				const state = 'state' in bankAccount ? formatTxState(bankAccount.state) : '';
				const currency = _find(currencies, { id: _toLower(bankAccount.currency_id) });

				return [
					<RowItem
						amount={bankAccount.amount}
						fixed={Number(currency?.precision)}
						currency={_toUpper(bankAccount.currency_id)}
						createdAt={bankAccount.created_at}
					/>,
					state,
				];
			});

			return histories.length ? histories : [[<Empty />]];
		}

		if (type === 'fiatWithdraw') {
			if (fiatBankWithdrawHistoryList.length === 0) {
				return [[<Empty />]];
			}

			const histories = fiatBankWithdrawHistoryList.map(bankAccount => {
				const state = 'state' in bankAccount ? formatTxState(bankAccount.state) : '';
				const currency = _find(currencies, { id: _toLower(bankAccount.currency_id) });

				return [
					<RowItem
						amount={bankAccount.amount}
						fixed={Number(currency?.precision)}
						currency={_toUpper(bankAccount.currency_id)}
						createdAt={bankAccount.created_at}
					/>,
					state,
				];
			});

			return histories.length ? histories : [[<Empty />]];
		}

		if (type === 'funding') {
			if (historyBalanceLoading || historyBalances.data.length === 0) {
				return [[<Empty />]];
			}

			const histories = historyBalances.data.map(item => {
				return [
					<RowItem
						amount={item.credit}
						fixed={Number(6)}
						currency={item.currencyId}
						createdAt={item.createdAt}
						isFunding={true}
						credit={item.credit}
						debit={item.debit}
					/>,
					item.referenceType,
				];
			});

			return histories.length ? histories : [[<Empty />]];
		}

		if (list.length === 0) {
			return [[<Empty />]];
		}

		const histories = list
			.filter((history: any) => (currency ? history.currency === currency : true))
			.sort((a, b) => {
				return localeDate(a.created_at, 'fullDate') > localeDate(b.created_at, 'fullDate') ? -1 : 1;
			})
			.map((item: any) => {
				const { fixed } = wallets.find(w => w.currency === item.currency) || { fixed: DEFAULT_CCY_PRECISION };

				const amount = 'amount' in item ? Number(item.amount) : Number(item.price) * Number(item.volume);
				const confirmations = type === 'deposits' && item.confirmations;
				const itemCurrency = currencies && currencies.find(cur => cur.id === currency);
				const minConfirmations = itemCurrency && itemCurrency.min_confirmations;
				const state = 'state' in item ? formatTxState(item.state, confirmations, minConfirmations) : '';

				return [
					<RowItem amount={amount} fixed={fixed} currency={currency || item.currency} createdAt={item.created_at} />,
					state,
				];
			});

		return histories.length ? histories : [[<Empty />]];
	};
	const tableData = retrieveData().map(row => row.map(a => a));

	const renderBody = (rows: CellData[][]) => {
		const rowElements = rows.map((row, i) => {
			const isEmpty = rows.length === 1 && row.length === 1;

			return (
				<tr key={i}>
					{row.map((c, j) => (
						<td
							className={classnames({
								'w-100': isEmpty,
							})}
							key={j}
						>
							{c}
						</td>
					))}
				</tr>
			);
		});

		return <tbody className={'td-mobile-cpn-history-table__table__body'}>{rowElements}</tbody>;
	};

	return (
		<div className="td-mobile-cpn-history-table" hidden={tableData.length <= 0}>
			<table className="td-mobile-cpn-history-table__table">{renderBody(tableData)}</table>
			<PaginationMobile
				forcePage={pageIndex - 1}
				toPage={page => {
					setPageIndex(page);
				}}
				pageCount={props.type === 'funding' ? historyBalances.meta.pageCount : nextPageExists ? pageIndex : undefined}
				nextPageExists={props.type === 'funding' ? historyBalances.meta.hasNextPage : nextPageExists}
			/>
		</div>
	);
};

export { HistoryTable };
