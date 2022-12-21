import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RiArrowDropRightLine, RiEdit2Fill } from 'react-icons/ri';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { FaStarOfLife } from 'react-icons/fa';
import { ContentListPayment } from '../P2pListPayment/ContentListPayment';
import { P2pNavBar, ReportModal } from 'plugins/P2p/components';
import P2pEmpty from 'plugins/P2p/components/P2pEmpty';
import { Form, Input, Modal } from 'antd';
import { clearErrorInfoUser, useCallPrivateApi, useInfoUser, useP2PValueBalances } from 'plugins/P2p/hooks';
import { useHistory, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectKycStatus } from 'modules';
import { LoadingGif } from 'components/LoadingGif';
import classNames from 'classnames';
import { formatNumberP2p } from 'plugins/P2p/helper';
import { p2pPrivateInfoUserEditNameFetch, selectInfoUserPrivate } from 'modules/plugins/p2p/infoUser';
import { createP2PReport, CreateP2PReportPayload, selectCreateReportLoading } from 'modules/plugins/p2p/reports';

export const DefaultMinLengthName = 8;
export const DefaultMaxLengthName = 20;

export const P2pUserCenter = () => {
	const { userId } = useParams<{ userId: string }>();
	const [showBalance, setShowBalance] = useState(false);
	const [isShowChangeName, setIsShowChangeName] = useState(false);
	const [inputName, setInputName] = useState('');
	const [isChanging, setIsChanging] = useState(false);
	const [form] = Form.useForm();
	const validCallPrivate = useCallPrivateApi();

	const { error, infoUser } = useInfoUser(userId);
	const { totalBTC } = useP2PValueBalances();
	const history = useHistory();
	const dispatch = useDispatch();
	const infoKyc = useSelector(selectKycStatus);

	const myInfo = useSelector(selectInfoUserPrivate);

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
				userID: infoUser?.id ?? '',
			}),
		);
	};
	const handleCancelReport = () => {
		setIsReportModalVisible(false);
	};

	React.useEffect(() => {
		// if user is in their profile => navigate to user center
		if (infoUser?.id === myInfo?.id) {
			history.push('/p2p/user-center');
		}
	}, []);

	useEffect(() => {
		if (error) {
			history.push('/p2p');
			clearErrorInfoUser(dispatch);
		}
	}, [error]);

	useEffect(() => {
		infoUser?.fullName && setInputName(infoUser.fullName);
	}, [infoUser]);

	const showChangeNicknameModal = () => {
		setIsShowChangeName(true);
	};

	const handlerChangeName = () => {
		if (inputName && inputName.length <= DefaultMaxLengthName && inputName.length >= DefaultMinLengthName) {
			setIsChanging(true);
			dispatch(
				p2pPrivateInfoUserEditNameFetch(
					{
						fullName: inputName,
					},
					() => {
						setIsShowChangeName(false);
						setIsChanging(false);
					},
				),
			);
		}
	};

	const classActiveBtnChangeName = classNames('p2p-screen-uc__change-nick-name-modal__confirm-btn', {
		'p2p-screen-uc__change-nick-name-modal__confirm-btn--active':
			inputName.length <= DefaultMaxLengthName && inputName.length >= DefaultMinLengthName,
		'p2p-screen-uc__change-nick-name-modal__confirm-btn--dis': !(
			inputName.length <= DefaultMaxLengthName && inputName.length >= DefaultMinLengthName
		),
	});

	const classActiveItemVerify = (conditional: boolean) =>
		classNames('user__face__info__verify__item', {
			'user__face__info__verify__item--active': conditional,
		});

	const RenderInfoUser = () => {
		if (infoUser) {
			const { fullName, statistic } = infoUser;
			const { totalQuantity30d, totalCompleted30d, totalCompleted } = statistic;

			return (
				<div className="container">
					<div className="p2p-screen-uc__info">
						<div className="user">
							<div className="user__face">
								<div className="user__face__img">
									<img src="https://i.pinimg.com/236x/85/a8/ae/85a8aeaf30b7966db01f2810e4039400.jpg" alt="" />
								</div>

								<div className="user__face__info">
									<div className="user__face__info__name">
										{fullName}
										{!userId && (
											<RiEdit2Fill
												className="user__face__info__edit-icon"
												onClick={showChangeNicknameModal}
											/>
										)}
										<span className="mr-2">Verified User</span>
										{myInfo && myInfo.id !== infoUser.id && (
											<div
												className="user__face__info__report"
												onClick={() => setIsReportModalVisible(true)}
											>
												Report
											</div>
										)}
									</div>
									<div className="user__face__info__verify">
										<div className={classActiveItemVerify(true)}>
											Email <FaCheckCircle />
										</div>
										<div className={classActiveItemVerify(infoKyc.status === 'verify')}>
											KYC {infoKyc.status === 'verify' ? <FaCheckCircle /> : <FaTimesCircle />}
										</div>
										{/* <div className="user__face__info__verify__item">
											SMS <FaCheckCircle />
										</div> */}
									</div>
								</div>
							</div>

							{!userId && (
								<div className="user__value">
									<div className="user__value__content">
										<div className="user__value__content__title">P2P Estimated Value (BTC)</div>
										<div className="user__value__content__amount">
											<div className="user__value__content__amount__box">
												<span>
													{showBalance ? (
														formatNumberP2p(totalBTC, 6)
													) : (
														<>
															{Array.from({ length: 5 }).map((item, index) => (
																<FaStarOfLife key={index} />
															))}
														</>
													)}
												</span>
												{showBalance ? (
													<ImEye onClick={() => setShowBalance(!showBalance)} />
												) : (
													<ImEyeBlocked onClick={() => setShowBalance(!showBalance)} />
												)}
											</div>
										</div>
									</div>

									<div className="user__value__icon">
										<RiArrowDropRightLine />
									</div>

									<div className="user__value__btn">
										<button>Become merchant</button>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="p2p-screen-uc__info ">
						<div className="trades">
							<div className="trades__item">
								<div className="trades__item__title">No. of Orders within 30 days</div>
								<div className="trades__item__value">
									{totalQuantity30d} <span>Orders</span>
								</div>
							</div>

							<div className="trades__item">
								<div className="trades__item__title">Completion Rate within 30 days</div>
								<div className="trades__item__value">
									{totalCompleted30d} <span>%</span>
								</div>
							</div>

							<div className="trades__item">
								<div className="trades__item__title">Total No. of orders</div>
								<div className="trades__item__value">
									{totalCompleted} <span>Orders</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return <></>;
	};

	return (
		<div className="p2p-screen-uc">
			<div className="background-white">
				<P2pNavBar />
				<RenderInfoUser />
			</div>

			<div className="container">
				<div className="p2p-screen-uc__body">
					{!userId && validCallPrivate && (
						<div className="box-container  list-payment ">
							<ContentListPayment />
						</div>
					)}

					<div className="feedback box-container">
						<div className="feedback__info__title">Feedback</div>
						<div className="feedback__info__percent">
							0.00 <span>%</span>
						</div>
						<div className="feedback__info__review">0 Review</div>

						<div className="feedback__box">
							<div className="feedback__box__title">
								<div className="feedback__box__title__item">All</div>
								<div className="feedback__box__title__item">Positive (0)</div>
								<div className="feedback__box__title__item">Negative (0)</div>
							</div>

							<div className="feedback__box__data">
								<div className="feedback__box__data__empty">
									<P2pEmpty />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ReportModal
				isModalVisible={isReportModalVisible}
				handleOk={handleReport}
				handleCancel={handleCancelReport}
				isLoading={isCreatingReport}
			/>

			<Modal
				className="p2p-screen-uc__change-nick-name-modal"
				title="Basic Modal"
				visible={isShowChangeName}
				onOk={() => {
					setIsShowChangeName(false);
				}}
				onCancel={() => {
					setIsShowChangeName(false);
				}}
				centered
			>
				{isChanging && (
					<div className="p2p-screen-uc__change-nick-name-modal__loading">
						<LoadingGif />
					</div>
				)}
				<h3 className="p2p-screen-uc__change-nick-name-modal__title">Set Nickname</h3>
				<div className="p2p-screen-uc__change-nick-name-modal__notice">
					<div>It is recommended not to use your real name.</div>
					<div>Nickname can only be modified once every 365 days.</div>
				</div>

				<div className="p2p-screen-uc__change-nick-name-modal__input-group">
					<label className="p2p-screen-uc__change-nick-name-modal__input-group__label">Nickname</label>
					<div className="p2p-screen-uc__change-nick-name-modal__input-group__input">
						<Input
							value={inputName}
							size="large"
							maxLength={20}
							addonAfter={
								<span>
									{inputName.length}/{DefaultMaxLengthName}
								</span>
							}
							onChange={e => {
								form.setFieldsValue({
									inputName: e.target.value,
								});
								setInputName(e.target.value);
								form.validateFields(['inputName']);
							}}
						/>
						<Form form={form}>
							<Form.Item
								name={'inputName'}
								rules={[
									{
										validator: (rule, value) => {
											if (!inputName) {
												return Promise.reject('Please input your nickname!');
											}

											if (
												!(
													inputName.length <= DefaultMaxLengthName &&
													inputName.length >= DefaultMinLengthName
												)
											) {
												return Promise.reject(
													'Nickname must be between ' +
														DefaultMinLengthName +
														' and ' +
														DefaultMaxLengthName +
														' characters',
												);
											}

											return Promise.resolve();
										},
									},
								]}
							></Form.Item>
						</Form>
					</div>
					<div className="p2p-screen-uc__change-nick-name-modal__input-group__notice">
						Last edit time was 2022-06-15. You can modify once every 365 days.
					</div>
				</div>
				<button className={classActiveBtnChangeName} onClick={handlerChangeName}>
					OK
				</button>
			</Modal>
		</div>
	);
};
