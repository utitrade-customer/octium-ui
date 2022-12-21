import { Button, Popover, Radio, RadioChangeEvent, Steps, StepsProps, Tooltip } from 'antd';
import { localeDate } from 'helpers';
import {
	CancelConfirmationModalBottomSheet as CancelConfirmation,
	FAQItem,
	TransferredConfirmationModalBottomSheet as TransferredConfirmation,
	ModalTransferCurrency,
} from 'mobile/plugins';
import {
	alertPush,
	IItemPublicOrder,
	IP2pPrivateTrade,
	IP2pUpdateTradeNextStepForPaid,
	IPaymentMethod,
	Owner,
	p2pCancelTradesFetch,
} from 'modules';
import moment from 'moment';
import { ModalConfirmOtpP2P } from 'plugins/P2p';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { useEffect, useState } from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { AiFillCopy } from 'react-icons/ai';
import { BiLoaderCircle } from 'react-icons/bi';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';

const { Step } = Steps;

const noticeMessage = {
	step2: 'Leave the Octium platform, open your banking or payment platform to transfer the fund with your own account.',
	step3: 'Do not cancel the order if you have transferred to the seller.',
};

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
	<Popover content={<span>step {index}</span>}>{dot}</Popover>
);

let checkTimeOut;

interface IDetailContent {
	infoOrder: IItemPublicOrder;
	infoTrade: IP2pPrivateTrade;
	tradeNextStep: (infoStep: IP2pUpdateTradeNextStepForPaid) => void;
	isBuyer: boolean;
	partner: Owner | null;
}

export const DetailContent = ({ partner, isBuyer, infoOrder, infoTrade, tradeNextStep }: IDetailContent) => {
	const { status } = infoTrade;
	const [showPayment, setShowPayment] = useState<number | undefined>();
	const [showTransferredConfirmation, setShowTransferredConfirmation] = useState(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
	const [showTransferCurrency, setShowTransferCurrency] = useState(false);
	const [isHaveTime, setIsHaveTime] = useState(true);
	const [isShowPopupOtp, setIsShowPopupOtp] = useState(false);
	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;

	const dispatch = useDispatch();

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

	const rendererCountDown: CountdownRendererFn = ({ hours, minutes, seconds, completed }) => {
		const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
		const timeElm = (
			<>
				<div className="p2p-mobile-order-detail-screen__header__timer__time-block">{format(hours).charAt(0)}</div>
				<div className="p2p-mobile-order-detail-screen__header__timer__time-block">{format(hours).charAt(1)}</div>
				<div style={{ margin: '0 0.4em', fontWeight: 600 }}>:</div>
				<div className="p2p-mobile-order-detail-screen__header__timer__time-block">{format(minutes).charAt(0)}</div>
				<div className="p2p-mobile-order-detail-screen__header__timer__time-block">{format(minutes).charAt(1)}</div>
				<div style={{ margin: '0 0.4em', fontWeight: 600 }}>:</div>
				<div className="p2p-mobile-order-detail-screen__header__timer__time-block">{format(seconds).charAt(0)}</div>
				<div className="p2p-mobile-order-detail-screen__header__timer__time-block">{format(seconds).charAt(1)}</div>
			</>
		);
		if (completed) {
			return <div className="p2p-mobile-order-detail-screen__header__timer__end">END</div>;
		} else {
			return timeElm;
		}
	};

	const renderBankInformation = (id: number) => {
		const data = (label: string, value: string) => {
			return (
				<div className="mb-3">
					<div className="p2p-mobile-order-detail-screen__body__step-2__payment-methods__content__label">{label}</div>
					<div className="p2p-mobile-order-detail-screen__body__step-2__payment-methods__content__value">
						{value}
						<AiFillCopy className="ml-1" onClick={() => copyTextToClipboard(value)} />
					</div>
				</div>
			);
		};

		//

		if (!infoTrade || !infoOrder) {
			return null;
		}

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

		return (
			<div
				className={`p2p-mobile-order-detail-screen__body__step-2__payment-methods__content ${
					id !== showPayment && 'd-none'
				}`}
			>
				{paymentConfig.fields.map((e, index) => {
					return e.type !== 'image' && fields[index]?.value && data(e.label, fields[index]?.value);
				})}
			</div>
		);
	};

	const renderDetailPayment = () => {
		if (!infoOrder || !infoTrade) {
			return null;
		}

		if (infoTrade.payment) {
			const { payment } = infoTrade;
			return (
				<>
					<Radio value={payment.id} key={payment.id}>
						{paymentSupported.find(e => e.id === payment.paymentConfig)?.name}
					</Radio>
					{renderBankInformation(payment.id)}
				</>
			);
		} else {
			return (
				<>
					{infoOrder.payments.map(payment => {
						const paymentConfig = paymentSupported.find(e => e.id === payment.paymentConfig);

						if (!paymentConfig) {
							return null;
						}

						return (
							<>
								<Radio value={payment.id} key={payment.id}>
									{paymentConfig.name}
								</Radio>
								{renderBankInformation(payment.id)}
							</>
						);
					})}
				</>
			);
		}
	};

	const onConfirmTransferMoney = () => {
		tradeNextStep({
			id: infoTrade.id,
			payment: showPayment,
		});
	};

	const onShowPopupOtp = () => {
		setIsShowPopupOtp(true);
		setShowTransferCurrency(false);
	};

	const onHidePopupOtp = () => {
		setIsShowPopupOtp(false);
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

	const onConfirmCancelOrder = () => {
		dispatch(p2pCancelTradesFetch({ id: infoTrade.id }));
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
			<TransferredConfirmation
				title="Payment confirmation"
				show={showTransferredConfirmation}
				onClose={() => setShowTransferredConfirmation(false)}
				onConfirmation={onConfirmTransferMoney}
				paymentMethod={paymentInfo}
				paymentConfig={paymentConfig}
			/>
		);
	};

	const RenderQuestion = () => {
		return (
			<div className="p2p-mobile-order-detail-screen__body__faq">
				<h4 className="p2p-mobile-order-detail-screen__body__faq__title">FAQ</h4>
				<div className="p2p-mobile-order-detail-screen__body__faq__list">
					<FAQItem
						question={'How do I make a payment?'}
						answer={
							'To ensure transactions are secure, some sellers may need you to provide additional information to prove your identity, source of funds, etc. are credible.  Please chat or call the seller to obtain the payment method directly.'
						}
					/>
					<FAQItem
						question={'Is it safe to make payment to the seller?'}
						answer={
							'The advertiser has frozen the digital assets before publishing the advertisement. During the transaction, the platform will hold custody of the digital assets. You do not need to worry about not receiving the purchased crypto.'
						}
					/>
					<FAQItem
						question={'What should I look out for during the payment transfer?'}
						answer={`Please ensure that the payee's payment details are consistent with the verified information on the platform. If not, the seller has the right not to release the currency. If you have paid the seller, please do not cancel the transaction. You may return to Octium after payment and click on "Transferred, notify seller".`}
					/>
					<FAQItem
						question={'What do I do if the payment failed?'}
						answer={'Please contact the seller to confirm whether the seller supports other payment methods.'}
					/>
					<FAQItem
						question={'What if I do not want to trade any more?'}
						answer={`You can select "Cancel order" to cancel the order. If you have already make the payment to the seller, please do not cancel the transaction.`}
					/>
					<FAQItem
						question={'Does the seller charge the transaction fee?'}
						answer={
							'We recommend that you read the seller’s trading terms before placing an order. Please chat with the seller. If you choose not to pay the fee, you can cancel the order and search for another seller.'
						}
					/>
				</div>
			</div>
		);
	};

	const onChange = (e: RadioChangeEvent) => {
		setShowPayment(e.target.value);
	};

	const LoadingWaitingPartner = () => {
		return <BiLoaderCircle className="anticon-spin" />;
	};

	const RenderStepAction = (): {
		title: React.ReactElement;
		description: React.ReactElement;
	} => {
		console.log('isHaveTime', isHaveTime);

		if (!isHaveTime) {
			return {
				title: <div>Transaction Timeout !</div>,
				description: <></>,
			};
		}

		if (status === 'unpaid') {
			if (isBuyer) {
				return {
					title: (
						<div>
							After transferring the funds, click on the <b>“transferred, notify seller”</b>
						</div>
					),
					description: (
						<div>
							<Button
								className="p2p-mobile-order-detail-screen__body__step-3__transferred-button"
								onClick={() => setShowTransferredConfirmation(true)}
							>
								Transferred, notify seller
							</Button>
							<div
								className="p2p-mobile-order-detail-screen__body__step-3__cancel-order"
								onClick={() => setShowCancelConfirmation(true)}
							>
								Cancel Order
							</div>
						</div>
					),
				};
			}
			return {
				title: (
					<div>
						<LoadingWaitingPartner /> Waiting your partner transfer{' '}
					</div>
				),
				description: <></>,
			};
		} else {
			if (!isBuyer) {
				return {
					title: (
						<div>
							After received money from Partner, click on the <b>“Payment received”</b>
						</div>
					),
					description: (
						<div>
							<Button
								className="p2p-mobile-order-detail-screen__body__step-3__transferred-button"
								onClick={() => setShowTransferCurrency(true)}
							>
								Payment received
							</Button>
						</div>
					),
				};
			}
			return {
				title: (
					<div>
						<LoadingWaitingPartner /> Waiting your partner received{' '}
					</div>
				),
				description: <></>,
			};
		}
	};

	return (
		<div>
			<>
				<div className="p2p-mobile-order-detail-screen__header">
					<h4 className="p2p-mobile-order-detail-screen__header__title">
						{isBuyer ? 'Buy' : 'Sell'} {infoOrder.currency.toUpperCase()} {isBuyer ? 'From' : 'To'}{' '}
						{partner?.fullName}
					</h4>
					<p className="p2p-mobile-order-detail-screen__header__subtitle">
						The order is created, please wait for system confirmation
					</p>
					<div className="p2p-mobile-order-detail-screen__header__timer">
						<Countdown
							intervalDelay={1000}
							date={+moment(infoTrade.createdAt).add(15, 'minutes')}
							renderer={rendererCountDown}
						/>
					</div>
				</div>
				<div className="p2p-mobile-order-detail-screen__body">
					<Steps current={1} progressDot={customDot} direction="vertical">
						<Step
							className="p2p-mobile-order-detail-screen__body__step-1"
							title="Confirm order info"
							description={
								<div>
									<div className="p2p-mobile-order-detail-screen__body__step-1__content">
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__label">
											Amount
										</span>
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__value--emphasizing">
											{formatNumberP2p(infoTrade.total.toString())}
										</span>
									</div>
									<div className="p2p-mobile-order-detail-screen__body__step-1__content">
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__label">
											Price
										</span>
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__value">
											{formatNumberP2p(infoTrade.price.toString())} {infoTrade.fiat.toUpperCase()}
										</span>
									</div>
									<div className="p2p-mobile-order-detail-screen__body__step-1__content">
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__label">
											Quantity
										</span>
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__value">
											{formatNumberP2p(infoTrade.amount.toString())} {infoTrade.currency.toUpperCase()}
										</span>
									</div>
									<hr />
									<div className="p2p-mobile-order-detail-screen__body__step-1__content">
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__label">
											Order Number
										</span>
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__value">
											{infoTrade.numPaid}
											<AiFillCopy
												className="ml-1"
												onClick={() => copyTextToClipboard(infoTrade.numPaid.toString() || '')}
											/>
										</span>
									</div>
									<div className="p2p-mobile-order-detail-screen__body__step-1__content">
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__label">
											Time Created
										</span>
										<span className="p2p-mobile-order-detail-screen__body__step-1__content__value">
											{localeDate(infoTrade.createdAt, 'fullDate')}
										</span>
									</div>

									<hr />
								</div>
							}
						/>

						{(isBuyer || status === 'paid') && (
							<Step
								className="p2p-mobile-order-detail-screen__body__step-2"
								title={
									<div>
										Transfer the funds to the seller's account provided below
										<Tooltip placement="top" title={noticeMessage.step2} trigger="click">
											<RiErrorWarningFill />
										</Tooltip>
									</div>
								}
								description={
									<div>
										<div className="p2p-mobile-order-detail-screen__body__step-2__notice">
											<RiErrorWarningFill className="p2p-mobile-order-detail-screen__body__step-2__notice__icon" />
											Octium only supports real-name verified payment methods.
										</div>
										<div className="p2p-mobile-order-detail-screen__body__step-2__payment-methods">
											<Radio.Group onChange={onChange} value={showPayment}>
												<div className="d-flex flex-column">{renderDetailPayment()}</div>
											</Radio.Group>
										</div>
									</div>
								}
							/>
						)}

						<Step title={RenderStepAction().title} description={RenderStepAction().description} />
					</Steps>

					<hr className="mt-5 mb-5" />
					<RenderQuestion />
				</div>
			</>

			{status === 'unpaid' && isBuyer && <RenderBoxConfirmTransfer />}

			{status === 'paid' && !isBuyer && (
				<ModalTransferCurrency
					show={showTransferCurrency}
					onClose={() => setShowTransferCurrency(false)}
					title="Received confirmation"
					onConfirmation={onShowPopupOtp}
				/>
			)}

			{status === 'unpaid' && isBuyer && (
				<CancelConfirmation
					title="Cancel Order"
					show={showCancelConfirmation}
					onClose={() => setShowCancelConfirmation(false)}
					onConfirmation={onConfirmCancelOrder}
				/>
			)}

			<ModalConfirmOtpP2P show={isShowPopupOtp} closePopUp={onHidePopupOtp} onConfirm={onConfirmTransferCurrency} />
		</div>
	);
};
