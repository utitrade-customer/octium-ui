import className from 'classnames';
import { CurrencyIcon } from 'components/CurrencyIcon';
import { formatNumber } from 'helpers';
import _toString from 'lodash/toString';
import _toUpper from 'lodash/toUpper';
import _upperCase from 'lodash/upperCase';
import millify from 'millify';
import { currenciesFetch } from 'modules';
import NP from 'number-precision';
import React from 'react';
import Countdown from 'react-countdown';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { IEOLoading } from '../../components/IEOLoading';
interface IEODetailProps {
	startDate: string;
	endDate: string;
	bonus: string;
	currencyID: string;
	remains: number;
	total: number;
	progress: number;
	loading: boolean;
	totalBuyer: number;
	type: 'ended' | 'upcoming' | 'ongoing';
	price: number;
	min_buy: number;
	currencyAvailable: string[];
}

export const IEOInfo: React.FC<IEODetailProps> = props => {
	const [progressState, setProgressState] = React.useState<number>(
		Math.round(NP.minus(100, Number(props.progress)) * 100) / 100,
	);
	const history = useHistory();
	const [totalState, setTotalState] = React.useState<number>(0);
	const [remainsState, setRemainsState] = React.useState<number>(0);
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	const intl = useIntl();

	React.useEffect(() => {
		dispatchFetchCurrencies();
		// reset progress
		const newProgress = Math.round(NP.minus(100, Number(props.progress)) * 100) / 100;
		setProgressState(newProgress);
		setTotalState(props.total);
		setRemainsState(props.remains);
	}, [props.total, props.remains]);

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		return (
			<div className="d-flex flex-wrap ieo-mobile-detail-info__content__time__countdown-renderer">
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{days}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.days' })}</span>
						</div>
					</div>
				</div>
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{hours}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.hours' })}</span>
						</div>
					</div>
				</div>
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{minutes}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.minutes' })}</span>
						</div>
					</div>
				</div>
				<div className="timing">
					<div className="timing__material d-flex justify-content-center aligns-items-center">
						<div className="d-flex flex-column">
							<p>{seconds}</p>
							<span>{intl.formatMessage({ id: 'page.ieo.detail.countdown.seconds' })}</span>
						</div>
					</div>
				</div>
			</div>
		);
	};
	const rendererCountDown = (type: 'ended' | 'ongoing' | 'upcoming') => {
		if (type !== 'upcoming') return <Countdown date={new Date(props.endDate)} renderer={renderer} />;
		return <Countdown date={new Date(props.startDate)} renderer={renderer} />;
	};
	const IEOBought = totalState - remainsState;
	const renderProgressing = () => {
		return (
			<div className="progress" style={{ width: '100%', background: 'var(--thin-blue)', height: '30px' }}>
				<div
					className="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar"
					aria-valuenow={remainsState}
					aria-valuemin={0}
					aria-valuemax={totalState}
					style={{ width: `${progressState}%`, backgroundColor: 'var(--blue)' }}
				/>
				<div
					className="d-flex justify-content-around align-items-center text-dark text-white"
					style={{
						position: 'absolute',
						top: '8px',
						left: '0',
						width: '100%',
						height: '100%',
						padding: '0 1rem',
						fontSize: '1rem',
					}}
				>
					<span>
						{intl.formatMessage(
							{ id: 'page.mobile.ieo.item.bought' },
							{
								bought:
									Number(IEOBought) > 100000000
										? millify(Number(IEOBought), {
												precision: 2,
										  })
										: Number(IEOBought),
							},
						)}
					</span>
					<span hidden={Number(IEOBought) <= 0}>{`  /  `}</span>
					<span hidden={Number(IEOBought) <= 0}>
						{intl.formatMessage(
							{ id: 'page.mobile.ieo.item.total' },
							{
								total:
									Number(totalState) > 100000000
										? millify(Number(totalState), {
												precision: 2,
										  })
										: Number(totalState),
							},
						)}
					</span>
				</div>
			</div>
		);
	};
	const renderInfoItem = (key: string, value: string, classNameKey?: string, classNameValue?: string) => {
		return (
			<React.Fragment>
				<div className={`ieo-mobile-detail-info__content__material--key ${classNameKey || ''}`}>
					<p>{key}</p>
				</div>
				<div className={`ieo-mobile-detail-info__content__material--value ${classNameValue || ''}`}>
					<p>{value}</p>
				</div>
			</React.Fragment>
		);
	};
	const classNameLoading = className(`${props.loading ? 'ieo-detail-loading' : ''}`);
	return (
		<div id="ieo-mobile-detail-info" className={`d-flex justify-content-center align-items-center ${classNameLoading}`}>
			{props.loading ? <IEOLoading className="position-absolute" /> : null}
			<div className="container-sm">
				<div className="ieo-mobile-detail-info__header w-100">
					<div className="ieo-mobile-detail-info__return-list">
						<button
							className="d-flex justify-content-center aligns-items-center"
							onClick={() => {
								const location = {
									pathname: `/ieo`,
								};
								history.push(location);
							}}
						>
							{intl.formatMessage({ id: 'page.ieo.detail.btn.backToList' })}
						</button>
					</div>
				</div>
				<div className="ieo-mobile-detail-info__content m-auto">
					<div className="ieo-mobile-detail-info__content__logo w-100 d-flex justify-content-center">
						<CurrencyIcon
							style={{ borderRadius: '50%' }}
							currency_id={props.currencyID}
							alt={`${_upperCase(props.currencyID)}-icon`}
						/>
					</div>
					<div className="ieo-mobile-detail-info__content__time">{rendererCountDown(props.type)}</div>
					<div className="col-12 position-relative" style={{ paddingTop: '15px' }}>
						{renderProgressing()}
					</div>
					<div className="ieo-mobile-detail-info__content__material d-flex flex-wrap justify-content-center">
						<div className="d-flex w-100 text-left justify-content-around">
							<div className="text-center">
								{renderInfoItem(
									intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.startPrice' }),
									`$${formatNumber(_toString(props.price))} USD`,
									'ieo-mobile-detail-info__content__material--cost',
								)}
							</div>
							<div>
								{renderInfoItem(
									intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.minPrice' }),
									`${formatNumber(_toString(props.min_buy))} ${_toUpper(props.currencyID)}`,
								)}
							</div>
						</div>
						<div className="col-12 text-center mt-3">
							{renderInfoItem(
								intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.available' }),
								props.currencyAvailable.map(item => _upperCase(item)).join(', '),
							)}
						</div>
						<div className="col-12 text-center mt-3">
							{renderInfoItem(
								intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.remains' }),
								formatNumber(String(props.remains)),
							)}
						</div>
						<div className="col-12 text-center mt-3">
							{renderInfoItem(
								intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.total' }),
								formatNumber(String(props.total)),
							)}
						</div>
						<div className="col-12 text-center mt-3">
							{renderInfoItem(
								intl.formatMessage({ id: 'page.mobile.ieo.detail.ieoId.totalPurchases' }),
								String(props.totalBuyer),
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
