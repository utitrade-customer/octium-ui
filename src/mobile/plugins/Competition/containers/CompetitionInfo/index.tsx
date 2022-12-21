import Countdown from 'react-countdown';
import { format } from 'date-fns';
import React from 'react';
import { useHistory } from 'react-router';
import { LoadingCompetition } from 'plugins/Competition/components';
import classNames from 'classnames';
// import moment from 'moment';
import Select from 'react-select';
import moment from 'moment';
import _toUpper from 'lodash/toUpper';
import _toNumber from 'lodash/toNumber';
import _startCase from 'lodash/startCase';
import { typeCompetition } from 'modules';

interface CompetitionInfoProps {
	currency_id: string;
	start_date: string;
	end_date: string;
	type: typeCompetition;
	markets: string[];
	volume: number;
	next_update: string;
	loading: boolean;
	status: 'ended' | 'ongoing' | 'upcoming';
	dispatchFetchCompetition: () => void;
	min_value: number;
}

export const CompetitionInfo = (props: CompetitionInfoProps) => {
	const {
		// dispatchFetchCompetition,
		currency_id,
		start_date,
		end_date,
		type,
		markets,
		volume,
		next_update,
		loading,
		status,
		min_value,
	} = props;
	const uppercaseCharacterFirst = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const history = useHistory();

	const [selectedState, setSelectedState] = React.useState(uppercaseCharacterFirst(type));
	React.useEffect(() => {
		setSelectedState(uppercaseCharacterFirst(type));
	}, [type]);
	const SelectStyles = {
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isFocused ? 'var(--blue)' : 'var(--main-background-color)',
			color: state.isFocused ? '#000' : 'var(--system-text-black-color)',
			cursor: 'pointer',
		}),
		control: (provided, state) => ({
			...provided,
			border: '1px solid #4A505',
			color: '#000',
			backgroundColor: 'var(--body-background-color)',
		}),
		placeholder: (provided, state) => ({
			...provided,
			color: 'var(--system-text-black-color)',
		}),
		singleValue: (provided, state) => ({
			...provided,
			border: '1px solid #4A505',
			color: 'var(--system-text-black-color)',
			backgroundColor: '#000456',
		}),
		menu: (provided, state) => ({
			...provided,
			border: '1px solid #4A505',
			color: 'var(--system-text-black-color)',
			backgroundColor: 'var(--main-background-color)',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		}),
		input: (provided, state) => ({
			...provided,
			color: 'var(--system-text-black-color)',
		}),
	};

	const handleLetJoin = () => {
		if (selectedState === uppercaseCharacterFirst(type)) {
			return;
		}
		let location = {
			pathname: '',
		};
		switch (type) {
			case 'stake':
				location = {
					pathname: '/stake',
				};
				break;
			case 'deposit':
				location = {
					pathname: `/wallets/deposit/${_toUpper(currency_id)}`,
				};
				break;
			case 'trade':
			case 'trade_buy':
				const marketID = selectedState.replace('/', '').toLowerCase();
				location = {
					pathname: `/market/${marketID}`,
				};
		}
		history.push(location);
	};

	const handleChangeSelect = (selected: { value: string }) => {
		setSelectedState(selected.value);
	};

	const getSafeDate = (date: string) => {
		return !date ? new Date() : moment(date).toDate();
	};
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		//

		if (completed && status === 'ongoing') {
			// dispatchFetchCompetition();
		}
		if (completed) {
			// render a completed state
			return <p className="time">00 : 00</p>;
		} else {
			// render a countdown

			return (
				<p>
					{minutes < 10 ? 0 : ''}
					{minutes} : {seconds < 10 ? 0 : ''}
					{seconds}
				</p>
			);
		}
	};

	const getOptionSelect = () => {
		const tradesCompetitions = ['trade', 'trade_buy'];
		const options = tradesCompetitions.includes(type) ? markets.map(item => item.toUpperCase()) : [currency_id.toUpperCase()];
		const convert = (currency: string, index: number) => {
			const newCurrency = {
				value: currency,
				label: <span key={index}>{currency.toUpperCase()}</span>,
			};
			return newCurrency;
		};
		return options.map(convert);
	};
	const renderInfoItem = (key: string, value: JSX.Element) => (
		<div className="mobile-competition-ranking-detail__info__update">
			<div className="mobile-competition-ranking-detail__info__update__title">
				<p className="mobile-competition-ranking-detail__info__update__title--key">{key}</p>
			</div>
			<div className="mobile-competition-ranking-detail__info__update__value">
				<div>{value}</div>
			</div>
		</div>
	);
	const buttonForwardClassName = classNames('mobile-competition-ranking-detail__info__button--active');
	const buttonUpcomingClassName = classNames(`mobile-competition-ranking-detail__info__button--upcoming`);
	const buttonEndedClassName = classNames(`mobile-competition-ranking-detail__info__button--ended`);
	const buttonStatusClassName = classNames(
		`${status === 'ended' ? buttonEndedClassName : status === 'upcoming' ? buttonUpcomingClassName : ''}`,
	);
	const loadingDetailsClassNames = classNames('align-item-center', 'mobile-competition-background-loading');
	return (
		<div
			className={`mobile-competition-ranking-detail d-flex flex-column justify-content-center ${
				loading ? loadingDetailsClassNames : ''
			}`}
		>
			{loading ? <LoadingCompetition className="mobile-competition-ranking-detail__loading position-absolute" /> : ''}

			<div className="mobile-competition-ranking-detail__info">
				<div className="row">
					<div className="col-6">
						{renderInfoItem(`Your ${_startCase(type)} volume`, <p>{volume.toFixed(4)}</p>)}

						{loading
							? renderInfoItem('Next Update', <p>00 : 00</p>)
							: renderInfoItem('Next Update', <Countdown date={getSafeDate(next_update)} renderer={renderer} />)}
						{renderInfoItem(
							`Min ${_startCase(type)}`,
							<p>{`${_toNumber(min_value).toFixed(4)} ${_toUpper(currency_id)}`}</p>,
						)}

						<Select
							autoFocus
							backspaceRemovesValue={false}
							controlShouldRenderValue={false}
							hideSelectedOptions={false}
							isClearable={false}
							onChange={handleChangeSelect}
							options={getOptionSelect()}
							placeholder={selectedState}
							styles={SelectStyles}
							tabSelectsValue={false}
							value={getOptionSelect().map(option => option.value.toLowerCase())}
						/>
					</div>
					<div className="col-6">
						{renderInfoItem('Start Time', <p>{format(getSafeDate(start_date), 'yyyy-MM-dd hh:mm')}</p>)}
						{renderInfoItem('End Time', <p>{format(getSafeDate(end_date), 'yyyy-MM-dd hh:mm')}</p>)}

						<button
							className={`mobile-competition-ranking-detail__info__button ${buttonForwardClassName} ${buttonStatusClassName}`}
							onClick={handleLetJoin}
							style={{ position: 'absolute', bottom: '0' }}
						>{`${status !== 'ongoing' ? `${status.toUpperCase()}` : `Let's ${_startCase(type)}`}`}</button>
					</div>
				</div>
			</div>
		</div>
	);
};
