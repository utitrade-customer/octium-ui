import { getCsrfToken } from 'helpers';
import { uniqBy } from 'lodash';
import {
	IP2pSendMessage,
	IP2pPrivateTrade,
	IP2pUpdateTradeNextStepForPaid,
	p2pGetInfoTradeData,
	p2pPrivateTradeNewItemData,
	alertPush,
	IP2pTradeInfoMessages,
	IP2pTradeMessage,
} from 'modules';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
import { useInfoUser } from '.';
import { initSocket } from '../configs/socket.config';
import { useCallPrivateApi } from './useCallPrivateApi';

export interface IUseSocketP2pOrder {
	socket: Socket;
	sendMessage: (message: IP2pSendMessage) => void;
	tradeNextStep: (infoStep: IP2pUpdateTradeNextStepForPaid) => void;
	listMessage: IP2pTradeMessage[];
	isNewMessage: boolean;
	closeNewNotification: () => void;
}

export const ChannelSocketGet = {
	GET_LIST_MESSAGE: (room: number) => `trades/${room}/message`,
	UPDATE_TRADE: 'updateTrade',
};

export enum ChannelSocketSend {
	SEND_MESSAGE = 'trades/message',
	JOIN_ROOM_TRADE = 'trade',
	SEND_NEXT_STEP = 'trades/next',
}

export const useSocketP2pTrade = (tradeId: number): IUseSocketP2pOrder => {
	const [socket, setSocket] = useState<Socket>();
	const [listMessage, setListMessage] = useState<IP2pTradeMessage[]>([]);
	const [isNewMessage, setIsNewMessage] = useState(false);
	const dispatch = useDispatch();
	const { infoUser } = useInfoUser();
	const validCallPrivate = useCallPrivateApi();

	useEffect(() => {
		let socketConnect: Socket;
		if (validCallPrivate) {
			socketConnect = initSocket(getCsrfToken() || '', 'advertisements', 'private/socket.io');

			setSocket(socketConnect);
		}
	}, [validCallPrivate, tradeId]);

	useEffect(() => {
		if (socket) {
			socket.on('connect', function () {
				socket.emit(ChannelSocketSend.JOIN_ROOM_TRADE, {
					id: tradeId,
				});
			});
			// take all messages
			socket.on(ChannelSocketGet.GET_LIST_MESSAGE(tradeId), (data: IP2pTradeInfoMessages) => {
				setListMessage(prev => {
					return uniqBy([...prev, ...data.data], 'id');
				});

				if (data.data[0] && data.data[0].userId === infoUser?.id) {
					onScrollButton();
				} else {
					setIsNewMessage(true);
				}
			});

			socket.on(ChannelSocketGet.UPDATE_TRADE, (data: IP2pPrivateTrade) => {
				if (data.id === tradeId) {
					dispatch(
						p2pGetInfoTradeData({
							loading: false,
							payload: data,
						}),
					);
				}
			});

			socket.on('errorTrade', error => {
				dispatch(alertPush({ message: [error], type: 'error' }));
			});
		}

		return () => {
			socket && socket.disconnect();
		};
	}, [socket]);

	const sendMessage = React.useCallback(
		(message: IP2pSendMessage) => {
			if (socket) {
				socket.emit(ChannelSocketSend.SEND_MESSAGE, message);
			}
		},
		[socket],
	);

	const tradeNextStep = React.useCallback(
		(infoStep: IP2pUpdateTradeNextStepForPaid) => {
			if (socket) {
				socket.emit(ChannelSocketSend.SEND_NEXT_STEP, infoStep);
			}
		},
		[socket],
	);

	const closeNewNotification = () => {
		setIsNewMessage(false);
	};

	return { socket: socket as Socket, sendMessage, tradeNextStep, listMessage, isNewMessage, closeNewNotification };
};

export const onScrollButton = () => {
	const itemBox = document.getElementById('box-chat');
	if (itemBox) {
		itemBox.scrollTop = itemBox.scrollHeight;
	}
};

export const useSocketP2pPingHaveNewTrade = (): void => {
	const [socket, setSocket] = useState<Socket>();
	const validCallPrivate = useCallPrivateApi();
	const dispatch = useDispatch();

	useEffect(() => {
		let socketConnect: Socket;
		if (validCallPrivate) {
			socketConnect = initSocket(getCsrfToken() || '', 'advertisements', 'private/socket.io');
			setSocket(socketConnect);
		}
	}, [validCallPrivate]);

	useEffect(() => {
		if (socket) {
			// listen have new trade , update trades
			socket.on(ChannelSocketGet.UPDATE_TRADE, (data: IP2pPrivateTrade) => {
				dispatch(
					p2pPrivateTradeNewItemData({
						payload: data,
					}),
				);
			});
		}
	}, [socket]);
};
