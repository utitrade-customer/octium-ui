import React from 'react';
import { isNumber } from 'lodash';
import { P2pNavBar } from 'mobile/plugins';
import { useInfoUser, useP2pInTrade, useSocketP2pTrade } from 'plugins/P2p/hooks';
import { useEffect, useMemo, useState } from 'react';
import { MdChat } from 'react-icons/md';
import { useHistory, useParams } from 'react-router';
import { P2pChatDrawer } from '../../containers';
import { DetailContent } from './DetailContent';
import { P2pDetailDoneOrCancel } from './P2pDetailDoneOrCancel';
import { Badge } from 'antd';

export const P2pOrderDetail = () => {
	const { tradeId } = useParams<{ tradeId: string }>();
	const history = useHistory();
	!isNumber(+tradeId) && history.push('/p2p');

	const [showP2pChatDrawer, setShowP2pChatDrawer] = useState(false);
	const { error, infoTrade, infoOrder, isLoading } = useP2pInTrade(+tradeId);
	const { sendMessage, tradeNextStep, listMessage, closeNewNotification, isNewMessage } = useSocketP2pTrade(+tradeId);
	const { infoUser } = useInfoUser();

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
		error && history.push('/p2p');
	}, [error]);

	const handlerResetQuantityNewMessage = () => {
		closeNewNotification();
	};

	return (
		<div className="p2p-mobile-order-detail-screen">
			<P2pNavBar showPoster={false} />
			<div
				className="p2p-mobile-order-detail-screen__chat"
				onClick={() => {
					setShowP2pChatDrawer(true);
					handlerResetQuantityNewMessage();
				}}
			>
				<Badge className="p-2 p2p-mobile-order-detail-screen__box-chat" size="small" dot={!!isNewMessage}>
					<MdChat className="p2p-mobile-order-detail-screen__chat__icon" />
					<span className="ml-2" style={{ fontWeight: 600 }}>
						Chat
					</span>
				</Badge>
			</div>
			{infoTrade && infoOrder && (
				<>
					{infoTrade.status === 'completed' ||
					infoTrade.status === 'canceled' ||
					infoTrade.status === 'appeal pending' ? (
						<P2pDetailDoneOrCancel infoTrade={infoTrade} status={infoTrade.status} />
					) : (
						<DetailContent
							partner={partner}
							isBuyer={!!isBuyer}
							tradeNextStep={tradeNextStep}
							infoOrder={infoOrder}
							infoTrade={infoTrade}
						/>
					)}
				</>
			)}

			{infoTrade && infoUser && showP2pChatDrawer && (
				<P2pChatDrawer
					partner={partner}
					show={showP2pChatDrawer}
					onClose={() => {
						setShowP2pChatDrawer(false);
						handlerResetQuantityNewMessage();
					}}
					messages={listMessage}
					isLoading={isLoading}
					infoOrder={infoOrder}
					infoTrade={infoTrade}
					sendMessage={sendMessage}
					infoUser={infoUser}
				/>
			)}
		</div>
	);
};
