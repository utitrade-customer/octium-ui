import { Input } from 'antd';
import { IInfoSupported, IItemPublicOrder, IPaymentMethod, p2pOpenTradesFetch } from 'modules';
import React, { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { MyP2pDrawer } from '../MyP2pDrawer';
import NP from 'number-precision';
import { useDispatch } from 'react-redux';
import { LoadingGif } from 'components/LoadingGif';
import classNames from 'classnames';
import { checkNumberP2p, formatNumberP2p } from 'plugins/P2p/helper';
import { ModalChoosePayment } from 'plugins/P2p/containers/ModalChoosePayment';
NP.enableBoundaryChecking(false); // default param is true

interface P2pDrawerProps {
	title: string;
	show: boolean;
	onClose: () => void;
	infoItem: IItemPublicOrder;
	infoOrderPublic: IInfoSupported;
	balance: number;
}

export const P2pDrawer: FC<P2pDrawerProps> = ({ title, show, onClose, infoItem, balance, infoOrderPublic }) => {
	const { type, price, orderMin, orderMax, volume, fiat } = infoItem;

	const history = useHistory();
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
	const { paymentSupported, fiatSupported } = infoOrderPublic;

	const fiatTmp = useMemo(() => fiatSupported.find(e => e.id === fiat), [fiatSupported, fiat]);

	const dispatch = useDispatch();

	const handlerInputAmount = (valueInput: string) => {
		const { render, valid, value } = checkNumberP2p(valueInput, type === 'sell' ? fiatTmp?.decimal : undefined);

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

	const handlerConfirm = () => {
		if (inputAmountValueState && suggestionsWantTo().valid) {
			const { valid, value } = checkNumberP2p(inputAmountValueState.to);

			if (valid) {
				dispatch(
					p2pOpenTradesFetch({
						openOrder: {
							id: infoItem.id,
							amount: type === 'sell' ? renderValueReceived().value : value,
							price: price,
							payment: type === 'buy' ? payment?.id : undefined,
							otp: '123456',
						},
						callback: (tradeId: number) => history.push(`/p2p/order-detail/${tradeId}`),
						errCallback: () => setIsOpening(false),
					}),
				);
				setIsOpening(true);
			}
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

	const renderValueReceived = () => {
		const { value } = checkNumberP2p(inputAmountValueState.to);

		const received = type === 'sell' ? NP.divide(value, price) : NP.times(value, price);

		return checkNumberP2p(received);
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

	/* const renderTextType = () => {
		return type === 'buy' ? 'Sell' : 'Buy';
	}; */

	const classActiveConfirm = classNames(
		'p2p-mobile-component-exchanging-drawer__amount-input__buttons__confirm pg-p2p-config-global__btn',
		{
			'pg-p2p-config-global__btn--active': suggestionsWantTo().valid,
			'pg-p2p-config-global__btn--disable': !suggestionsWantTo().valid,
		},
	);

	return (
		<MyP2pDrawer className={`p2p-mobile-component-exchanging-drawer `} onClose={onClose} visible={show} title={title}>
			{isOpening && (
				<div className="p2p-mobile-component-exchanging-drawer__loading">
					<LoadingGif />
				</div>
			)}
			<div className="p2p-mobile-component-exchanging-drawer__advertiser">
				<div
					className="p2p-mobile-component-exchanging-drawer__advertiser__avatar"
					onClick={() => history.push(`/p2p/profile/${infoItem.owner.id}`)}
				>
					<div className="p2p-mobile-component-exchanging-drawer__advertiser__avatar__image"></div>
					<span className="p2p-mobile-component-exchanging-drawer__advertiser__avatar__name">
						{infoItem.owner.fullName}
					</span>
				</div>
				<div className="p2p-mobile-component-exchanging-drawer__advertiser__order-completion">
					<span>{infoItem.owner.statistic.totalQuantity} orders</span>

					<span className="mr-2 ml-2">|</span>
					<span>{infoItem.owner.statistic.completedPercent}% completion</span>
				</div>
			</div>
			<div className="d-flex flex-row align-items-center mb-3 mt-3">
				<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__label">
					<span className="mb-2">Price</span>
					<span>Available</span>
				</div>
				<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__value">
					<span
						className="mb-2"
						style={{
							color: 'rgb(var(--rgb-blue))',
							fontWeight: 600,
						}}
					>
						{formatNumberP2p(infoItem.price.toString())} {infoItem.fiat.toUpperCase()}
					</span>
					<span>
						{formatNumberP2p(infoItem.volume.toString())} {infoItem.currency.toUpperCase()}
					</span>
				</div>
			</div>

			<div className="p2p-mobile-component-exchanging-drawer__amount-input">
				<div className="mb-3">
					<label className="d-flex justify-content-between">
						<span>I want to {type === 'sell' ? 'pay' : 'sell'}</span>

						{type === 'buy' && (
							<span>
								Available {formatNumberP2p(balance)} {infoItem.currency.toUpperCase()}
							</span>
						)}
					</label>{' '}
					<Input
						value={inputAmountValueState.to}
						onChange={e => handlerInputAmount(e.target.value)}
						addonAfter={
							<div className="d-flex flex-row">
								{type === 'buy' && (
									<div
										className="p2p-mobile-component-exchanging-drawer__amount-input__all"
										onClick={setAllCurrency}
									>
										All
									</div>
								)}
								<span className="p2p-mobile-component-exchanging-drawer__amount-input__currency">
									{infoItem.type === 'sell' ? infoItem.fiat.toUpperCase() : infoItem.currency.toUpperCase()}
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
							<span className="p2p-mobile-component-exchanging-drawer__amount-input__currency">
								{infoItem.type !== 'sell' ? infoItem.fiat.toUpperCase() : infoItem.currency.toUpperCase()}
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
							includedPaymentMethodsConfig={infoItem.payments.map(e => e.paymentConfig)}
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
									  } ${type === 'sell' ? infoItem.fiat.toUpperCase() : infoItem.currency.toUpperCase()}`}
							</div>
					  )
					: null}

				<div className="p2p-mobile-component-exchanging-drawer__amount-input__buttons">
					<button disabled={!suggestionsWantTo().valid} className={classActiveConfirm} onClick={handlerConfirm}>
						Confirm
					</button>
				</div>

				<div className="p2p-mobile-component-exchanging-drawer__amount-input__notice">
					T+1: T+1 withdrawal limit with be imposed on the purchased asset to enhance fund safety
				</div>
			</div>
			<div className="d-flex flex-row align-items-center mb-3 mt-3">
				<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__label">
					<span className="mb-2">Payment Time Limit</span>
					<span>Seller’s payment method</span>
				</div>
				<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__value">
					<span className="mb-2">15 Minutes</span>
					<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__value__payment-method">
						<span>Uphold</span>
					</div>
				</div>
			</div>

			<hr></hr>

			{false && (
				<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__terms-of-use">
					<div className="p2p-mobile-component-exchanging-drawer__exchanging-inform__terms-of-use__title">
						Terms and conditions
					</div>
					<p className="p2p-mobile-component-exchanging-drawer__exchanging-inform__terms-of-use__content">
						Only accept payment with uphold NO ACCEPTO PAGOS CON NOTA de SER asi Telegram: BTCsaudi
					</p>
				</div>
			)}
		</MyP2pDrawer>
	);
};
