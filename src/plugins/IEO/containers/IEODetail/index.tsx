import { CurrencyIcon } from 'components/CurrencyIcon';
import { format } from 'date-fns';
import { formatNumber } from 'helpers';
import { convertEtoNumber } from 'helpers/convertEtoNumber';
import _toString from 'lodash/toString';
import _toUpper from 'lodash/toUpper';
import millify from 'millify';
import NP from 'number-precision';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { currenciesFetch } from '../../../../modules';
import MaskGroup from './assets/MaskGroup.png';
interface IEODetailProps {
	startDate: string;
	endDate: string;
	bonus: string;
	currencyID: string;
	remains: number;
	total: number;
	progress: number;
	min_buy: number;
	start_price: number;
}

export const IEODetail: React.FC<IEODetailProps> = props => {
	const intl = useIntl();
	const [progressState, setProgressState] = React.useState<number>(
		Math.round(NP.minus(100, Number(props.progress)) * 100) / 100,
	);
	const [totalState, setTotalState] = React.useState<number>(0);
	const [remainsState, setRemainsState] = React.useState<number>(0);
	const dispatch = useDispatch();
	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	React.useEffect(() => {
		dispatchFetchCurrencies();
		const newProgress = Math.round(NP.minus(100, Number(props.progress)) * 100) / 100;
		setProgressState(newProgress);
		setTotalState(props.total);
		setRemainsState(props.remains);
	}, [props.total, props.remains]);

	const isSafeDate = (date: string) => {
		return !date ? new Date() : new Date(date);
	};
	const totalBought = totalState - remainsState;

	return (
		<div id="ieo-detail" style={{ backgroundImage: `url(${MaskGroup})` }}>
			<div className="ieo-detail__content col-11 m-auto">
				<div className="ieo-detail__content__header"></div>
				<div className="ieo-detail__content__body col-12">
					<div className="logo-icon d-flex justify-content-center">
						<CurrencyIcon
							style={{ borderRadius: '50%' }}
							currency_id={props.currencyID}
							alt={`${props.currencyID.toUpperCase()}-icon`}
						/>
					</div>
					<div className="ieo-detail__content__body__time">{`${format(
						isSafeDate(props.startDate),
						'yyyy-MM-dd hh:mm',
					)} ~ ${format(isSafeDate(props.endDate), 'yyyy-MM-dd hh:mm')}`}</div>
					<div className="w-100" style={{ position: 'relative', margin: '5px' }}>
						<div className="progress" style={{ width: '100%', background: 'rgb(255 255 255 / 8%)', height: '30px' }}>
							<div
								className="progress-bar progress-bar-striped progress-bar-animated"
								role="progressbar"
								aria-valuenow={remainsState}
								aria-valuemin={0}
								aria-valuemax={totalState}
								style={{ width: `${progressState}%`, backgroundColor: 'var(--blue)' }}
							/>
							<div
								className="d-flex justify-content-around align-items-center text-white"
								style={{
									position: 'absolute',
									top: '0',
									left: '0',
									width: '100%',
									height: '100%',
									padding: '0 1rem',
									fontSize: '1rem',
								}}
							>
								<span>
									{intl.formatMessage({ id: 'page.ieo.detail.item.info.bought' })}
									{`${
										Number(totalBought) > 100000000
											? millify(Number(totalBought), {
													precision: 2,
											  })
											: Number(totalBought)
									} `}
								</span>
								<span hidden={Number(totalBought) <= 0}>{`  /  `}</span>
								<span hidden={Number(totalBought) <= 0}>
									{' '}
									{Number(totalState) > 100000000
										? millify(Number(totalState), {
												precision: 2,
										  })
										: Number(totalState)}{' '}
									{intl.formatMessage({ id: 'page.ieo.detail.item.info.total' })}
								</span>
							</div>
						</div>
					</div>
				</div>
				<hr></hr>
				<div className="ieo-detail-footer d-flex flex-wrap justify-content-bettween">
					<div className="ieo-detail-footer__bonus text-left col-12 mt-4">
						{' '}
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.bonus' })}</span>
						{` ${props.bonus ? props.bonus : '0%'}  ${_toUpper(props.currencyID)}`}
					</div>
					<div className="ieo-detail-footer__min_buy text-left col-12 mt-4">
						{' '}
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.minBuy' })}</span>
						{` ${formatNumber(_toString(Number(props.min_buy)))}`}
					</div>
					<div className="ieo-detail-footer__min_price text-left col-12 mt-4">
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.startPrice' })}</span>
						{` ${convertEtoNumber(_toString(Number(props.start_price)))} $`}
					</div>
					<div className="ieo-detail-footer__total text-left col-12 mt-4">
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.total' })}</span>
						{` ${formatNumber(_toString(props.total))}`}
					</div>
					<div className="ieo-detail-footer__remains text-left col-12 mt-4">
						<span>{intl.formatMessage({ id: 'page.ieo.detail.item.info.footer.remains' })}</span>
						{` ${formatNumber(_toString(props.remains))}`}
					</div>
				</div>
			</div>
		</div>
	);
};
