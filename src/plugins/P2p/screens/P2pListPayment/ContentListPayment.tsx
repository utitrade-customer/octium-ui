import { LoadingGif } from 'components/LoadingGif';
import P2pEmpty from 'plugins/P2p/components/P2pEmpty';
import { ModalChoosePaymentMethod } from 'plugins/P2p/containers';
import { useP2pPublicInfos, usePaymentMethodsFetch } from 'plugins/P2p/hooks';
import * as React from 'react';
import { BsPlus } from 'react-icons/bs';
import { PaymentItem } from './PaymentItem';

export const ContentListPayment = () => {
	const { listPaymentMethods, isLoading } = usePaymentMethodsFetch();
	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;

	const [isModalVisible, setIsModalVisible] = React.useState(false);
	return (
		<>
			<div className="p2p-screen-list-payment__box__header">
				<div className="p2p-screen-list-payment__box__header__left">
					<div className="p2p-screen-list-payment__box__header__left__title">P2P Payment Methods</div>
					<div className="p2p-screen-list-payment__box__header__left__desc">
						For security purposes, please use your registered account for the transaction. Up to three registered
						accounts will be shown to the counterparty.
					</div>
				</div>

				<div className="p2p-screen-list-payment__box__header__right">
					<button
						className="p2p-screen-list-payment__box__header__right__btn-add"
						onClick={() => setIsModalVisible(true)}
					>
						<BsPlus />
						Add a payment methods
					</button>
				</div>
			</div>

			<div className="p2p-screen-list-payment__box__body">
				{isLoading || paymentMethodConfigFetch.isLoading ? (
					<div className="p2p-screen-list-payment__box__body__loading">
						<LoadingGif />
					</div>
				) : (
					<>
						<div className="p2p-screen-list-payment__box__list">
							{listPaymentMethods.map((item, index) => (
								<PaymentItem
									config={paymentSupported.find(e => e.id === item.paymentConfig)}
									key={index}
									item={item}
								/>
							))}
						</div>
					</>
				)}

				{!isLoading && !paymentMethodConfigFetch.isLoading && paymentSupported.length === 0 && (
					<div className="p2p-screen-list-payment__box__body__empty">
						<P2pEmpty />
					</div>
				)}
			</div>

			<ModalChoosePaymentMethod isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
		</>
	);
};
