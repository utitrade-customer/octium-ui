import { Image, Tooltip } from 'antd';
import classNames from 'classnames';
import { IItemPublicOrder, IP2pTradeMessage, IP2pTypeMessage } from 'modules';
import { onScrollButton } from 'plugins/P2p/hooks';
import React, { FC, useEffect, useState } from 'react';
import { MdAssistantPhoto } from 'react-icons/md';
export { CustomInputP2pMessage } from './CustomInputP2pMessage';
export interface IP2pBoxChat {
	infoOrder: IItemPublicOrder;
	isLoading: boolean;
	idUser: string;
	tradeId: number;
	listMessage: IP2pTradeMessage[];
}

const P2pBoxChatMemo = (props: IP2pBoxChat) => {
	const { isLoading, idUser, infoOrder, listMessage } = props;

	useEffect(() => {
		!isLoading && listMessage && onScrollButton();
	}, [isLoading]);

	const renderMessage = (
		type: 'send' | 'receive',
		typeMessage: IP2pTypeMessage,
		content: string,
		key: string,
		role: 'admin' | 'superadmin' | 'member',
	) => {
		const titleToolTip = () => {
			if (role === 'admin' || role === 'superadmin') {
				return 'Admin';
			} else {
				if (type === 'send') {
					return 'You';
				}

				return infoOrder?.owner.fullName;
			}
		};

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
					<Tooltip title={titleToolTip()} key={key}>
						<div className={classNameMessageBox(type === 'send')}>
							<div
								className={classNameMessage(
									type === 'send' ? '' : role === 'admin' || role === 'superadmin' ? 'admin' : 'partner',
								)}
							>
								<MdAssistantPhoto /> Ping Admin
							</div>
						</div>
					</Tooltip>
				);

			case 'image':
				return (
					<Tooltip title={titleToolTip()} key={key}>
						<div className={classNameMessageBox(type === 'send')}>
							<div className={classNameMessageImg(type === 'send')}>
								<Image src={content} />
							</div>
						</div>
					</Tooltip>
				);

			default:
				return (
					<Tooltip title={titleToolTip()} key={key}>
						<div className={classNameMessageBox(type === 'send')}>
							<div
								className={classNameMessage(
									type === 'send' ? '' : role === 'admin' || role === 'superadmin' ? 'admin' : 'partner',
								)}
							>
								{content}
							</div>
						</div>
					</Tooltip>
				);
		}
	};

	return (
		<div className="p2p-component-box-chat__history" id="box-chat">
			{infoOrder.remarks && <P2pBoxChatNotice content={infoOrder.remarks} />}
			{listMessage.map(e => renderMessage(e.userId === idUser ? 'send' : 'receive', e.type, e.content, e.id, e.role))}
		</div>
	);
};

interface P2pBoxChatNoticeProps {
	content: string;
}

const P2pBoxChatNotice: FC<P2pBoxChatNoticeProps> = ({ content }) => {
	const [show, setShow] = useState(true);
	const [isLess, setIsLess] = useState(false);

	const classNameShow = classNames('p2p-component-box-chat__history__notice', {
		show: show,
		hide: !show,
	});

	return (
		<div className={classNameShow}>
			<button className="p2p-component-box-chat__history__notice__btn-close" onClick={() => setShow(false)}>
				<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M9.50781 6.25L13.0234 2.73438C13.4805 2.3125 13.4805 1.60938 13.0234 1.1875L12.25 0.414062C11.8281 -0.0429688 11.125 -0.0429688 10.7031 0.414062L7.1875 3.92969L3.63672 0.414062C3.21484 -0.0429688 2.51172 -0.0429688 2.08984 0.414062L1.31641 1.1875C0.859375 1.60938 0.859375 2.3125 1.31641 2.73438L4.83203 6.25L1.31641 9.80078C0.859375 10.2227 0.859375 10.9258 1.31641 11.3477L2.08984 12.1211C2.51172 12.5781 3.21484 12.5781 3.63672 12.1211L7.1875 8.60547L10.7031 12.1211C11.125 12.5781 11.8281 12.5781 12.25 12.1211L13.0234 11.3477C13.4805 10.9258 13.4805 10.2227 13.0234 9.80078L9.50781 6.25Z"
						fill="#8A8A8A"
					/>
				</svg>
			</button>
			<p>{isLess ? content.substring(0, 80) : content}</p>

			{content.length > 80 && (
				<button className="p2p-component-box-chat__history__notice__btn-less" onClick={() => setIsLess(!isLess)}>
					{!isLess ? 'Less' : 'Full'}
				</button>
			)}
		</div>
	);
};

export const P2pBoxChat = React.memo(P2pBoxChatMemo);
