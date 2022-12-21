import { CurrencyIcon } from 'components/CurrencyIcon';
import { format } from 'date-fns';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getTimeZone } from '../../../../../helpers';
import { selectUnstakeHistory, selectUnstakeHistoryLoading } from '../../../../../modules';
import { ReactTable } from '../ReactTable';
interface UnStakeHistoryProps {
	currency_id: string;
}
export const UnStakeHistory = (props: UnStakeHistoryProps) => {
	const { currency_id } = props;
	const unstakeHistories = useSelector(selectUnstakeHistory);
	const unstakeHistoryLoading = useSelector(selectUnstakeHistoryLoading);

	const columns = React.useMemo(() => {
		return [
			{
				Header: 'Currency',
				accessor: 'currency_id',
			},
			{
				Header: 'Amount',
				accessor: 'amount',
			},
			{
				Header: 'Unstaked Date',
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

	return (
		<div>
			<span className="timezone">Timezone: GMT{getTimeZone()}</span>
			<ReactTable columns={columns} data={histories.reverse()} loading={unstakeHistoryLoading} />
		</div>
	);
};
