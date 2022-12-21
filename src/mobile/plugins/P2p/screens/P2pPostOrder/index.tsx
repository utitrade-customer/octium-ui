import { LoadingGif } from 'components/LoadingGif';
import { currenciesFetch } from 'modules';
import { useCheckHaveOrderOrTrade, useGetItemOrder, useP2pPublicPriceRecommend } from 'plugins/P2p/hooks';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import { PostOrderState } from 'plugins/P2p/screens/P2pPostOrder';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { P2pNavBar } from '../../components';
import { P2pPostOderStep1 } from './step1';
import { P2pPostOrderStep2 } from './step2';
import { P2pPostOrderStep3 } from './step3';
import { isNumber } from 'lodash';

export const P2pPostOrderMobileScreen = () => {
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
		<section className="p2p-post-order-mobile-screen">
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
					<P2pNavBar showPoster={false} />

					<div className="container p2p-post-order-mobile-screen__head">
						<h1>{isPost ? 'Post' : 'Edit'} Normal Order</h1>

						{isHaving && isPost && !isLoadingHaveOrder && (
							<div className="p2p-post-order-mobile-screen__head__warning">
								<span>Sorry you can't add new Ads because you have already Ads or Trade</span>
							</div>
						)}
					</div>

					<div className="container p2p-post-order-mobile-screen__body">
						<div className="p2p-post-order-mobile-screen__body__steps">
							<div className="p2p-post-order-mobile-screen__body__steps__item">
								<div className="p2p-post-order-mobile-screen__body__steps__item__title mt-2">
									Set Type & Price
								</div>

								<div className={`p2p-post-order-mobile-screen__body__steps__item__dot ${step >= 1 && 'active'}`}>
									1
								</div>
							</div>
							<div className={`p2p-post-order-mobile-screen__body__steps__edge ${step > 1 && 'active'}`} />
							<div className="p2p-post-order-mobile-screen__body__steps__item">
								<div className="p2p-post-order-mobile-screen__body__steps__item__title">
									Set Total Amount & <br />
									Payment Method
								</div>
								<div className={`p2p-post-order-mobile-screen__body__steps__item__dot ${step >= 2 && 'active'}`}>
									2
								</div>
							</div>
							<div className={`p2p-post-order-mobile-screen__body__steps__edge ${step > 2 && 'active'}`} />
							<div className="p2p-post-order-mobile-screen__body__steps__item">
								<div className="p2p-post-order-mobile-screen__body__steps__item__title">
									Set Remarks & <br />
									Automatic Response
								</div>

								<div className={`p2p-post-order-mobile-screen__body__steps__item__dot ${step >= 3 && 'active'}`}>
									3
								</div>
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
