import { getCsrfToken } from 'helpers';
import {
	IP2PPrivateOrder,
	p2pPrivateOrdersChange,
	p2pPrivateOrdersFindItemChange,
	p2pPublicOrderDataChange,
	IItemPublicOrder,
} from 'modules';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
import { initSocket } from '../configs/socket.config';

export const useSocketP2pOrder = () => {
	const [socket, setSocket] = useState<Socket>();
	const dispatch = useDispatch();

	useEffect(() => {
		const socket = initSocket(getCsrfToken() || '', 'advertisements', 'public/socket.io');

		socket.on('connect', function () {
			setSocket(socket);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on('insertOrUpdateOrder', (data: IP2PPrivateOrder) => {
				dispatch(p2pPrivateOrdersChange(data));
				dispatch(p2pPrivateOrdersFindItemChange(data));
				dispatch(p2pPublicOrderDataChange(data as IItemPublicOrder));
			});
		}
	}, [socket]);
};
