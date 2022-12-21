import { Drawer, Input } from 'antd';
import classNames from 'classnames';
import { IInfoSupported } from 'modules';
import {
	checkNumberP2p,
	getInfoCacheFilterListOrder as cacheFilter,
	setInfoCacheFilterListOrder as setCacheFilter,
} from 'plugins/P2p/helper';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

interface P2pFilterDrawerProps {
	title: string;
	show: boolean;
	onClose: () => void;
	infoOrder: IInfoSupported;
	orderMin: string;
	setOrderMin: (value: string) => void;
	fiat: string;
	setFiat: (value: string) => void;
	payment: undefined | number;
	setPayment: (value: undefined | number) => void;
}

export const P2pFilterDrawer: FC<P2pFilterDrawerProps> = ({
	title,
	show,
	onClose,
	infoOrder,
	orderMin,
	setOrderMin,
	fiat,
	setFiat,
	payment,
	setPayment,
}) => {
	const [showAllPaymentMethod, setShowAllPaymentMethod] = useState(false);
	const [showAllFiat, setShowAllFiat] = useState(false);
	const { fiatSupported, paymentSupported } = infoOrder;
	const [orderMinRender, setOrderMinRender] = useState<string>(orderMin);

	useEffect(() => {
		const fiatCache = cacheFilter('fiat');
		if (fiatCache && fiatSupported.find(e => e.id === fiatCache)) {
			setFiat(fiatCache.toUpperCase());
		} else {
			fiatSupported[0] && setFiat(fiatSupported[0].id.toUpperCase());
		}
	}, [fiatSupported]);

	useEffect(() => {
		const paymentCache = cacheFilter('payment');

		if (paymentCache && paymentSupported.find(e => e.id === +paymentCache)) {
			setPayment(+paymentCache);
			return;
		}
		setPayment(undefined);
	}, [paymentSupported]);

	const handlerInputOrderMin: React.ChangeEventHandler<HTMLInputElement> = e => {
		const { render, value } = checkNumberP2p(e.target.value);
		setOrderMinRender(render);
		setOrderMin(value + '');
	};

	const onSelectFiat = (name: string) => {
		setFiat(name);
		setCacheFilter('fiat', name.toLocaleLowerCase());
	};

	const onSelectPayment = (id: number | undefined) => {
		setPayment(id);
		setCacheFilter('payment', id + '');
	};

	const handlerResetFilter = () => {
		setOrderMin('');
		onSelectFiat(fiatSupported[0].id.toUpperCase());
		onSelectPayment(undefined);
		onClose();
	};

	const renderPaymentMethodList = () => {
		if (paymentSupported.length == 0) {
			return null;
		}

		return paymentSupported
			.map((paymentMethod, index) => {
				const paymentClassName = 'p2p-mobile-component-filter-drawer__payment__body__item';

				return (
					<button
						className={classNames(paymentClassName, {
							[`${paymentClassName}--active`]: paymentMethod.id == payment,
						})}
						key={index}
						onClick={() => onSelectPayment(paymentMethod.id)}
					>
						{paymentMethod.name}
					</button>
				);
			})
			.slice(0, showAllPaymentMethod ? paymentSupported.length : 6);
	};

	const renderFiatList = () => {
		if (fiatSupported.length == 0) {
			return null;
		}
		return fiatSupported
			.map((fiatItem, index) => {
				const fiatClassName = 'p2p-mobile-component-filter-drawer__fiat__body__item';

				return (
					<button
						className={classNames(fiatClassName, {
							[`${fiatClassName}--active`]: fiatItem.id.toUpperCase() == fiat,
						})}
						key={index}
						onClick={() => onSelectFiat(fiatItem.id.toUpperCase())}
					>
						{fiatItem.id.toUpperCase()}
					</button>
				);
			})
			.slice(0, showAllFiat ? fiatSupported.length : 6);
	};
	const renderCloseIcon = () => {
		return (
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM15 13.59L13.59 15L10 11.41L6.41 15L5 13.59L8.59 10L5 6.41L6.41 5L10 8.59L13.59 5L15 6.41L11.41 10L15 13.59Z"
					fill="black"
				/>
			</svg>
		);
	};

	return (
		<Drawer
			className="p2p-mobile-component-filter-drawer"
			height="100vh"
			width="100vw"
			placement="bottom"
			onClose={onClose}
			visible={show}
			zIndex={9999999}
			title={title}
			closeIcon={renderCloseIcon()}
		>
			<label className="p2p-mobile-component-filter-drawer__amount-input" htmlFor="p2p-amount">
				<label>Amount</label>
				<Input
					type={'string'}
					value={orderMinRender}
					onChange={handlerInputOrderMin}
					addonAfter={
						<div className="d-flex flex-row">
							<span className="p2p-mobile-component-filter-drawer__amount-input__currency">
								{fiat.toUpperCase()}
							</span>
						</div>
					}
					placeholder="2.00 - 1,324.2"
				/>
			</label>

			<div className="p2p-mobile-component-filter-drawer__payment">
				<div className="p2p-mobile-component-filter-drawer__payment__header">
					<span className="p2p-mobile-component-filter-drawer__payment__header__title">Payment</span>

					<div
						className="p2p-mobile-component-filter-drawer__payment__header__show-all"
						onClick={() => setShowAllPaymentMethod(state => !state)}
					>
						<span>ALL ({paymentSupported.length})</span>
						{showAllPaymentMethod ? (
							<AiOutlineArrowDown className="p2p-mobile-component-filter-drawer__payment__header__show-all__up-down-icon" />
						) : (
							<AiOutlineArrowUp className="p2p-mobile-component-filter-drawer__payment__header__show-all__up-down-icon" />
						)}
					</div>
				</div>
				<div className="p2p-mobile-component-filter-drawer__payment__body">{renderPaymentMethodList()}</div>
			</div>
			<div className="p2p-mobile-component-filter-drawer__fiat">
				<div className="p2p-mobile-component-filter-drawer__fiat__header">
					<span className="p2p-mobile-component-filter-drawer__fiat__header__title">Fiat</span>
					<div
						className="p2p-mobile-component-filter-drawer__payment__header__show-all"
						onClick={() => setShowAllFiat(state => !state)}
					>
						<span>ALL ({fiatSupported.length})</span>
						{showAllFiat ? (
							<AiOutlineArrowDown className="p2p-mobile-component-filter-drawer__payment__header__show-all__up-down-icon" />
						) : (
							<AiOutlineArrowUp className="p2p-mobile-component-filter-drawer__payment__header__show-all__up-down-icon" />
						)}
					</div>
				</div>
				<div className="p2p-mobile-component-filter-drawer__fiat__body">{renderFiatList()}</div>
			</div>

			<div className="p2p-mobile-component-filter-drawer__group-btn">
				<button
					className="p2p-mobile-component-filter-drawer__group-btn__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
					onClick={handlerResetFilter}
				>
					Reset
				</button>
				<button
					className="p2p-mobile-component-filter-drawer__group-btn__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--active"
					onClick={onClose}
				>
					Confirm
				</button>
			</div>
		</Drawer>
	);
};
