import React, { useState } from 'react';
import { P2pDrawer } from '../P2pDrawer';
import { CoinIcon } from 'assets/icons/p2p';
import { Button } from 'antd';
import { IItemPublicOrder, IInfoSupported } from 'modules';
import { formatNumberP2p } from 'plugins/P2p/helper';
import classNames from 'classnames';
import { useHistory } from 'react-router';
// import { P2pLink } from 'plugins/P2p/components';

interface P2pItemProps {
	infoItem: IItemPublicOrder;
	infoOrderPublic: IInfoSupported;
	balance: number;
}

export const P2pItemComponent: React.FC<P2pItemProps> = props => {
	const [showDrawer, setShowDrawer] = useState(false);
	const { infoItem, infoOrderPublic, balance } = props;
	const history = useHistory();

	const symbolFiat = infoOrderPublic.fiatSupported.find(e => e.id === infoItem.fiat);

	const findNamePayment = (idPayment: number) => {
		const findPayment = infoOrderPublic.paymentSupported.find(e => e.id === idPayment);
		return findPayment ? findPayment.name : '';
	};

	const renderTextType = () => {
		const { type } = infoItem;

		return type === 'buy' ? 'Sell' : 'Buy';
	};

	const classBtnBuySell = classNames('p2p-mobile-component-item__body__right-container__btn', {
		'p2p-mobile-component-item__body__right-container__btn--buy': infoItem.type === 'sell',
		'p2p-mobile-component-item__body__right-container__btn--sell': infoItem.type === 'buy',
	});

	return (
		<div key={infoItem.id} className="p2p-mobile-component-item container-fluid">
			<div className="p2p-mobile-component-item__header">
				<div
					className="p2p-mobile-component-item__header__left-container"
					onClick={() => history.push(`/p2p/profile/${infoItem.owner.id}`)}
				>
					<CoinIcon className="p2p-mobile-component-item__header__left-container__icon" />
					<div className="p2p-mobile-component-item__header__left-container__name">{infoItem.owner?.fullName}</div>
				</div>
				<div className="p2p-mobile-component-item__header__right-container">
					<span className="p2p-mobile-component-item__header__right-container__order">
						{infoItem.owner.statistic.totalQuantity} orders
					</span>
					<span className="ml-1 mr-1">|</span>
					<span className="p2p-mobile-component-item__header__right-container__completion">
						{' '}
						{infoItem.owner.statistic.completedPercent}% completion
					</span>
				</div>
			</div>
			<div className="p2p-mobile-component-item__body">
				<div className="p2p-mobile-component-item__body__left-container">
					<div className="p2p-mobile-component-item__body__left-container__price">Price</div>
					<div className="p2p-mobile-component-item__body__left-container__number-price">
						<div className="p2p-mobile-component-item__body__left-container__number-price__value">
							{formatNumberP2p(infoItem.price.toString())}
						</div>
						<div className="p2p-mobile-component-item__body__left-container__number-price__unit">
							{infoItem.fiat.toUpperCase()}
						</div>
					</div>
					<div className="p2p-mobile-component-item__body__left-container__available-limit">
						<div className="p2p-mobile-component-item__body__left-container__available-limit__labels">
							<div className="p2p-mobile-component-item__body__left-container__available-limit__labels__label">
								Available
							</div>
							<div className="p2p-mobile-component-item__body__left-container__available-limit__labels__label">
								Limit
							</div>
						</div>
						<div className="p2p-mobile-component-item__body__left-container__available-limit__values">
							<div className="p2p-mobile-component-item__body__left-container__available-limit__values__value">
								{formatNumberP2p(infoItem.volume.toString())} {infoItem.currency.toUpperCase()}
							</div>
							<div className="p2p-mobile-component-item__body__left-container__available-limit__values__value">
								{symbolFiat?.symbol}
								{formatNumberP2p(infoItem.orderMin.toString())} - {symbolFiat?.symbol}
								{formatNumberP2p(infoItem.orderMax.toString())}
							</div>
						</div>
					</div>

					{infoItem.payments.map((item, index) => (
						<Button key={index} className="p2p-mobile-component-item__body__left-container__bank-transfer">
							{findNamePayment(item.paymentConfig)}
						</Button>
					))}
				</div>

				<div className="p2p-mobile-component-item__body__right-container">
					<button className={classBtnBuySell} onClick={() => setShowDrawer(true)}>
						{renderTextType()} {infoItem.currency.toUpperCase()}
					</button>
					{/* <P2pLink type="function" callBack={() => setShowDrawer(true)}>
						<div></div>
					</P2pLink> */}
				</div>
			</div>
			<P2pDrawer
				key={infoItem.id}
				title={`${renderTextType()} ${infoItem.fiat.toUpperCase()}`}
				infoItem={infoItem}
				show={showDrawer}
				onClose={() => setShowDrawer(false)}
				balance={balance}
				infoOrderPublic={infoOrderPublic}
			/>
		</div>
	);
};
