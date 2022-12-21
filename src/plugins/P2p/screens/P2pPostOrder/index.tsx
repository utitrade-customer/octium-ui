import { LoadingGif } from 'components/LoadingGif';
import { currenciesFetch } from 'modules';
import { P2pNavBar } from 'plugins/P2p/components';
import { useCheckHaveOrderOrTrade, useGetItemOrder, useP2pPublicPriceRecommend } from 'plugins/P2p/hooks';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { P2pPostOderStep1 } from './Step1';
import { P2pPostOrderStep2 } from './Step2';
import { P2pPostOrderStep3 } from './Step3';
import { isNumber } from 'lodash';

export type OrderType = 'buy' | 'sell';
export interface OrderLimit {
	min: number;
	max: number;
}

export interface PostOrderState {
	fiat?: string;
	currency?: string;
	type?: OrderType;
	price?: number;
	volume?: number;
	orderMin?: number;
	orderMax?: number;
	payments?: number[];
	minutesTimeLimit?: number;
	remarks?: string;
	autoReplyContent?: string;
	requireRegistered?: number;
	minHoldBtc?: number;
}

export const P2pPostOrder = () => {
	const { pathname } = useLocation();
	const history = useHistory();
	const { id } = useParams<{ id: string | undefined }>();
	const { err, isLoading, item } = useGetItemOrder(id, pathname);
	const [step, setStep] = useState<number>(1);
	const [postOrderState, setPostOrderState] = useState<PostOrderState>({});
	const { infoPublicOrders: infoSupport, isLoading: infoSupportedLoading } = useP2pPublicInfos();
	const { currencySupported, fiatSupported } = infoSupport;
	const { isHaving, isLoading: isLoadingHaveOrder } = useCheckHaveOrderOrTrade();
	const isPost = !id || !pathname.includes('edit-order');
	const dispatch = useDispatch();
	const { infoPrice } = useP2pPublicPriceRecommend(postOrderState.currency, postOrderState.fiat);

	useEffect(() => {
		dispatch(currenciesFetch());
	}, []);

	useEffect(() => {
		if (!isLoading && !infoSupportedLoading) {
			if (isPost) {
				setPostOrderState({
					minutesTimeLimit: 15,
					payments: [],
					requireRegistered: 0,
					minHoldBtc: 0,
					type: 'buy',
					fiat: fiatSupported[0]?.id,
					currency: currencySupported[0]?.id,
					orderMin: fiatSupported[0]?.minAmount,
					orderMax: fiatSupported[0]?.maxAmount,
				});
				setStep(1);
			} else {
				if (err) {
					history.push('/p2p');
				}

				if (!isLoading && item) {
					setPostOrderState({
						autoReplyContent: item.autoReplyContent,
						currency: item.currency,
						fiat: item.fiat,
						minHoldBtc: Number(item.minHoldBtc),
						orderMax: Number(item.orderMax),
						orderMin: Number(item.orderMin),
						payments: item.payments.map(e => e.id),
						price: Number(item.price),
						remarks: item.remarks,
						requireRegistered: item.requireRegistered,
						minutesTimeLimit: Number(item.minutesTimeLimit),
						volume: Number(item.originVolume),
						type: item.type,
					});
				}
			}
		}
	}, [err, isLoading, item, isPost, currencySupported, fiatSupported, infoSupportedLoading]);

	const priceRecommend = postOrderState.type === 'buy' ? infoPrice?.lower : infoPrice?.higher;

	useEffect(() => {
		if (isPost && infoPrice) {
			setPostOrderState(prev => ({
				...prev,
				price: priceRecommend,
			}));
		} else {
		}
	}, [postOrderState.type, infoPrice.higher, infoPrice.lower, isPost]);

	return (
		<section className="p2p-screen-post-order">
			{isLoading ||
			infoSupportedLoading ||
			!infoPrice.higher ||
			!infoPrice.lower ||
			!!!postOrderState?.type ||
			!isNumber(postOrderState.price) ? (
				<div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
					<LoadingGif />
				</div>
			) : (
				<>
					<P2pNavBar />

					<div className="container p2p-screen-post-order__head">
						<h1>{isPost ? 'Post' : 'Edit'} Normal Order</h1>

						{isHaving && isPost && !isLoadingHaveOrder && (
							<div className="p2p-screen-post-order__head__warning">
								<span>Sorry you can't add new Ads because you have already Ads or Trade</span>
							</div>
						)}
					</div>

					<div className="container p2p-screen-post-order__body">
						<div className="p2p-screen-post-order__body__steps">
							<div className="p2p-screen-post-order__body__steps__item">
								<div className="p2p-screen-post-order__body__steps__item__title">Set Type & Price</div>
								<div className={`p2p-screen-post-order__body__steps__item__dot ${step >= 1 && 'active'}`}>1</div>
							</div>
							<div className={`p2p-screen-post-order__body__steps__edge ${step > 1 && 'active'}`} />
							<div className="p2p-screen-post-order__body__steps__item">
								<div className="p2p-screen-post-order__body__steps__item__title">
									Set Total Amount & Payment Method
								</div>
								<div className={`p2p-screen-post-order__body__steps__item__dot ${step >= 2 && 'active'}`}>2</div>
							</div>
							<div className={`p2p-screen-post-order__body__steps__edge ${step > 2 && 'active'}`} />
							<div className="p2p-screen-post-order__body__steps__item">
								<div className="p2p-screen-post-order__body__steps__item__title">
									Set Remarks & Automatic Response
								</div>
								<div className={`p2p-screen-post-order__body__steps__item__dot ${step >= 3 && 'active'}`}>3</div>
							</div>
						</div>

						<P2pPostOderStep1
							postOrderState={postOrderState}
							setPostOrderState={setPostOrderState}
							setStep={setStep}
							step={step}
							isPost={isPost}
							item={item}
							isHavingPost={isHaving}
							priceRecommended={priceRecommend}
							isShow={step === 1}
						/>

						<P2pPostOrderStep2
							postOrderState={postOrderState}
							setPostOrderState={setPostOrderState}
							setStep={setStep}
							step={step}
							infoSupport={infoSupport}
							isPost={isPost}
							isShow={step === 2}
						/>

						<P2pPostOrderStep3
							step={step}
							setStep={setStep}
							postOrderState={postOrderState}
							setPostOrderState={setPostOrderState}
							isPost={isPost}
							idPost={id}
							infoSupport={infoSupport}
							isShow={step === 3}
						/>
					</div>
				</>
			)}
		</section>
	);
};
