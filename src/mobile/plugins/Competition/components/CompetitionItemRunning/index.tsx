import classnames from 'classnames';
import { CurrencyIcon } from 'components/CurrencyIcon';
import { format, formatDistance } from 'date-fns';
import _toUpper from 'lodash/toUpper';
import _upperCase from 'lodash/upperCase';
import React from 'react';
import { useHistory } from 'react-router';
import { NewCompetition } from '../../../../../modules';

export const CompetitionItemRunning: React.FC<NewCompetition> = props => {
	const { end_date, type, currency_id, total_prize, start_date, id } = props;
	const history = useHistory();
	const onClickButtonDetail = () => {
		const location = {
			pathname: `/competition/${id}`,
		};
		history.push(location);
	};
	const typeCompetitionClassNames = (() => {
		switch (type) {
			case 'stake':
				return classnames('type--stake');
			case 'trade':
				return classnames('type--trade');
			case 'deposit':
				return classnames('type--deposit');
			case 'trade_buy':
				return classnames('type--trade-buy');
		}
	})();

	// selectors

	const durationCompetition = `${format(new Date(start_date), 'MMM dd')} - ${format(new Date(end_date), 'MMM dd')}`;
	const renderCompetitionInfo = (title: string, value: string) => {
		return (
			<div className="mobile-competition-item-running__content__info__item">
				<div className="mobile-competition-item-running__content__info__item--title">
					{title}
					<div className="mobile-competition-item-running__content__info__item--value">{value}</div>
				</div>
			</div>
		);
	};
	return (
		<div id="mobile-competition-item-running" onClick={onClickButtonDetail}>
			<div className={`mobile-competition-item-running__header`}>
				<div className="w-100">
					<div className={`mobile-competition-item-running__header__type ${typeCompetitionClassNames}`}>
						{_upperCase(type)}
					</div>
					<div className="mobile-competition-item-running__header__time">
						End {formatDistance(new Date(end_date), new Date(), { addSuffix: true })}
					</div>
				</div>
			</div>
			<div className="mobile-competition-item-running__content d-flex flex-row align-items-center">
				<div className="mobile-competition-item-running__header__icon d-flex justify-content-center align-items-center">
					<CurrencyIcon style={{ borderRadius: '50%' }} currency_id={currency_id} alt={`${currency_id}-icon`} />
				</div>
				<div className="ml-3">
					<div className="mobile-competition-item-running__content__currency">{_toUpper(currency_id)}</div>
					<div className="mobile-competition-item-running__content__info d-flex flex-row">
						<div>{renderCompetitionInfo('Prize pool', total_prize || '')}</div>
						<div className="ml-3">{renderCompetitionInfo('Dates', durationCompetition || '')}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
