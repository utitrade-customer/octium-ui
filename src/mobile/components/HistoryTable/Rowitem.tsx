import { localeDate } from 'helpers';
import * as React from 'react';
import { Decimal } from '../Decimal';

interface IRowItemComponent {
	amount: string | number;
	fixed: number;
	currency: string;
	createdAt: Date;
	credit?: number;
	debit?: number;
	isFunding?: boolean;
}

const RowItemComponent = (props: IRowItemComponent) => {
	return (
		<div className="td-mobile-cpn-history-table__row">
			<div className="td-mobile-cpn-history-table__row__amount">
				{props.isFunding ? (
					<div className="td-mobile-cpn-history-table__row__amount-value">
						-<Decimal fixed={props.fixed}>{props.debit}</Decimal>{' '}
						<span className="td-mobile-cpn-history-table__row__amount-currency">{props.currency}</span> | +
						<Decimal fixed={props.fixed}>{props.credit}</Decimal>
					</div>
				) : (
					<div className="td-mobile-cpn-history-table__row__amount-value">
						<Decimal fixed={props.fixed}>{props.amount}</Decimal>
					</div>
				)}

				<span className="td-mobile-cpn-history-table__row__amount-currency">{props.currency}</span>
			</div>
			<div className="td-mobile-cpn-history-table__row__date">{localeDate(props.createdAt, 'fullDate')}</div>
		</div>
	);
};

const RowItem = React.memo(RowItemComponent);

export { RowItem };
