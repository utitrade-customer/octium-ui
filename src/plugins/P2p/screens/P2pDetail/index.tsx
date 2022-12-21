import { LoadingGif } from 'components/LoadingGif';
import { localeDate } from 'helpers';
import { isNumber } from 'lodash';
import { alertPush } from 'modules';
import { IP2pPrivateTrade } from 'modules/plugins/p2p/myTrades';
import { IItemPublicOrder } from 'modules/plugins/p2p/publicOrders';
import { createP2PReport, CreateP2PReportPayload, selectCreateReportLoading } from 'modules/plugins/p2p/reports';
import moment from 'moment';
import { ReportModal } from 'plugins/P2p/components';
import { CustomInputP2pMessage, P2pBoxChat } from 'plugins/P2p/components/P2pBoxChat';
import { resetErrorInfoTrade, useInfoUser, useP2pInTrade, useSocketP2pTrade } from 'plugins/P2p/hooks';
import React, { useEffect, useMemo } from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { FaCheckCircle } from 'react-icons/fa';
import { IoIosCopy } from 'react-icons/io';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { ContentDetail } from './ContentDetail';

export const P2pDetail = () => {
	const { tradeId } = useParams<{ tradeId: string }>();
	const history = useHistory();
	!isNumber(+tradeId) && history.push('/p2p');
	const { error, infoTrade, infoOrder, isLoading } = useP2pInTrade(+tradeId);
	const dispatch = useDispatch();
	const { infoUser } = useInfoUser();

	const isCreatingReport = useSelector(selectCreateReportLoading);
	const [isReportModalVisible, setIsReportModalVisible] = React.useState(false);

	React.useEffect(() => {
		if (!isCreatingReport) {
			setIsReportModalVisible(false);
		}
	}, [isCreatingReport]);

	const handleReport = (payload: CreateP2PReportPayload) => {
		dispatch(
			createP2PReport({
				...payload,
				userID: infoOrder?.owner.id ?? '',
				trade: +tradeId,
			}),
		);
	};
	const handleCancelReport = () => {
		setIsReportModalVisible(false);
	};

	const { sendMessage, tradeNextStep, listMessage } = useSocketP2pTrade(+tradeId);

	const isBuyer = useMemo(() => {
		if (!infoOrder) {
			return undefined;
		}

		const isOwner = infoUser?.id === infoOrder?.owner.id;

		if (infoOrder.type === 'buy') {
			if (isOwner) {
				return true;
			}
			return false;
		}
		if (isOwner) {
			return false;
		}
		return true;
	}, [infoUser?.id, infoOrder]);

	const partner = useMemo(() => {
		if (!infoUser || !infoTrade || !infoTrade.owner || !infoTrade.partner) {
			return null;
		}

		if (infoUser.id === infoTrade.owner.id) {
			return infoTrade.partner;
		} else {
			return infoTrade.owner;
		}
	}, [infoUser, infoTrade]);

	useEffect(() => {
		if (error || !tradeId) {
			// reset error
			history.push('/p2p');
			resetErrorInfoTrade(dispatch);
		}
	}, [error, tradeId]);

	async function copyTextToClipboard(text: string) {
		dispatch(alertPush({ message: [`Copied successfully!`], type: 'success' }));
		return await navigator.clipboard.writeText(text);
	}

	const rendererCountDown: CountdownRendererFn = ({ hours, minutes, seconds, completed }) => {
		const format = (value: number) => (value.toString().length === 1 ? `0${value}` : value.toString());
		const timeElm = (
			<>
				<div className="p2p-screen-detail__head__left__desc">
					<span>The orders is created, please wait for system confirmation.</span>

					<div className="p2p-screen-detail__head__left__desc__date">
						{format(hours)}:{format(minutes)}:{format(seconds)}
					</div>
				</div>
			</>
		);
		if (completed) {
			return (
				<>
					<div className="p2p-screen-detail__head__left__desc">
						<span>The orders is time out!</span>

						<div className="p2p-screen-detail__head__left__desc__date">END</div>
					</div>
				</>
			);
		} else {
			return timeElm;
		}
	};

	const RenderLoading = () => {
		return (
			<div className="p2p-screen-detail__loading">
				<LoadingGif />
			</div>
		);
	};

	const RenderHeader = (infoTrade: IP2pPrivateTrade, infoOrder: IItemPublicOrder) => {
		switch (infoTrade.status) {
			case 'canceled': {
				return (
					<div className="p2p-screen-detail__head__left">
						<div className="p2p-screen-detail__head__left__title p2p-screen-detail__head__left__title--cancelled">
							Order Cancelled <RiErrorWarningFill />
						</div>

						<div className="p2p-screen-detail__head__left__desc">
							<span>You have canceled the order</span>
						</div>
					</div>
				);
			}

			case 'completed': {
				return (
					<div className="p2p-screen-detail__head__left">
						<div className="p2p-screen-detail__head__left__title p2p-screen-detail__head__left__title--completed">
							Order Completed <FaCheckCircle />
						</div>

						<div className="p2p-screen-detail__head__left__desc">
							<span>You have successfully the order</span>
						</div>
					</div>
				);
			}

			case 'appeal pending': {
				return (
					<div className="p2p-screen-detail__head__left">
						<div className="p2p-screen-detail__head__left__title p2p-screen-detail__head__left__title--completed">
							Order appeal pending
						</div>
					</div>
				);
			}

			default: {
				return (
					<div className="p2p-screen-detail__head__left">
						<div className="p2p-screen-detail__head__left__title">
							{isBuyer ? 'Buy' : 'Sell'} {infoOrder.currency.toUpperCase()} {isBuyer ? 'From' : 'To'}{' '}
							{partner?.fullName}
						</div>

						<Countdown
							intervalDelay={1000}
							date={+moment(infoTrade.createdAt).add(15, 'minutes')}
							renderer={rendererCountDown}
						/>
					</div>
				);
			}
		}
	};

	return (
		<div className="p2p-screen-detail ">
			<div className="container">
				{isLoading || !infoTrade || !infoOrder ? (
					<RenderLoading />
				) : (
					<>
						<div className="p2p-screen-detail__head">
							{RenderHeader(infoTrade, infoOrder)}

							<div className="p2p-screen-detail__head__right">
								<div className="p2p-screen-detail__head__right__item">
									<div className="p2p-screen-detail__head__right__item__title">Order number: </div>

									<div className="p2p-screen-detail__head__right__item__desc"> {infoTrade.numPaid}</div>

									<div className="p2p-screen-detail__head__right__item__icon">
										<IoIosCopy onClick={() => copyTextToClipboard(infoTrade.numPaid + '')} />
									</div>
								</div>
								<div className="p2p-screen-detail__head__right__item">
									<div className="p2p-screen-detail__head__right__item__title">Created time: </div>
									<div className="p2p-screen-detail__head__right__item__desc">
										{localeDate(infoTrade.createdAt, 'fullDate')}
									</div>
								</div>
							</div>
						</div>

						<div className="p2p-screen-detail__body">
							<ContentDetail
								isBuyer={isBuyer}
								infoOrder={infoOrder}
								infoTrade={infoTrade}
								tradeNextStep={tradeNextStep}
							/>
							<ReportModal
								isModalVisible={isReportModalVisible}
								handleOk={handleReport}
								handleCancel={handleCancelReport}
								isLoading={isCreatingReport}
							/>
							<div className="p2p-screen-detail__body__box-chat">
								{infoUser && (
									<div className="p2p-component-box-chat">
										<div className="box-show-partner">
											<div className="box-show-partner__header">
												<div className="box-show-partner__header__avatar">
													<img
														src="https://images.moneycontrol.com/static-mcnews/2021/12/Bitcoin-versus-currency-notes.jpg?impolicy=website&width=770&height=431"
														alt="Trader"
													/>
												</div>
												<div className="box-show-partner__header__name">
													<div className="box-show-partner__header__name__name">
														{partner?.fullName}
													</div>
													<div className="box-show-partner__header__name__desc">
														Trader{' '}
														<span
															style={{ cursor: 'pointer' }}
															onClick={() => setIsReportModalVisible(true)}
														>
															Report
														</span>
													</div>
												</div>
											</div>

											<div className="box-show-partner__body">
												<div className="box-show-partner__body__title">30d Trades</div>
												<div className="box-show-partner__body__title">30d Completion Rate</div>

												<div className="box-show-partner__body__desc">
													{partner?.statistic.totalQuantity30d}
												</div>

												<div className="box-show-partner__body__desc">
													{partner?.statistic.completedPercent}%
												</div>
											</div>
										</div>

										<P2pBoxChat
											infoOrder={infoOrder}
											isLoading={isLoading}
											idUser={infoUser.id}
											tradeId={+tradeId}
											listMessage={listMessage}
										/>
										<CustomInputP2pMessage sendMessage={sendMessage} />
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
