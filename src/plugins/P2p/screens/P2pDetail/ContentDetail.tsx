import { Steps } from 'antd';
import classNames from 'classnames';
import {
	alertPush,
	IItemPublicOrder,
	IP2pPrivateTrade,
	IP2pUpdateTradeNextStepForPaid,
	IPaymentMethod,
	p2pCancelTradesFetch,
} from 'modules';
import moment from 'moment';
import { OrderCancelModal } from 'plugins/P2p/components';
import { ModalConfirmCurrencyP2p, ModalConfirmOtpP2P, ModalConfirmP2P } from 'plugins/P2p/containers';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { useEffect, useState } from 'react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { IoIosCopy } from 'react-icons/io';
import { useDispatch } from 'react-redux';

const { Step } = Steps;

interface IContentDetail {
	infoOrder: IItemPublicOrder;
	infoTrade: IP2pPrivateTrade;
	tradeNextStep: (infoStep: IP2pUpdateTradeNextStepForPaid) => void;
	isBuyer?: boolean;
}

let checkTimeOut;

export const ContentDetail = ({ infoOrder, infoTrade, tradeNextStep, isBuyer }: IContentDetail) => {
	const [showPayment, setShowPayment] = useState<number | undefined>();
	const [showTransferCurrency, setShowTransferCurrency] = useState(false);
	const [isHaveTime, setIsHaveTime] = useState(true);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
	const [isShowPopupOtp, setIsShowPopupOtp] = useState(false);
	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;
	const { status } = infoTrade;

	const dispatch = useDispatch();

	// active payment
	useEffect(() => {
		if (infoTrade?.payment?.id) {
			setShowPayment(infoTrade.payment.id);
		} else {
			if (infoOrder?.payments[0]) {
				setShowPayment(infoOrder.payments[0].id);
			}
		}
	}, [infoOrder, infoTrade]);

	useEffect(() => {
		const now = +moment();
		const then = +moment(infoTrade.createdAt);

		//dev
		// 1000 * 60 * 15 = 15 minutes
		const timeHave = then + 1000 * 60 * 15 - now;

		if (timeHave < 0) {
			setIsHaveTime(false);
		} else {
			checkTimeOut = setTimeout(() => {
				setIsHaveTime(false);
			}, timeHave);
		}

		return () => {
			clearTimeout(checkTimeOut);
		};
	}, []);

	async function copyTextToClipboard(text: string) {
		dispatch(alertPush({ message: [`Copied successfully!`], type: 'success' }));
		return await navigator.clipboard.writeText(text);
	}

	const onConfirmTransferMoney = () => {
		infoTrade &&
			tradeNextStep({
				id: infoTrade.id,
				payment: showPayment,
			});

		setShowConfirmModal(false);
	};

	const onConfirmTransferCurrency = otp => {
		infoTrade &&
			tradeNextStep({
				id: infoTrade.id,
				payment: showPayment,
				otp,
			});
		setIsShowPopupOtp(false);
	};

	const onShowPopupOtp = () => {
		setIsShowPopupOtp(true);
		setShowTransferCurrency(false);
	};

	const onHidePopupOtp = () => {
		setIsShowPopupOtp(false);
	};

	const classActivePayment = (idPayment: number) => {
		return classNames('step-transaction__step-2__box-payment__payment__item', {
			'step-transaction__step-2__box-payment__payment__item--active': idPayment === showPayment,
		});
	};

	const renderDetailPayment = () => {
		let paymentInfo: IPaymentMethod | null | undefined = null;

		if (infoTrade.payment) {
			paymentInfo = infoTrade.payment;
		} else {
			paymentInfo = infoOrder.payments.find(e => e.id === showPayment);
		}

		if (!paymentInfo?.paymentConfig) {
			return null;
		}

		const idConfig = paymentInfo.paymentConfig;
		const fields = paymentInfo.fields;
		const paymentConfig = paymentSupported.find(e => e.id === idConfig);

		if (!paymentConfig || !fields) {
			return null;
		}

		return paymentConfig.fields.map((e, index) => {
			return (
				e.type !== 'image' &&
				fields[index]?.value && (
					<div className="step-transaction__step-2__box-payment__info__item" key={index}>
						<div className="step-transaction__step-2__box-payment__info__item__title">{e.label}</div>
						<div className="step-transaction__step-2__box-payment__info__item__desc">
							{fields[index]?.value} <IoIosCopy onClick={() => copyTextToClipboard(fields[index]?.value)} />
						</div>
					</div>
				)
			);
		});
	};

	const RenderListPayment = () => {
		if (!infoOrder || !infoTrade) {
			return null;
		}

		if (infoTrade.payment) {
			const { payment } = infoTrade;
			return (
				<div
					className={classActivePayment(payment.id)}
					onClick={() => {
						setShowPayment(payment.id);
					}}
					key={payment.id}
				>
					{paymentSupported.find(e => e.id === payment.paymentConfig)?.name}
				</div>
			);
		} else {
			return (
				<>
					{infoOrder.payments.map(payment => {
						return (
							<div
								className={classActivePayment(payment.id)}
								onClick={() => {
									setShowPayment(payment.id);
								}}
								key={payment.id}
							>
								{paymentSupported.find(e => e.id === payment.paymentConfig)?.name}
							</div>
						);
					})}
				</>
			);
		}
	};

	const LoadingWaitingPartner = () => {
		return <BiLoaderCircle className="anticon-spin" />;
	};

	const renderBoxActionOfUser = () => {
		if (!infoTrade) {
			return null;
		}

		if (!isHaveTime) {
			return (
				<div className="p2p-screen-detail__body__info__control-step">
					<div className="p2p-screen-detail__body__info__control-step__title">Transaction Timeout !</div>
				</div>
			);
		}

		switch (infoTrade.status) {
			case 'unpaid': {
				if (isBuyer) {
					return (
						<div className="p2p-screen-detail__body__info__control-step">
							<div className="p2p-screen-detail__body__info__control-step__title">
								Step1 : After transferring the funds, click on the <b>“transferred, notify seller”</b>
							</div>

							<div className="p2p-screen-detail__body__info__control-step__box-btn">
								<button
									className="p2p-screen-detail__body__info__control-step__box-btn__next-step"
									onClick={() => {
										setShowConfirmModal(true);
									}}
								>
									Transferred, notify seller
								</button>
								<button
									className="p2p-screen-detail__body__info__control-step__box-btn__cancel"
									onClick={() => setShowCancelConfirmation(true)}
								>
									Cancel Order
								</button>
							</div>
						</div>
					);
				}
				return (
					<div className="p2p-screen-detail__body__info__control-step">
						<div className="p2p-screen-detail__body__info__control-step__title">
							<LoadingWaitingPartner /> Waiting your partner transfer{' '}
						</div>
					</div>
				);
			}

			case 'paid': {
				if (!isBuyer) {
					return (
						<div className="p2p-screen-detail__body__info__control-step">
							<div className="p2p-screen-detail__body__info__control-step__title">
								Step 2 : After received money from Partner, click on the <b>“Payment received”</b>
							</div>

							<div className="p2p-screen-detail__body__info__control-step__box-btn">
								<button
									className="p2p-screen-detail__body__info__control-step__box-btn__next-step"
									onClick={() => setShowTransferCurrency(true)}
								>
									Payment received
								</button>
							</div>
						</div>
					);
				}
				return (
					<div className="p2p-screen-detail__body__info__control-step">
						<div className="p2p-screen-detail__body__info__control-step__title">
							<LoadingWaitingPartner /> Waiting your partner received
						</div>
					</div>
				);
			}

			default:
				return <></>;
		}
	};

	const onConfirmCancelOrder = () => {
		dispatch(p2pCancelTradesFetch({ id: infoTrade.id }));
		setShowCancelConfirmation(false);
	};

	const getStatusStep = (step: 1 | 2 | 3) => {
		const conditionalStep3 = infoTrade.status === 'completed';
		const conditionalStep2 = infoTrade.status === 'paid' || conditionalStep3;
		const conditionalStep1 = infoTrade.status === 'unpaid' || conditionalStep2;

		switch (step) {
			case 1:
				return conditionalStep1;
			case 2:
				return conditionalStep2;
			case 3:
				return conditionalStep3;
			default:
				return conditionalStep1;
		}
	};

	const RenderPaymentDetailCompleted = () => {
		const { payment } = infoTrade;

		const paymentConfig = paymentSupported.find(e => e.id === payment.paymentConfig);

		if (!paymentConfig) {
			return null;
		}

		return (
			<>
				<div className="box-show-completed__info__box-payment__payment__completed">
					<div className="box-show-completed__info__box-payment__payment__completed__payment-name">
						{paymentConfig.name}
					</div>
					<span>Reference message</span>
					{false && (
						<div className="box-show-completed__info__box-payment__payment__completed__id-transfer">
							092784732473857834
							<IoIosCopy onClick={() => copyTextToClipboard('092784732473857834')} />
						</div>
					)}
				</div>
				{paymentConfig && (
					<div className="box-show-completed__info__box-payment__payment__completed__detail">
						{paymentConfig.fields.map((field, index) => {
							return (
								field.type !== 'image' &&
								payment.fields[index]?.value && (
									<div className="mb-3">
										<div className="box-show-completed__info__box-payment__payment__completed__detail__title">
											{field.label}
										</div>
										<div className="box-show-completed__info__box-payment__payment__completed__detail__value">
											{payment.fields[index].value}
											<IoIosCopy
												className="ml-1"
												onClick={() => copyTextToClipboard(payment.fields[index].value)}
											/>
										</div>
									</div>
								)
							);
						})}
					</div>
				)}
			</>
		);
	};

	const RenderWhenCompletedOrCancel = (type: 'completed' | 'canceled' | 'appeal pending') => {
		return (
			<div className="box-show-completed">
				<div className="box-show-completed__info">
					<div className="box-show-completed__info__title">Order info</div>

					<div className="box-show-completed__info__box-info">
						<div className="box-show-completed__info__box-info__item">
							<div className="box-show-completed__info__box-info__item__title">Amount</div>
							<div className="box-show-completed__info__box-info__item__content box-show-completed__info__box-info__item__content--amount">
								{formatNumberP2p(infoTrade.total.toString())}
							</div>
						</div>

						<div className="box-show-completed__info__box-info__item">
							<div className="box-show-completed__info__box-info__item__title">Price</div>
							<div className="box-show-completed__info__box-info__item__content  ">
								{formatNumberP2p(infoTrade.price.toString())}
							</div>
						</div>

						<div className="box-show-completed__info__box-info__item">
							<div className="box-show-completed__info__box-info__item__title">Quantity</div>
							<div className="box-show-completed__info__box-info__item__content  ">
								{formatNumberP2p(infoTrade.amount.toString())} {infoTrade.currency.toUpperCase()}
							</div>
						</div>
					</div>
				</div>

				<div className="box-show-completed__info">
					<div className="box-show-completed__info__title">Payment method</div>

					<div className="box-show-completed__info__box-payment">
						<div className="box-show-completed__info__box-payment__payment">
							{type === 'completed' ? (
								<RenderPaymentDetailCompleted />
							) : (
								<div className="box-show-completed__info__box-payment__payment__cancelled">
									{type === 'canceled' ? (
										<>Payment method can't be display for this order</>
									) : (
										<>Please ping admin in chat to acceptance dispute resolution</>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const RenderBoxConfirmTransfer = () => {
		let paymentInfo: IPaymentMethod | null | undefined = null;

		if (!infoOrder) {
			return null;
		}

		if (infoTrade?.payment) {
			paymentInfo = infoTrade.payment;
		} else {
			paymentInfo = infoOrder.payments.find(e => e.id === showPayment);
		}

		if (!paymentInfo || !paymentInfo?.paymentConfig) {
			return null;
		}

		const idConfig = paymentInfo.paymentConfig;
		const paymentConfig = paymentSupported.find(e => e.id === idConfig);

		if (!paymentConfig) {
			return null;
		}

		return (
			<ModalConfirmP2P
				paymentMethod={paymentInfo}
				paymentConfig={paymentConfig}
				show={showConfirmModal}
				onConfirm={onConfirmTransferMoney}
				closePopUp={setShowConfirmModal}
			/>
		);
	};

	return (
		<div className="p2p-screen-detail__body__info">
			{infoTrade.status === 'completed' || infoTrade.status === 'canceled' || infoTrade.status === 'appeal pending' ? (
				RenderWhenCompletedOrCancel(infoTrade.status)
			) : (
				<>
					<div className="p2p-screen-detail__body__info__steps">
						<div className="p2p-screen-detail__body__info__steps__item">
							<div className="p2p-screen-detail__body__info__steps__item__title">Transfer payment to Seller</div>
							<div className={`p2p-screen-detail__body__info__steps__item__dot ${getStatusStep(1) && 'active'}`}>
								1
							</div>
						</div>
						<div className={`p2p-screen-detail__body__info__steps__edge ${getStatusStep(2) && 'active'}`} />
						<div className="p2p-screen-detail__body__info__steps__item">
							<div className="p2p-screen-detail__body__info__steps__item__title">
								Pending Seller to Release Cryptos
							</div>
							<div className={`p2p-screen-detail__body__info__steps__item__dot ${getStatusStep(2) && 'active'}`}>
								2
							</div>
						</div>
						<div className={`p2p-screen-detail__body__info__steps__edge ${getStatusStep(3) && 'active'}`} />
						<div className="p2p-screen-detail__body__info__steps__item">
							<div className="p2p-screen-detail__body__info__steps__item__title">Completed</div>
							<div className={`p2p-screen-detail__body__info__steps__item__dot ${getStatusStep(3) && 'active'}`}>
								3
							</div>
						</div>
					</div>

					<div className="p2p-screen-detail__body__info__line-break"></div>

					<div className="p2p-screen-detail__body__info__step-transaction">
						<Steps progressDot current={2} direction="vertical">
							<Step
								title={
									<div className="p2p-screen-detail__body__info__step-transaction__title">
										Confirm order info
									</div>
								}
								description={
									<div className="step-transaction">
										<div className="step-transaction__step-1">
											<div className="step-transaction__step-1__item">
												<div className="step-transaction__step-1__item__title">Amount</div>
												<div className="step-transaction__step-1__item__content step-transaction__step-1__item__content--amount">
													{formatNumberP2p(infoTrade.total.toString())}
												</div>
											</div>

											<div className="step-transaction__step-1__item">
												<div className="step-transaction__step-1__item__title">Price</div>
												<div className="step-transaction__step-1__item__content  ">
													{formatNumberP2p(infoTrade.price.toString())}
												</div>
											</div>

											<div className="step-transaction__step-1__item">
												<div className="step-transaction__step-1__item__title">Quantity</div>
												<div className="step-transaction__step-1__item__content  ">
													{formatNumberP2p(infoTrade.amount.toString())}{' '}
													{infoOrder.currency.toUpperCase()}
												</div>
											</div>
										</div>
									</div>
								}
							/>
							{(isBuyer || infoTrade.status === 'paid') && (
								<Step
									title={
										<div className="p2p-screen-detail__body__info__step-transaction__title">
											Transfer the funds to the seller’s account provided below.
										</div>
									}
									description={
										<div className="step-transaction">
											<div className="step-transaction__step-2">
												{false && (
													<div className="step-transaction__step-2__warning">
														<AiFillExclamationCircle />
														<span>Nemo enim ipsam voluptatem quia voluptas sit aspernatur</span>
													</div>
												)}

												<div className="step-transaction__step-2__box-payment">
													<div className="step-transaction__step-2__box-payment__payment ">
														<RenderListPayment />
													</div>
													<div className="step-transaction__step-2__box-payment__info ">
														{renderDetailPayment()}
													</div>
												</div>
											</div>
										</div>
									}
								/>
							)}

							<Step />
						</Steps>
					</div>

					{renderBoxActionOfUser()}
				</>
			)}

			{status === 'unpaid' && isBuyer && <RenderBoxConfirmTransfer />}

			{status === 'paid' && !isBuyer && (
				<ModalConfirmCurrencyP2p
					show={showTransferCurrency}
					closePopUp={() => setShowTransferCurrency(false)}
					title="Received confirmation"
					onConfirm={onShowPopupOtp}
				/>
			)}

			{status === 'unpaid' && isBuyer && (
				<OrderCancelModal
					title="Cancel Order"
					isModalVisible={showCancelConfirmation}
					handleCancel={() => setShowCancelConfirmation(false)}
					handleOk={onConfirmCancelOrder}
				/>
			)}

			<ModalConfirmOtpP2P show={isShowPopupOtp} closePopUp={onHidePopupOtp} onConfirm={onConfirmTransferCurrency} />
		</div>
	);
};
