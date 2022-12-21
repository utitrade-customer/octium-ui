import { Button, Form, Input, Select } from 'antd';
import classnames from 'classnames';
import { LoadingGif } from 'components/LoadingGif';
import { IInfoSupported, IPaymentMethod } from 'modules';
import { PostOrderState } from 'plugins/P2p';
import { ItemPaymentCustom } from 'plugins/P2p/containers/ModalChoosePayment/ItemPaymentCustom';
import { useP2PFindBalanceToken, usePaymentMethodsFetch } from 'plugins/P2p/hooks';
import React, { Dispatch, FC, useEffect, useMemo, useState } from 'react';
import { ModalChoosePayment } from 'plugins/P2p/containers/ModalChoosePayment';
import { checkNumberP2p, formatNumberP2p } from 'plugins/P2p/helper';
import { isNumber } from 'lodash';

interface P2pPostOrderStep2Props {
	step: number;
	setStep: Dispatch<React.SetStateAction<number>>;
	postOrderState: PostOrderState;
	setPostOrderState: Dispatch<React.SetStateAction<PostOrderState>>;
	infoSupport: IInfoSupported;
	isPost: boolean;
	isShow?: boolean;
}

export const P2pPostOrderStep2: FC<P2pPostOrderStep2Props> = ({
	postOrderState,
	setPostOrderState,
	step,
	setStep,
	infoSupport,
	isPost,
	isShow,
}) => {
	const { fiat, type, volume, currency, orderMin, orderMax, minutesTimeLimit, price, payments } = postOrderState;
	const [showModal, setShowModal] = useState<boolean>(false);
	const { currencySupported, fiatSupported } = infoSupport;

	const [form] = Form.useForm();
	const { listPaymentMethods, isLoading } = usePaymentMethodsFetch();
	const balanceToken = useP2PFindBalanceToken((currency + '').toLocaleLowerCase());

	const fiatTmp = useMemo(() => fiatSupported.find(item => item.id === fiat), [fiat, fiatSupported]);

	useEffect(() => {
		if (fiatTmp && fiatTmp.minAmount && fiatTmp.maxAmount) {
			form.setFieldsValue({
				orderMin: formatNumberP2p(fiatTmp.minAmount.toString()),
			});
			setPostOrderState(prev => ({ ...prev, orderMin: fiatTmp.minAmount }));
		}
	}, [fiatTmp?.minAmount, fiatTmp?.maxAmount]);

	useEffect(() => {
		console.log('form.getFieldValue(volume)', form.getFieldValue('volume'));

		if (form.getFieldValue('volume')) {
			form.validateFields(['volume', 'orderMax', 'orderMin']);
		}
	}, [isShow]);

	useEffect(() => {
		let orderMinTmp, orderMaxTmp;

		if (fiatTmp) {
			orderMinTmp = orderMin || fiatTmp.minAmount;
			orderMaxTmp = orderMax || fiatTmp.maxAmount;

			form.setFieldsValue({
				orderMin: orderMinTmp ? formatNumberP2p(orderMinTmp.toString()) : '0',
				orderMax: orderMaxTmp ? formatNumberP2p(orderMaxTmp.toString()) : '0',
				minutesTimeLimit: minutesTimeLimit,
				volume: volume ? formatNumberP2p(volume.toString()) : '',
			});
		}
	}, []);

	useEffect(() => {
		if (payments && listPaymentMethods && !isLoading) {
			const newListPaymentMethods: number[] = [];

			listPaymentMethods.forEach(item => {
				if (payments.find(e => e === item.id)) {
					newListPaymentMethods.push(item.id);
				}
			});

			setPostOrderState(pre => ({ ...pre, payments: newListPaymentMethods }));
		}
	}, [listPaymentMethods, isLoading]);

	// handle for form
	const onFinish = (values: any) => {
		isActiveStep && setStep(step + 1);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.error('Failed:', errorInfo);
	};

	const getInfoAmount = (): { minAmount: number; maxAmount: number } => {
		const info = currencySupported.find(e => e.id === currency?.trim());

		return {
			minAmount: +(info?.minAmount || 0),
			maxAmount: +(info?.maxAmount || 0),
		};
	};

	const isActiveStep = !!(
		fiatTmp &&
		volume &&
		price &&
		minutesTimeLimit &&
		listPaymentMethods &&
		listPaymentMethods.length > 0 &&
		orderMax &&
		orderMin &&
		payments &&
		payments?.length > 0 &&
		volume >= getInfoAmount().minAmount &&
		volume <= getInfoAmount().maxAmount &&
		orderMin >= fiatTmp.minAmount &&
		orderMax <= fiatTmp.maxAmount &&
		orderMin <= orderMax &&
		(isPost ? orderMin <= volume * price && orderMax <= volume * price : true)
	);

	const handleChangeValue = (type: 'orderMax' | 'orderMin' | 'volume' | 'minutesTimeLimit') => {
		let valueInputTmp = form.getFieldValue(type) + '';

		const { value, render } = checkNumberP2p(
			valueInputTmp,
			type === 'orderMin' || type === 'orderMax' ? fiatTmp?.decimal : undefined,
		);

		form.setFieldsValue({
			[`${type}`]: type === 'minutesTimeLimit' ? +valueInputTmp : render,
		});

		setPostOrderState(pre => ({ ...pre, [type]: value }));

		form.validateFields(['volume', 'orderMax', 'orderMin']);
	};

	const onChoosePayment = (payment: IPaymentMethod) => {
		const idPayment = payment.id;
		// list <5 item
		if ((payments || []).length < 5 && (payments || []).findIndex(e => e === idPayment) === -1) {
			form.setFieldsValue({
				paymentMethod: [...(postOrderState.payments || []), idPayment],
			});
			setShowModal(false);
			setPostOrderState(pre => ({
				...pre,
				payments: [...(postOrderState.payments || []), idPayment],
			}));
		}
	};

	const onRemovePayment = (idPayment: number) => {
		form.setFieldsValue({
			paymentMethod: [...(postOrderState.payments || [])].filter(e => e !== idPayment),
		});
		setPostOrderState(pre => ({
			...pre,
			payments: [...(postOrderState.payments || [])].filter(e => e !== idPayment),
		}));
	};

	const setAllCurrency = () => {
		const balance = balanceToken?.balance?.balance;
		if (Number(balance) === balance) {
			if (balance > getInfoAmount().maxAmount) {
				form.setFieldsValue({
					[`volume`]: formatNumberP2p(getInfoAmount().maxAmount.toString()),
				});

				setPostOrderState(pre => ({ ...pre, volume: getInfoAmount().maxAmount }));
				return;
			}

			form.setFieldsValue({
				[`volume`]: formatNumberP2p(balance.toString()),
			});

			setPostOrderState(pre => ({ ...pre, volume: balance }));
		}
	};

	const classNameBtnNext = classnames('p2p-post-order-mobile-screen__step-2__navigate__button pg-p2p-config-global__btn', {
		'pg-p2p-config-global__btn--disable': !isActiveStep,
		'pg-p2p-config-global__btn--active': isActiveStep,
	});

	const classNameBtnActiveAddPayment = classnames(
		'p2p-screen-post-order__step-2__payment__method__add-btn mb-3 pg-p2p-config-global__btn',
		{
			'pg-p2p-config-global__btn--disable': payments && payments.length >= 5,
			'pg-p2p-config-global__btn--active': !(payments && payments.length >= 5),
		},
	);

	const RenderListPaymentMethod = () => {
		if (listPaymentMethods.length === 0) {
			return null;
		}

		if (isLoading) {
			return (
				<div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
					<LoadingGif />
				</div>
			);
		}

		return (
			<>
				{listPaymentMethods.map((e, index) => {
					if ((payments || []).includes(e.id)) {
						return <ItemPaymentCustom key={index} onChoose={() => {}} item={e} onRemove={onRemovePayment} />;
					}
					return null;
				})}
			</>
		);
	};

	if (!isShow) {
		return null;
	}

	return (
		<Form
			initialValues={{ remember: true }}
			autoComplete="off"
			className="w-100"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			form={form}
		>
			{price && currency && fiat && (
				<div className="p2p-post-order-mobile-screen-step-wrapper p2p-post-order-mobile-screen__step-2">
					<div className="p2p-post-order-mobile-screen__step-2__form">
						<div className="p2p-post-order-mobile-screen__step-2__form__total-amount">
							<h4 className="p2p-post-order-mobile-screen__step-2__form__total-amount__label">Asset</h4>
							<div className="p2p-post-order-mobile-screen__step-2__form__total-amount__input">
								<Form.Item
									name="volume"
									rules={[
										{
											validator: (_, value) => {
												if (!volume) {
													return Promise.reject(
														new Error(`Enter trading volume,volume should be greater than 0`),
													);
												}

												if (volume < getInfoAmount().minAmount) {
													return Promise.reject(
														new Error(
															`Total volume should not be less than ${getInfoAmount().minAmount}`,
														),
													);
												}

												if (volume > getInfoAmount().maxAmount) {
													return Promise.reject(
														new Error(
															`Total volume should be less than ${getInfoAmount().maxAmount}`,
														),
													);
												}

												const balance = balanceToken?.balance?.balance;

												if (isNumber(balance) && type === 'sell' && isPost) {
													if (volume > balance) {
														return Promise.reject(new Error(`Your balance is not enough !`));
													}
												}

												return Promise.resolve();
											},
										},
									]}
								>
									<Input
										type={'string'}
										placeholder="0"
										addonAfter={<div>{currency.toUpperCase()}</div>}
										size="large"
										onChange={() => handleChangeValue('volume')}
										disabled={!isPost}
									/>
								</Form.Item>
								<div className="d-flex flex-row justify-content-between align-items-center">
									{type === 'sell' && (
										<>
											<div className="d-flex flex-row align-items-center">
												<span className="p2p-post-order-mobile-screen__step-2__form__total-amount__input__subtitle">
													Available:{' '}
													{formatNumberP2p(balanceToken.balance ? balanceToken.balance.balance : 0)}{' '}
													{currency.toUpperCase()} {currency.toUpperCase()}
												</span>
												<div
													onClick={setAllCurrency}
													className="p2p-post-order-mobile-screen__step-2__form__total-amount__input__subtitle--all"
												>
													All
												</div>
											</div>
											{/* <span className="p2p-post-order-mobile-screen__step-2__form__total-amount__input__subtitle">
										{'> 0 VND'}
									</span> */}
										</>
									)}
								</div>
								<div style={{ color: 'rgb(var(--rgb-blue))' }}>
									{volume === 0
										? ''
										: volume &&
										  volume >= getInfoAmount().minAmount && (
												<>
													<span>
														{formatNumberP2p(volume)} {currency.toUpperCase()} ≈{' '}
														{formatNumberP2p(((volume || 0) * price).toString())} {fiat.toUpperCase()}
													</span>
												</>
										  )}
								</div>
							</div>
						</div>
						<div className="p2p-post-order-mobile-screen__step-2__form__order-limit">
							<h4 className="p2p-post-order-mobile-screen__step-2__form__order-limit__label">Order Limit</h4>
							<div className="p2p-post-order-mobile-screen__step-2__form__order-limit__input">
								<Form.Item
									name="orderMin"
									rules={[
										{
											validator: (_, value) => {
												const orderMinTmp = postOrderState?.orderMin || 0;
												const orderMaxTmp = postOrderState?.orderMax || 0;

												if (orderMinTmp <= 0) {
													return Promise.reject(new Error(`Order min should be greater than 0`));
												}

												if (fiatTmp && orderMinTmp < fiatTmp.minAmount) {
													return Promise.reject(
														new Error(
															`Order min should be greater than ${formatNumberP2p(
																fiatTmp.minAmount,
															)}`,
														),
													);
												}

												if (fiatTmp && orderMinTmp > fiatTmp.maxAmount) {
													return Promise.reject(
														new Error(
															`Order min should be less than ${formatNumberP2p(fiatTmp.maxAmount)}`,
														),
													);
												}

												if (orderMaxTmp < orderMinTmp) {
													return Promise.reject(new Error(`Order min should be less than order max`));
												}

												if (postOrderState?.volume && price && isPost) {
													if (orderMinTmp > postOrderState?.volume * price) {
														return Promise.reject(
															new Error(`Order min should be less than available amount`),
														);
													}
												}

												return Promise.resolve();
											},
										},
									]}
								>
									<Input
										type="text"
										addonAfter={<div>{fiat.toUpperCase()}</div>}
										size="large"
										onChange={() => handleChangeValue('orderMin')}
									/>
								</Form.Item>
								<Form.Item
									name="orderMax"
									rules={[
										{
											validator: (_, value) => {
												const orderMinTmp = postOrderState?.orderMin || 0;
												const orderMaxTmp = postOrderState?.orderMax || 0;

												if (orderMaxTmp <= 0) {
													return Promise.reject(new Error(`Order max should be greater than 0`));
												}

												if (orderMaxTmp < orderMinTmp) {
													return Promise.reject(
														new Error(`Order max should be greater than order min`),
													);
												}

												if (fiatTmp && orderMaxTmp > fiatTmp.maxAmount) {
													return Promise.reject(
														new Error(
															`Order max should be less than ${formatNumberP2p(fiatTmp.maxAmount)}`,
														),
													);
												}

												if (fiatTmp && orderMinTmp < fiatTmp.minAmount) {
													return Promise.reject(
														new Error(
															`Order min should be greater than ${formatNumberP2p(
																fiatTmp.minAmount,
															)}`,
														),
													);
												}

												if (postOrderState?.volume && price && isPost) {
													if (orderMaxTmp > postOrderState?.volume * price) {
														return Promise.reject(
															new Error(`Order max should be less than available amount`),
														);
													}
												}

												return Promise.resolve();
											},
										},
									]}
								>
									<Input
										type="text"
										addonAfter={<div>{fiat.toUpperCase()}</div>}
										size="large"
										onChange={() => handleChangeValue('orderMax')}
									/>
								</Form.Item>
							</div>
						</div>
					</div>
					<div className="p2p-post-order-mobile-screen__step-2__payment">
						<div className="p2p-post-order-mobile-screen__step-2__payment__method">
							<div className="p2p-post-order-mobile-screen__step-2__payment__method__label">Payment Method</div>
							<div className="p2p-post-order-mobile-screen__step-2__payment__method__sub-label">
								Select up to 5 methods
							</div>
							<div className="p2p-post-order-mobile-screen__step-2__payment__method__button">
								<Button
									className={classNameBtnActiveAddPayment}
									onClick={e => setShowModal(!showModal)}
									disabled={payments && payments.length >= 5}
								>
									+ Add
								</Button>
								<ModalChoosePayment
									show={showModal}
									onClose={() => setShowModal(false)}
									onChoose={onChoosePayment}
								/>

								{RenderListPaymentMethod()}
								<Form.Item
									name="paymentMethod"
									rules={[
										{
											validator: () => {
												return payments && payments.length > 0
													? Promise.resolve()
													: Promise.reject(new Error(`You must choose one payment method`));
											},
										},
									]}
								>
									<Input className="d-none"></Input>
								</Form.Item>
							</div>
						</div>
						<div className="p2p-post-order-mobile-screen__step-2__payment__time-limit">
							<div className="p2p-post-order-mobile-screen__step-2__payment__time-limit__label">
								Payment Time Limit
							</div>
							<div className="p2p-post-order-mobile-screen__step-2__payment__time-limit__drop-down">
								<Form.Item name="minutesTimeLimit">
									<Select size="large" onChange={() => handleChangeValue('minutesTimeLimit')}>
										<Select.Option value={15}>15 mins</Select.Option>
										<Select.Option value={30}>30 mins</Select.Option>
										<Select.Option value={45}>45 mins</Select.Option>
										<Select.Option value={60}>1 hr</Select.Option>
										<Select.Option value={120}>2 hr</Select.Option>
									</Select>
								</Form.Item>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="p2p-post-order-mobile-screen__step-2__navigate">
				<button
					className="p2p-post-order-mobile-screen__step-2__navigate__button pg-p2p-config-global__btn pg-p2p-config-global__btn--trans"
					onClick={() => setStep(step - 1)}
				>
					Previous
				</button>
				<button className={classNameBtnNext} type="submit">
					Next
				</button>
			</div>
		</Form>
	);
};
