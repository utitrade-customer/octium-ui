import React, { FC, useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { MyP2pDrawer, ReportModalBottomSheet } from '../../components';
import { Avatar, Image } from 'antd';
import { FaCheckCircle } from 'react-icons/fa';
import {
	alertPush,
	createP2PReport,
	CreateP2PReportPayload,
	IItemPublicOrder,
	IP2pPrivateTrade,
	IP2pSendMessage,
	IP2pTradeMessage,
	IP2pTypeMessage,
	Owner,
	selectCreateReportLoading,
} from 'modules';
import { MdAssistantPhoto, MdInsertPhoto } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

interface P2pChatDrawerProps {
	title?: string;
	show: boolean;
	onClose: () => void;
	infoOrder?: IItemPublicOrder;
	infoTrade: IP2pPrivateTrade;
	messages: IP2pTradeMessage[];
	sendMessage: (message: IP2pSendMessage) => void;
	isLoading: boolean;
	partner: Owner | null;
	infoUser: Owner;
}

export const P2pChatDrawer: FC<P2pChatDrawerProps> = ({
	isLoading,
	infoTrade,
	show,
	onClose,
	messages,
	sendMessage,
	infoUser,
	infoOrder,
	partner,
}) => {
	const [contentInput, setContentInput] = useState('');
	const dispatch = useDispatch();

	const ref = useRef<any>();

	useEffect(() => {
		if (ref.current && !isLoading) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [isLoading, ref, messages]);

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setContentInput(e.target.value);
	};

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
				trade: infoTrade.id,
			}),
		);
	};

	const handleCancelReport = () => {
		setIsReportModalVisible(false);
	};

	const onSendMessage = () => {
		if (contentInput.trim()) {
			sendMessage({
				content: contentInput.trim(),
				type: 'text',
				trade: infoTrade.id,
			});
			setContentInput('');
		}
	};

	const onPingAdmin = () => {
		sendMessage({
			content: contentInput,
			type: 'ping-admin',
			trade: infoTrade.id,
		});
		setContentInput('');
	};

	const convertToBase64 = file => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = error => {
				reject(error);
			};
		});
	};
	// handler img
	const onSendImage = async e => {
		const [file] = e.target.files;

		if (file) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				dispatch(alertPush({ message: ['You can only upload JPG/PNG/JPGE file!'], type: 'error' }));
			}
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isLt5M) {
				dispatch(alertPush({ message: ['Image must smaller than 5MB!'], type: 'error' }));
			}
			if (isLt5M && isJpgOrPng) {
				const base64 = (await convertToBase64(file)) as string;

				sendMessage({
					content: base64,
					type: 'image',
					trade: infoTrade.id,
				});
			}
		}
	};

	const renderMessage = (
		type: string,
		typeMessage: IP2pTypeMessage,
		content: string,
		key: string,
		role: 'admin' | 'superadmin' | 'member',
	) => {
		const classNameMessageBox = (isRight: boolean) =>
			classNames('p2p-box-chat__message-box', {
				'p2p-box-chat__message-box--right': isRight,
			});

		const classNameMessage = (type: 'admin' | 'partner' | '') =>
			classNames('p2p-box-chat__message-box__message', {
				'p2p-box-chat__message-box__message--admin': type === 'admin',
				'p2p-box-chat__message-box__message--partner': type === 'partner',
			});

		const classNameMessageImg = (isRight: boolean) =>
			classNames('p2p-box-chat__message-box__img', {
				'p2p-box-chat__message-box__img--right': isRight,
			});

		switch (typeMessage) {
			case 'ping-admin':
				return (
					<div className={classNameMessageBox(type === 'send')} key={key}>
						<div
							className={classNameMessage(
								type === 'send' ? '' : role === 'admin' || role === 'superadmin' ? 'admin' : 'partner',
							)}
						>
							<MdAssistantPhoto /> Ping Admin
						</div>
					</div>
				);

			case 'image':
				return (
					<div className={classNameMessageBox(type === 'send')} key={key}>
						<div className={classNameMessageImg(type === 'send')}>
							<Image src={content} />
						</div>
					</div>
				);

			default:
				return (
					<div className={classNameMessageBox(type === 'send')} key={key}>
						<div
							className={classNameMessage(
								type === 'send' ? '' : role === 'admin' || role === 'superadmin' ? 'admin' : 'partner',
							)}
						>
							{content}
						</div>
					</div>
				);
		}
	};

	return (
		<MyP2pDrawer
			className="p2p-mobile-container-chat-drawer"
			onClose={() => {
				onClose();
			}}
			zIndex={9999999999}
			visible={show}
			title={
				<div className="p2p-mobile-container-chat-drawer__advertiser-information d-flex flex-row">
					<Avatar className="mr-3" style={{ backgroundColor: 'black' }} icon={<UserOutlined />} />
					<div>
						<div className="p2p-mobile-container-chat-drawer__advertiser-information">{partner?.fullName}</div>
						<div className="d-flex flex-row align-items-center">
							<div className="d-flex flex-row align-items-center">
								<div className="p2p-mobile-container-chat-drawer__advertiser-information__verified-merchant">
									Verified Merchant
								</div>
								<FaCheckCircle className="p2p-mobile-container-chat-drawer__advertiser-information__verified-icon" />
							</div>
							<div
								className="p2p-mobile-container-chat-drawer__advertiser-information__report"
								onClick={() => setIsReportModalVisible(true)}
							>
								Report
							</div>
						</div>
						<div className="d-flex flex-row justify-content-between mt-3" style={{ width: '15em' }}>
							<div>
								<div className="p2p-mobile-container-chat-drawer__advertiser-information__label">30d Trades</div>
								<div className="p2p-mobile-container-chat-drawer__advertiser-information__value">
									{partner?.statistic.totalQuantity30d}
								</div>
							</div>
							<div>
								<span className="p2p-mobile-container-chat-drawer__advertiser-information__label">
									30d Completion Rate
								</span>
								<div className="p2p-mobile-container-chat-drawer__advertiser-information__value">
									{partner?.statistic.totalCompleted30d}
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<div className="p2p-mobile-container-chat-drawer__chat-box">
				<div className="p2p-mobile-container-chat-drawer__chat-box__history" ref={ref} id="box-chat">
					{infoOrder?.remarks && <P2pBoxChatNotice content={infoOrder.remarks} />}

					<div className="p2p-mobile-container-chat-drawer__chat-box__history__pinned-message">
						You have marked the order as paid, please wait for seller to confirm and release the asset.
					</div>

					{messages.map(e =>
						renderMessage(e.userId === infoUser.id ? 'send' : 'receive', e.type, e.content, e.id, e.role),
					)}
				</div>
				<div className="p2p-mobile-container-chat-drawer__chat-box__type-area">
					<input
						type="text"
						placeholder="Write a message"
						value={contentInput}
						onChange={onChangeInput}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								onSendMessage();
							}
						}}
					/>
					<button>
						<label htmlFor="inputImg" className="mb-0">
							<MdInsertPhoto />
							<input
								type="file"
								accept="image/png, image/jpg, image/jpeg"
								id="inputImg"
								className="d-none"
								onChange={e => onSendImage(e)}
							/>
						</label>
					</button>
					<button onClick={onPingAdmin}>
						<MdAssistantPhoto />
					</button>
					<button onClick={onSendMessage}>
						<IoIosSend />
					</button>
				</div>
			</div>
			<ReportModalBottomSheet
				title="Report"
				show={isReportModalVisible}
				onClose={handleCancelReport}
				onConfirmation={handleReport}
				isLoading={isCreatingReport}
			/>
		</MyP2pDrawer>
	);
};

interface P2pBoxChatNoticeProps {
	content: string;
}

const P2pBoxChatNotice: FC<P2pBoxChatNoticeProps> = ({ content }) => {
	const [show, setShow] = useState(true);
	const [isLess, setIsLess] = useState(false);

	const classNameShow = classNames('p2p-mobile-container-chat-drawer__chat-box__history__notice', {
		show: show,
		hide: !show,
	});

	return (
		<div className={classNameShow}>
			<button
				className="p2p-mobile-container-chat-drawer__chat-box__history__notice__btn-close"
				onClick={() => setShow(false)}
			>
				<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.50781 6.25L13.0234 2.73438C13.4805 2.3125 13.4805 1.60938 13.0234 1.1875L12.25 0.414062C11.8281 -0.0429688 11.125 -0.0429688 10.7031 0.414062L7.1875 3.92969L3.63672 0.414062C3.21484 -0.0429688 2.51172 -0.0429688 2.08984 0.414062L1.31641 1.1875C0.859375 1.60938 0.859375 2.3125 1.31641 2.73438L4.83203 6.25L1.31641 9.80078C0.859375 10.2227 0.859375 10.9258 1.31641 11.3477L2.08984 12.1211C2.51172 12.5781 3.21484 12.5781 3.63672 12.1211L7.1875 8.60547L10.7031 12.1211C11.125 12.5781 11.8281 12.5781 12.25 12.1211L13.0234 11.3477C13.4805 10.9258 13.4805 10.2227 13.0234 9.80078L9.50781 6.25Z"
						fill="#8A8A8A"
					/>
				</svg>
			</button>

			<p>{isLess ? content.substring(0, 80) : content}</p>

			{content.length > 80 && (
				<button
					className="p2p-mobile-container-chat-drawer__chat-box__history__notice__btn-less"
					onClick={() => setIsLess(!isLess)}
				>
					{!isLess ? 'Less' : 'Full'}
				</button>
			)}
		</div>
	);
};
