import { Form, Input, Radio, Tabs } from 'antd';
import classnames from 'classnames';
import { isNumber } from 'lodash';
import { IP2PPrivateOrder } from 'modules';
import NP from 'number-precision';
import { checkNumberP2p, formatNumberP2p, increaseNumberP2p } from 'plugins/P2p/helper';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { Dispatch, FC, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { PostOrderState } from '.';

const { TabPane } = Tabs;

interface P2pPostOrderStep1Props {
	step: number;
	setStep: Dispatch<React.SetStateAction<number>>;
	postOrderState: PostOrderState;
	setPostOrderState: Dispatch<React.SetStateAction<PostOrderState>>;
	isPost: boolean;
	item: IP2PPrivateOrder | undefined;
	isHavingPost: boolean;
	priceRecommended: number;
	isShow?: boolean;
}

export type PriceType = 'Floating' | 'Fixed';

export const P2pPostOderStep1: FC<P2pPostOrderStep1Props> = ({
	postOrderState,
	setPostOrderState,
	step,
	setStep,
	isPost,
	item,
	isHavingPost,
	priceRecommended,
	isShow,
}) => {
	const { type, price, fiat, currency } = postOrderState;
	const [priceType, setPriceType] = useState<PriceType>('Fixed');
	const [priceValue, setPriceValue] = useState<string>();
	// price ? checkNumberP2p(price).render : checkNumberP2p(priceRecommended).render,
	const [priceValueFloat, setPriceValueFloat] = useState<string>('0');
	const [form] = Form.useForm();
	const { infoPublicOrders: infoSupport, isLoading: infoSupportedLoading } = useP2pPublicInfos();
	const { currencySupported, fiatSupported } = infoSupport;
	const history = useHistory();

	const isNext = useMemo(
		() => (isPost ? price && fiat && currency && type && !isHavingPost : price && fiat && currency && type),
		[fiat, isPost, isHavingPost, price, currency, type],
	);

	const fiatTmp = useMemo(() => fiatSupported.find(item => item.id === fiat), [fiat, fiatSupported]);

	useEffect(() => {
		if (fiat && currency && isNumber(price) && priceRecommended) {
			if (priceType === 'Floating') {
				setPriceValueFloat('100');
			}
			if (priceType === 'Fixed') {
				if (!isPost && price) {
					const { render } = checkNumberP2p(price);
					setPriceValue(render);
				} else {
					const { render } = checkNumberP2p(priceRecommended);
					setPriceValue(render);
				}
			}
		}
	}, [fiat, currency, priceRecommended]);

	const onChangePriceType = value => {
		if (value === 'Floating') {
			const priceTmp = price || priceRecommended;

			const newValue = NP.times(NP.divide(priceTmp, priceRecommended), 100);

			onSetPriceValueFloat(formatNumberP2p(newValue));
		}
		if (value === 'Fixed') {
			onSetPriceValue(price + '' || '');
		}

		setPriceType(value);
	};

	const setFiat = (fiat: string) => {
		setPostOrderState(prev => ({ ...prev, fiat }));
	};

	const setCurrency = (currency: string) => {
		setPostOrderState(prev => ({ ...prev, currency }));
	};

	const onSetPriceValue = (priceTmp: string) => {
		const { render, valid, value } = checkNumberP2p(priceTmp, fiatTmp?.decimal);

		valid && setPriceValue(render);

		setPostOrderState(prev => ({
			...prev,
			price: +value,
		}));
	};

	const onSetPriceValueFloat = (priceTmp: string) => {
		const { render, valid, value } = checkNumberP2p(priceTmp);

		valid && setPriceValueFloat(render);

		const newPrice = NP.divide(NP.times(priceRecommended, value), 100);

		setPostOrderState(prev => ({
			...prev,
			price: +newPrice,
		}));
	};

	const setPriceAction = (type: 'up' | 'down') => {
		if (type === 'up') {
			if (priceType === 'Floating') {
				const { value } = checkNumberP2p(priceValueFloat || 0);
				onSetPriceValueFloat(checkNumberP2p(NP.plus(value, 0.01)).render);
			} else {
				const { value } = checkNumberP2p(priceValue || 0);
				onSetPriceValue(checkNumberP2p(increaseNumberP2p(value, 'inc')).render);
			}
		}
		if (type === 'down') {
			if (price && +price > 0) {
				if (priceType === 'Floating') {
					const { value } = checkNumberP2p(priceValueFloat || 0);
					onSetPriceValueFloat(checkNumberP2p(NP.minus(value, 0.01)).render);
				} else {
					const { value } = checkNumberP2p(priceValue || 0);
					onSetPriceValue(checkNumberP2p(increaseNumberP2p(value, 'dec')).render);
				}
			}
		}
	};

	const getSymbol = () => {
		return fiatSupported.find(e => e.id === fiat)?.symbol || '';
	};

	// handle for form
	const onFinish = (values: any) => {
		if (isNext) {
			setStep(step + 1);
		} else {
			// show middleware
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.error('Failed:', errorInfo);
	};

	const classNameBtnNext = classnames('pg-p2p-config-global__btn', {
		'pg-p2p-config-global__btn--disable': !isNext,
		'pg-p2p-config-global__btn--active': isNext,
	});

	const onClickBackHome = () => {
		isPost ? history.push('/p2p') : history.push('/p2p/list');
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
			<div className="p2p-screen-post-order-step-wrapper p2p-screen-post-order__step-1">
				<Tabs
					defaultActiveKey={type}
					onChange={e => (e === 'buy' || e === 'sell' ? setPostOrderState({ ...postOrderState, type: e }) : undefined)}
				>
					<TabPane tab="I want to buy" key="buy" disabled={!isPost} />
					<TabPane tab="I want to sell" key="sell" disabled={!isPost} />
				</Tabs>
				<div className="p2p-tab-content">
					<div className="p2p-screen-post-order__step-1__radio-group">
						<h4 className="p2p-screen-post-order__step-1__radio-group__title">Asset</h4>
						<div>
							{infoSupportedLoading ? (
								'...'
							) : (
								<Radio.Group onChange={e => setCurrency(e.target.value)} value={currency}>
									{currencySupported.map(e => (
										<Radio key={e.id} value={e.id} disabled={!isPost}>
											<span
												className={!isPost ? 'p2p-screen-post-order__step-1__radio-group__disabled' : ''}
											>
												{e.id.toUpperCase()}
											</span>
										</Radio>
									))}
								</Radio.Group>
							)}
						</div>
					</div>
					<div className="p2p-screen-post-order__step-1__radio-group">
						<h4 className="p2p-screen-post-order__step-1__radio-group__title">with Cash</h4>
						<div>
							{infoSupportedLoading ? (
								'...'
							) : (
								<Radio.Group onChange={e => setFiat(e.target.value)} value={fiat}>
									{fiatSupported.map(e => (
										<Radio key={e.id} value={e.id} disabled={!isPost}>
											<span
												className={!isPost ? 'p2p-screen-post-order__step-1__radio-group__disabled' : ''}
											>
												{e.id.toUpperCase()}
											</span>
										</Radio>
									))}
								</Radio.Group>
							)}
						</div>
					</div>
					<div className="p2p-screen-post-order__step-1__init">
						<div className="p2p-screen-post-order__step-1__init__price-info">
							<div className="p2p-screen-post-order__step-1__init__price-info__price">
								<div className="mb-1">Your Price</div>
								<span className="d-flex flex-row">
									{formatNumberP2p(price || 0, fiatTmp?.decimal)}
									<div className="p2p-screen-post-order__step-1__init__price-info__price__currency ml-2">
										{getSymbol()}
									</div>
								</span>
							</div>
							<div className="p2p-screen-post-order__step-1__init__price-info__price">
								<div className="mb-1">{type === 'sell' ? 'Lowest' : 'Highest'} Order Price</div>
								<span className="d-flex flex-row align-items-center">
									{formatNumberP2p(priceRecommended, fiatTmp?.decimal)}
									<div className="p2p-screen-post-order__step-1__init__price-info__price__currency ml-2">
										{getSymbol()}
									</div>
								</span>
							</div>
						</div>
						<div className="p2p-screen-post-order__step-1__init__price-type">
							<h4>Price type</h4>
							<Radio.Group value={priceType} onChange={e => onChangePriceType(e.target.value)}>
								<Radio value="Fixed">Fixed</Radio>
								<Radio value="Floating">Floating</Radio>
							</Radio.Group>
						</div>

						<Form.Item
							name="price"
							rules={[
								{
									validator: () => {
										return !!price && price > 0
											? Promise.resolve()
											: Promise.reject(new Error(`You must input price`));
									},
								},
							]}
						>
							<div className="p2p-screen-post-order__step-1__init__price-value">
								<h4>{priceType === 'Fixed' ? 'Fixed' : 'Floating Price Margin'}</h4>
								<div className="p2p-screen-post-order__step-1__init__price-value__box">
									<button type="button" onClick={() => setPriceAction('down')} style={{ border: 'none' }}>
										{' '}
										-{' '}
									</button>

									<div style={{ position: 'relative' }}>
										{priceType === 'Fixed' ? (
											<Input
												type="text"
												value={priceValue || ''}
												onChange={e => onSetPriceValue(e.target.value)}
												style={{ border: 'none' }}
											/>
										) : (
											<Input
												type="text"
												value={priceValueFloat || ''}
												onChange={e => onSetPriceValueFloat(e.target.value)}
												style={{ border: 'none' }}
											/>
										)}

										{priceType === 'Floating' && (
											<span className="p2p-screen-post-order__step-1__init__price-value__box__percentage">
												{' '}
												%{' '}
											</span>
										)}
									</div>

									<button type="button" onClick={() => setPriceAction('up')} style={{ border: 'none' }}>
										{' '}
										+{' '}
									</button>
								</div>
							</div>
						</Form.Item>
					</div>
				</div>
			</div>
			<div className="p2p-screen-post-order__step-1__navigate">
				<button onClick={onClickBackHome} className=" pg-p2p-config-global__btn pg-p2p-config-global__btn--trans">
					Back
				</button>
				<button className={classNameBtnNext} type="submit">
					Next
				</button>
			</div>
		</Form>
	);
};
