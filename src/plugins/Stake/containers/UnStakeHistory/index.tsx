import { CurrencyIcon } from 'components/CurrencyIcon';
import { format } from 'date-fns';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectUnstakeHistory, selectUnstakeHistoryLoading } from '../../../../modules';
import { StakeTable } from '../../components';
interface UnStakeHistoryProps {
	currency_id: string;
}
export const UnStakeHistory = (props: UnStakeHistoryProps) => {
	const intl = useIntl();
	const { currency_id } = props;
	const unstakeHistories = useSelector(selectUnstakeHistory);
	const unstakeHistoryLoading = useSelector(selectUnstakeHistoryLoading);

	const columns = React.useMemo(() => {
		return [
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.unStake.history.header.table.currency' }),
				accessor: 'currency_id',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.unStake.history.header.table.amount' }),
				accessor: 'amount',
			},
			{
				Header: intl.formatMessage({ id: 'page.stake.detail.unStake.history.header.table.unstaked' }),
				accessor: 'completed_at',
			},
		];
	}, []);

	const histories = unstakeHistories
		.filter(history => history.currency_id.toLowerCase() === currency_id.toLowerCase())
		.map(history => ({
			...history,
			currency_id: (
				<CurrencyIcon
					style={{ borderRadius: '50%' }}
					width="24px"
					height="24px"
					currency_id={history.currency_id}
					alt={history.currency_id}
				/>
			),
			amount: Number(history.amount),
			completed_at: format(new Date(history.completed_at), 'yyyy-MM-dd hh:mm:ss'),
		}));
	const unStakedAmount: number = histories.length > 0 ? histories.map(history => history.amount).reduce((a, b) => a + b, 0) : 0;

	return (
		<div>
			<div>
				<span className="text-left float-right" style={{ fontSize: '1.3rem' }}>
					{intl.formatMessage({ id: 'page.stake.detail.unStake.history.header.total' })} {unStakedAmount.toFixed(5)}
				</span>
			</div>
			<StakeTable columns={columns} data={histories.reverse()} loading={unstakeHistoryLoading} />
		</div>
	);
};
