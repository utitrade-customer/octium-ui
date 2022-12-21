import classnames from 'classnames';
import { CurrencyIcon } from 'components/CurrencyIcon';
import { format } from 'date-fns';
import _toUpper from 'lodash/toUpper';
import _upperCase from 'lodash/upperCase';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { currenciesFetch, NewCompetition, selectCompetitionList } from '../../../../../modules';
import banner from './img/banner.png';
export const CompetitionItemNoneRunning: React.FC<NewCompetition> = props => {
	const { end_date, type, currency_id, total_prize, start_date, id } = props;
	const dispatch = useDispatch();
	// selectors

	const competitions = useSelector(selectCompetitionList);
	const history = useHistory();
	const forwardToDetail = () => {
		const competition = competitions.payload.find(competition => competition.id === id);
		if (competition) {
			const location = {
				pathname: `/competition/${id}`,
			};
			history.push(location);
		}
	};
	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, []);

	const durationCompetition = `${format(new Date(start_date), 'MMM dd')} - ${format(new Date(end_date), 'MMM dd')}`;
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
	return (
		<div id="mobile-competition-item-none-running" style={{ backgroundImage: `url(${banner})` }} onClick={forwardToDetail}>
			<div className="mobile-competition-item__header">
				<div className="w-100">
					<div className={`mobile-competition-item__header__type ${typeCompetitionClassNames}`}>{_upperCase(type)}</div>
				</div>
			</div>
			<div className="d-flex col-12">
				<div className="mobile-competition-item__content col-8">
					<div className="mobile-competition-item__content__info">
						<div className="mobile-competition-item__content__info__currency">{_toUpper(currency_id)}</div>
						<div className="mobile-competition-item__content__info__date">{durationCompetition}</div>
						<div className="mobile-competition-item__content__info__prize">
							<div className="mobile-competition-item__content__info__prize--title">Prize Pool</div>
							<div className="mobile-competition-item__content__info__prize--value">{total_prize}</div>
						</div>
					</div>
				</div>
				<div className="mobile-competition-item__icon col-4 d-flex justify-content-center align-items-center">
					<CurrencyIcon
						style={{ borderRadius: '50%' }}
						currency_id={currency_id}
						alt={`${_toUpper(currency_id)}-icon`}
					/>
				</div>
			</div>
		</div>
	);
};
