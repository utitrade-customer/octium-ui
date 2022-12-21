import React from 'react';
import { AiFillCopy } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import { FAQItem } from '../../components';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { alertPush, IP2pPrivateTrade } from 'modules';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { localeDate } from 'helpers';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';

interface P2pOrderDetailAfterNotifyingSellerProps {
	status: 'completed' | 'canceled' | 'appeal pending';
	infoTrade: IP2pPrivateTrade;
}

export const P2pDetailDoneOrCancel = (props: P2pOrderDetailAfterNotifyingSellerProps) => {
	// dispatch
	const dispatch = useDispatch();

	const { status, infoTrade } = props;

	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;

	const isCancelled = status === 'canceled';

	const renderBankInformation = () => {
		const { payment } = infoTrade;

		const data = (label: string, value: string) => {
			return (
				<div className="mb-3">
					<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content__label">
						{label}
					</div>
					<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content__value">
						{value}
						<AiFillCopy className="ml-1" onClick={() => copyTextToClipboard(value)} />
					</div>
				</div>
			);
		};

		switch (status) {
			case 'completed':
				const paymentConfig = paymentSupported.find(e => e.id === payment.paymentConfig);

				return (
					<div className={`p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content`}>
						<div className={`d-flex flex-row align-items-center`}>
							<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content__prefix"></div>
							<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content__name">
								{paymentConfig?.name}
							</div>
						</div>

						{paymentConfig && (
							<>
								{paymentConfig.fields.map((field, index) => {
									return (
										field.type !== 'image' &&
										payment.fields[index]?.value &&
										data(field.label, payment.fields[index]?.value)
									);
								})}
							</>
						)}
					</div>
				);
			case 'appeal pending':
				return (
					<div className={`p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content`}>
						<div className={`d-flex flex-row align-items-center`}>
							<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content__name">
								Please ping admin in chat to acceptance dispute resolution
							</div>
						</div>
					</div>
				);
			case 'canceled':
				return (
					<div className={`p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content`}>
						<div className={`d-flex flex-row align-items-center`}>
							<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__content__name">
								Payment method can't be display for this order
							</div>
						</div>
					</div>
				);

			default:
				return <></>;
		}
	};

	async function copyTextToClipboard(text: string) {
		dispatch(alertPush({ message: [`Copied successfully!`], type: 'success' }));
		return await navigator.clipboard.writeText(text);
	}

	const RenderHeader = () => {
		switch (status) {
			case 'canceled':
				return (
					<>
						<h4 className="p2p-mobile-order-detail-done-or-cancel-screen__header__title">
							<div className="d-flex flex-row align-items-center">
								Order Canceled
								<RiErrorWarningFill style={{ color: 'grey', marginLeft: '0.5em' }} />
							</div>
						</h4>
						<p className="p2p-mobile-order-detail-done-or-cancel-screen__header__subtitle">
							You have Canceled the order.
						</p>
					</>
				);
			case 'appeal pending':
				return (
					<>
						<h4 className="p2p-mobile-order-detail-done-or-cancel-screen__header__title">
							<div className="d-flex flex-row align-items-center">
								Order Conflict
								<RiErrorWarningFill style={{ color: 'grey', marginLeft: '0.5em' }} />
							</div>
						</h4>
						<p className="p2p-mobile-order-detail-done-or-cancel-screen__header__subtitle">Your Order Conflict.</p>
					</>
				);

			case 'completed':
				return (
					<>
						<h4 className="p2p-mobile-order-detail-done-or-cancel-screen__header__title">
							<div className="d-flex flex-row align-items-center">
								Order Completed
								<RiErrorWarningFill style={{ color: 'grey', marginLeft: '0.5em' }} />
							</div>
						</h4>
						<p className="p2p-mobile-order-detail-done-or-cancel-screen__header__subtitle">
							You have Completed the order.
						</p>
					</>
				);

			default:
				return <></>;
		}
	};

	const RenderQuestion = () => {
		return (
			<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__faq">
				<h4 className="p2p-mobile-order-detail-done-or-cancel-screen__body__faq__title">FAQ</h4>
				<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__faq__list">
					{isCancelled ? (
						<FAQItem
							question={
								'I have already paid, but the order expires and the system automatically cancels it. What should I do?'
							}
							answer={`Try to contact the other party. If you cannot reach the other party or negotiate to resolve the issue, please contact customer service.`}
						/>
					) : (
						<>
							<FAQItem
								question={'What if there is a problem in the process of coin release?'}
								answer={`Please verify that the information of the seller's account and the payment account is correct, and upload the payment voucher on the chat; If you can't contact the other party or negotiate to resolve the issue, please click "Appeal".`}
							/>
							<FAQItem
								question={'What should I do if the payment amount does not match the order amount?'}
								answer={`Contact the other party for refund; If you can't contact the other party or can't negotiate to resolve the issue, please click "Appeal".`}
							/>
							<FAQItem
								question={'There was an error in the payment transfer. What should I do?'}
								answer={`Both parties shall communicate by themselves, and the buyer shall bear the risk and consequence of transferring to the wrong account.`}
							/>
						</>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="p2p-mobile-order-detail-done-or-cancel-screen">
			<div className="p2p-mobile-order-detail-done-or-cancel-screen__header">
				<RenderHeader />
			</div>
			<div className="p2p-mobile-order-detail-done-or-cancel-screen__body">
				<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info">
					<h5 className="p2p-mobile-order-detail-done-or-cancel-screen__body__title mb-4">Order info</h5>
					<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content">
						<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__label">
							Amount
						</span>
						<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__value--emphasizing">
							{formatNumberP2p(infoTrade.total.toString())}
						</span>
					</div>
					<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content">
						<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__label">
							Price
						</span>
						<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__value">
							{formatNumberP2p(infoTrade.price.toString())} {infoTrade.fiat.toUpperCase()}
						</span>
					</div>
					<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content">
						<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__label">
							Quantity
						</span>
						<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__value">
							{formatNumberP2p(infoTrade.amount.toString())} {infoTrade.currency.toUpperCase()}
						</span>
					</div>
					<hr />
					<div className="mt-4 mb-4">
						<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content">
							<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__label">
								Order Number
							</span>
							<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__value">
								{infoTrade.numPaid}
								<AiFillCopy className="ml-1" onClick={() => copyTextToClipboard(infoTrade.numPaid)} />
							</span>
						</div>
						<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content">
							<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__label">
								Time Created
							</span>
							<span className="p2p-mobile-order-detail-done-or-cancel-screen__body__order-info__content__value">
								{localeDate(infoTrade.createdAt, 'fullDate')}
							</span>
						</div>
					</div>

					<hr />
				</div>
				<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method">
					<div className="d-flex flex-row justify-content-between align-items-center">
						<h5 className="p2p-mobile-order-detail-done-or-cancel-screen__body__title">Payment Method</h5>
						{false && (
							<div className="d-flex flex-row align-items-center">
								<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__payment-method__view-all">
									View All
								</div>
								<IoIosArrowForward />
							</div>
						)}
					</div>
					{renderBankInformation()}
				</div>

				<div className="mt-5 mb-4">
					{/* {isCancelled ? ( */}
					<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__appeal-and-cancel-order">
						Have A Question
					</div>
					{/* ) : (
						<>
							<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__appeal-and-cancel-order">
								Transaction issue, Appeal after (14:45)
							</div>
							<div className="p2p-mobile-order-detail-done-or-cancel-screen__body__appeal-and-cancel-order">
								Cancel Order
							</div>
						</>
					)} */}
				</div>

				<hr className="mb-5" />

				<RenderQuestion />
			</div>
		</div>
	);
};
