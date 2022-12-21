import React, { FC } from 'react';

interface P2pModalProps {
	onClose: () => void;
	visiable: boolean;
}

export const P2pModal: FC<P2pModalProps> = ({ onClose = () => undefined, visiable }) => {
	return (
		<div className={`p2p-component-modal ${visiable ? 'show' : 'hide'}`}>
			<div className="wrapper">
				<div className="p2p-component-modal__left">
					<div className="p2p-component-modal__left__info">
						<span>a</span>
						<span>achraf</span>
						<span>635 orders</span>
						<span>95.63% completion</span>
					</div>
					<div className="p2p-component-modal__left__grid">
						<div className="p2p-component-modal__left__grid__price">
							<span>Price</span>
							<span>1.024 USD</span>
							<span>12$</span>
						</div>
						<div className="p2p-component-modal__left__grid__availible">
							<span>Available</span>
							<span>4,591.65 USDT</span>
						</div>
						<div className="p2p-component-modal__left__grid__payment-limit">
							<span>Payment Time Limit</span>
							<span>15 Minutes</span>
						</div>
						<div className="p2p-component-modal__left__grid__payment-method">
							<span>Buyer's payment method</span>
							<span>Transferwise</span>
						</div>
					</div>
					<div className="p2p-component-modal__left__terms">Terms and conditions</div>
					<div className="p2p-component-modal__left__wise">Wise to wise only</div>
				</div>
				<div className="p2p-component-modal__right">
					<label className="p2p-input" htmlFor="p2p-sell">
						<span className="p2p-input__label">I want to sell</span>
						<div className="p2p-input__textbox">
							<input type="text" placeholder="0.00" />
							<button>All</button>
							<span>USDT</span>
						</div>
					</label>

					<div className="p2p-component-modal__right__transfer">
						<span>Balance: 0.00 UST</span>
						<span>Transfer</span>
					</div>

					<label className="p2p-input" htmlFor="p2p-sell">
						<span className="p2p-input__label">I will receive</span>
						<div className="p2p-input__textbox">
							<input readOnly type="text" placeholder="0.00" />
							<span>USDT</span>
						</div>
					</label>

					<div className="p2p-component-modal__right__payment-method">Payment Method</div>
					<div className="p2p-component-modal__right__set-payment-method">Set my pament method</div>

					<div className="p2p-component-modal__right__button-group">
						<button onClick={onClose}>Cancel</button>
						<button>Sell USDT</button>
					</div>
				</div>
			</div>
		</div>
	);
};
