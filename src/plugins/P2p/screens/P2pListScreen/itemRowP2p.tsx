import { Input } from 'antd';
import React, { useMemo } from 'react';
import { IInfoSupported, IItemPublicOrder, IPaymentMethod, p2pOpenTradesFetch } from 'modules';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import { IItemShow } from '.';
import NP from 'number-precision';
import { useDispatch } from 'react-redux';
import { LoadingGif } from 'components/LoadingGif';
import { checkNumberP2p, formatNumberP2p } from 'plugins/P2p/helper';
import { ModalChoosePayment } from 'plugins/P2p/containers/ModalChoosePayment';
import { CustomBtn } from './CustomBtn';

NP.enableBoundaryChecking(false); // default param is true

interface ItemRowP2p {
	item: IItemPublicOrder;
	infoOrder: IInfoSupported;
	itemShow: IItemShow;
	setItemShow: (itemShow: IItemShow) => void;
	balance: number;
	totalBTC: string;
}

export const ItemRowP2p = (props: ItemRowP2p) => {
	const { item, infoOrder, itemShow, setItemShow, balance, totalBTC } = props;
	const [inputAmountValueState, setInputAmountValueState] = React.useState<{
		to: string;
		receive: string;
	}>({
		to: '',
		receive: '',
	});

	const [isOpening, setIsOpening] = React.useState<boolean>(false);
	const [showModal, setShowModal] = React.useState<boolean>(false);
	const [payment, setPayment] = React.useState<IPaymentMethod | undefined>();
	const history = useHistory();
	const dispatch = useDispatch();

	const { paymentSupported, fiatSupported } = infoOrder;
	const { type, price, orderMin, orderMax, volume } = item;

	const fiatTmp = useMemo(() => fiatSupported.find(e => e.id === item.fiat), [fiatSupported, item.fiat]);

	const handlerConfirm = ( ) => {
		if (inputAmountValueState && suggestionsWantTo().valid) {
			const { valid, value } = checkNumberP2p(inputAmountValueState.to);

			if (valid) {
				dispatch(
					p2pOpenTradesFetch({
						openOrder: {
							id: item.id,
							amount: type === 'sell' ? renderValueReceived().value : value,
							price: price,
							payment: type === 'buy' ? payment?.id : undefined,
							otp:'123456',
						},
						callback: (tradeId: number) => history.push(`/p2p/order-detail/${tradeId}`),
						errCallback: () => setIsOpening(false),
					}),
				);
				setIsOpening(true);
			}
		}
	};

	const renderValueReceived = () => {
		const { value } = checkNumberP2p(inputAmountValueState.to);
		const received = type === 'sell' ? NP.divide(value, price) : NP.times(value, price);
		return checkNumberP2p(received);
	};

	const handlerInputAmount = (valueInput: string) => {
		const { render, valid, value } = checkNumberP2p(valueInput, type === 'sell' ? fiatTmp?.decimal : undefined);

		console.log({
			to: render,
			receive: render ? formatNumberP2p(type === 'sell' ? NP.divide(value, price) : NP.times(value, price)) : '',
		});
		if (valid) {
			setInputAmountValueState({
				to: render,
				receive: render ? formatNumberP2p(type === 'sell' ? NP.divide(value, price) : NP.times(value, price)) : '',
			});
		}
	};

	const handlerInputAmountReceived = (valueInput: string) => {
		const { render, valid, value } = checkNumberP2p(valueInput, type === 'buy' ? fiatTmp?.decimal : undefined);

		if (valid) {
			setInputAmountValueState({
				to: render ? formatNumberP2p(type === 'buy' ? NP.divide(value, price) : NP.times(value, price)) : '',
				receive: render,
			});
		}
	};

	const isActiveConfirm = (orderMinTmp: number, orderMaxTmp: number) => {
		if (inputAmountValueState) {
			const { value } = checkNumberP2p(inputAmountValueState.to);
			const { value: valueReceive } = checkNumberP2p(inputAmountValueState.receive);

			if (type === 'buy') {
				return value >= orderMinTmp && value <= orderMaxTmp && balance >= value && volume >= value;
			}

			return value >= orderMinTmp && value <= orderMaxTmp && volume >= valueReceive;
		}

		return false;
	};

	const setAllCurrency = () => {
		if (balance >= suggestionsWantTo().max) {
			handlerInputAmount(suggestionsWantTo().max + '');
			return;
		}

		handlerInputAmount(balance + '');
	};

	const suggestionsWantTo = (): {
		suggestions: string;
		valid: boolean;
		min: number;
		max: number;
		validInput: boolean;
	} => {
		let minOrderTmp, maxOrderTmp;
		if (type === 'buy') {
			minOrderTmp = NP.divide(orderMin, price);
			maxOrderTmp = NP.divide(orderMax, price);
		} else {
			minOrderTmp = orderMin.toString();
			maxOrderTmp = orderMax.toString();
		}

		const requiredPayment = type === 'buy' ? !!payment : true;
		return {
			suggestions: `${formatNumberP2p(minOrderTmp)} ≤ your input  ≤ ${formatNumberP2p(maxOrderTmp)}`,
			valid: isActiveConfirm(+minOrderTmp, +maxOrderTmp) && requiredPayment,
			min: +minOrderTmp,
			max: +maxOrderTmp,
			validInput: isActiveConfirm(+minOrderTmp, +maxOrderTmp),
		};
	};

	const renderTextType = () => {
		return type === 'buy' ? 'Sell' : 'Buy';
	};

	const classActiveConfirm = classNames(
		'item-row-p2p__item-detail__amount-input__buttons__confirm pg-p2p-config-global__btn ',
		{
			'pg-p2p-config-global__btn--disable': !suggestionsWantTo().valid,
			'pg-p2p-config-global__btn--active': suggestionsWantTo().valid,
		},
	);

	const renderTradingInformation = (label: string, value: string | any) => {
		return (
			<div className="d-flex flex-row align-items-center">
				<span className="item-row-p2p__item-detail__information__trading__detail__label">{label}</span>
				<span className="item-row-p2p__item-detail__information__trading__detail__value">{value}</span>
			</div>
		);
	};

	const isBalanceEnough = () => {
		if (inputAmountValueState.to) {
			const { value } = checkNumberP2p(inputAmountValueState.to);
			const { value: valueReceive } = checkNumberP2p(inputAmountValueState.receive);

			if (type === 'buy') {
				return balance >= value && volume >= value;
			}

			return volume >= valueReceive;
		}

		return true;
	};

	return (
		<>
			{!(itemShow.id === item.id && itemShow.show) ? (
				<div className="item-row-p2p__item">
					<div className="item-row-p2p__item__advertisers">
						<div className="item-row-p2p__item__advertisers__title">
							<div
								className="item-row-p2p__item__advertisers__title__icon"
								onClick={() => history.push(`/p2p/profile/${item.owner.id}`)}
							></div>
							<div>
								<div
									className="item-row-p2p__item__advertisers__title__name"
									onClick={() => history.push(`/p2p/profile/${item.owner.id}`)}
								>
									{item.owner.fullName}
								</div>
								<div className="item-row-p2p__item__advertisers__title__desc">
									<span>{item.owner?.statistic?.totalQuantity} orders </span>
									<span className="item-row-p2p__item__advertisers__title__desc__separator ml-1 mr-1">|</span>

									<span>{item.owner?.statistic?.completedPercent}% completion</span>
								</div>
							</div>
						</div>
					</div>

					<div className="item-row-p2p__item__price">
						<span className="item-row-p2p__item__price__number">{formatNumberP2p(price.toString())}</span>

						<span className="item-row-p2p__item__price__currency">{item.fiat.toUpperCase()}</span>
					</div>

					<div className="item-row-p2p__item__limit-available">
						<div className="item-row-p2p__item__limit-available__labels">
							<div className="item-row-p2p__item__limit-available__labels__label">Available</div>
							<div className="item-row-p2p__item__limit-available__labels__label">Limit</div>
						</div>
						<div className="item-row-p2p__item__limit-available__contents">
							<div className="item-row-p2p__item__limit-available__contents__content">
								{formatNumberP2p(item.volume.toString())} {item.currency.toUpperCase()}
							</div>
							<div className="item-row-p2p__item__limit-available__contents__content">
								{fiatTmp?.symbol}
								{formatNumberP2p(orderMin.toString())} - {fiatTmp?.symbol}
								{formatNumberP2p(orderMax.toString())}
							</div>
						</div>
					</div>
					<div className="item-row-p2p__item__payment">
						{paymentSupported.map(e => {
							return item.payments.find(payment => payment.paymentConfig === e.id) ? (
								<div key={e.id}>{e.name}</div>
							) : null;
						})}
					</div>

					<div className="item-row-p2p__item__trade">
						<CustomBtn
							callBack={() =>
								setItemShow({
									id: item.id,
									show: true,
								})
							}
							item={item}
							totalBTC={totalBTC}
						/>
					</div>
				</div>
			) : (
				<div className="item-row-p2p__item-detail">
					{isOpening && (
						<div className="item-row-p2p__item-detail__loading">
							<LoadingGif />
						</div>
					)}

					<div className="col-7 container-fluid item-row-p2p__item-detail__information">
						<div className="item-row-p2p__item-detail__information__advertiser">
							<div
								className="item-row-p2p__item-detail__information__advertiser__avatar"
								onClick={() => history.push(`/p2p/profile/${item.owner.id}`)}
							>
								<div className="item-row-p2p__item-detail__information__advertiser__avatar__image"></div>
								<span className="item-row-p2p__item-detail__information__advertiser__avatar__name">
									{item.owner?.fullName}
								</span>
							</div>
							<div className="item-row-p2p__item-detail__information__advertiser__order-completion">
								<span>{item.owner?.statistic?.totalQuantity} orders</span>
								<span className="item-row-p2p__item-detail__information__advertiser__order-completion__separator mr-2 ml-2">
									|
								</span>
								<span>{item.owner?.statistic?.completedPercent}% completion</span>
							</div>
						</div>
						<div className="item-row-p2p__item-detail__information__trading">
							<div className="item-row-p2p__item-detail__information__trading__detail mb-5">
								{renderTradingInformation(
									'Price',
									<>
										{formatNumberP2p(price.toString())} {fiatTmp?.symbol}
									</>,
								)}

								{renderTradingInformation('Payment Time Limit', `${15} Minutes`)}

								{renderTradingInformation(
									'Available',

									<>
										{formatNumberP2p(item.volume.toString())} {item.currency.toUpperCase()}
									</>,
								)}

								<div className="d-flex flex-row align-items-start  ">
									<span className="item-row-p2p__item-detail__information__trading__detail__label">
										{type === 'sell' ? 'Seller’s payment method' : 'Buyer’s payment method'}
									</span>

									<div className="item-row-p2p__item-detail__information__trading__detail__value__payment-method">
										{paymentSupported.map(e => {
											return item.payments.find(payment => payment.paymentConfig === e.id) ? (
												<div key={e.id}>
													<span key={e.id}>{e.name}</span>
												</div>
											) : null;
										})}
									</div>
								</div>
							</div>

							<div className="item-row-p2p__item-detail__information__trading__detail">
								{false && (
									<div className="item-row-p2p__item-detail__information__trading__detail__terms-of-use mr-3">
										<div className="item-row-p2p__item-detail__information__trading__detail__terms-of-use__title">
											Terms and conditions
										</div>
										<p className="item-row-p2p__item-detail__information__trading__detail__terms-of-use__content">
											Only accept payment with uphold NO ACCEPTO PAGOS CON NOTA de SER asi Telegram:
											BTCsaudi
										</p>
									</div>
								)}
								{/* <div className="d-flex flex-column align-items-center">
									{renderTradingInformation('Payment Time Limit', '15 Minutes')}

									<div className="d-flex flex-row align-items-center justify-content-between w-100">
										<span className="item-row-p2p__item-detail__information__trading__detail__label">
											{type==='buy' ?'Seller’s payment method':'Buyer’s payment method'}
										</span>

										<div className="item-row-p2p__item-detail__information__trading__detail__value__payment-method">
											<span>Uphold</span>
											<span>Uphold</span>
											<span>Uphold</span>

										</div>
									</div>
								</div> */}
							</div>
						</div>
					</div>
					<div className="col-5 container-fluid item-row-p2p__item-detail__amount-input mt-3">
						<div className="mb-3">
							<label className="d-flex justify-content-between">
								<span>I want to {type === 'sell' ? 'pay' : 'sell'}</span>

								{type === 'buy' && (
									<span>
										Available {formatNumberP2p(balance)} {item.currency.toUpperCase()}
									</span>
								)}
							</label>
							<Input
								value={inputAmountValueState.to}
								onChange={e => handlerInputAmount(e.target.value)}
								addonAfter={
									<div className="d-flex flex-row">
										{type === 'buy' && (
											<div
												className="item-row-p2p__item-detail__amount-input__all"
												onClick={setAllCurrency}
											>
												All
											</div>
										)}

										<span className="item-row-p2p__item-detail__amount-input__currency">
											{type === 'sell' ? item.fiat.toUpperCase() : item.currency.toUpperCase()}
										</span>
									</div>
								}
								placeholder={suggestionsWantTo().suggestions}
							/>
						</div>
						<div>
							<label>I will receive</label>
							<Input
								type="text"
								addonAfter={
									<span className="item-row-p2p__item-detail__amount-input__currency">
										{type !== 'sell' ? item.fiat.toUpperCase() : item.currency.toUpperCase()}
									</span>
								}
								placeholder="0.00"
								value={inputAmountValueState.receive}
								onChange={e => handlerInputAmountReceived(e.target.value)}
							/>
						</div>

						{type === 'buy' && (
							<>
								<div className="item-row-p2p__item-detail__amount-input__payment mt-3">
									<label>Payment Method</label>
									<div>
										<button onClick={() => setShowModal(true)}>
											{payment ? (
												<div className="item-choose-payment">
													<div className="item-choose-payment__title">
														{paymentSupported.find(e => e.id === payment.paymentConfig)?.name}
													</div>
													<div className="item-choose-payment__value">{payment.fields[0].value}</div>
												</div>
											) : (
												<div>Choose payment Method</div>
											)}
										</button>
									</div>
								</div>
								<ModalChoosePayment
									includedPaymentMethodsConfig={item.payments.map(e => e.paymentConfig)}
									show={showModal}
									onClose={() => setShowModal(false)}
									onChoose={(payment: IPaymentMethod) => {
										setPayment(payment);
										setShowModal(false);
									}}
								/>
							</>
						)}

						{inputAmountValueState.receive.toString()
							? !suggestionsWantTo().validInput && (
									<div className="item-row-p2p__item-detail__amount-input__errors">
										{!isBalanceEnough()
											? 'Your balance or available order not enough'
											: `Your 'I want to ${type === 'sell' ? 'pay' : 'sell'}' must ${
													suggestionsWantTo().suggestions
											  } ${type === 'sell' ? item.fiat.toUpperCase() : item.currency.toUpperCase()}`}
									</div>
							  )
							: null}

						<div className="item-row-p2p__item-detail__amount-input__buttons">
							<button
								className="item-row-p2p__item-detail__amount-input__buttons__cancel pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
								onClick={() =>
									setItemShow({
										...itemShow,
										show: false,
									})
								}
							>
								Cancel
							</button>

							<button
								className={classActiveConfirm}
								onClick={ handlerConfirm }
								disabled={!suggestionsWantTo().valid}
							>
								{renderTextType()} {item.currency.toUpperCase()}
							</button>
						</div>

						<div className="item-row-p2p__item-detail__amount-input__notice">
							T+1: T+1 withdrawal limit with be imposed on the purchased asset to enhance fund safety
						</div>
					</div>
				</div>
			)}

		</>
	);
};
