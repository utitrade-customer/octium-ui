import { getCsrfToken } from 'helpers';
import { IBalance, p2pBalancesChanged, p2pFindBalanceChanged, p2pValueBalancesChanged } from 'modules/plugins/p2p/balances';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
import { initSocket } from '../configs/socket.config';
import { useCallPrivateApi } from './useCallPrivateApi';

export const useSocketP2pBalances = () => {
	const [socket, setSocket] = useState<Socket>();
	const dispatch = useDispatch();
	const validCallPrivate = useCallPrivateApi('low');

	useEffect(() => {
		let socketConnect: Socket;

		if (validCallPrivate) {
			socketConnect = initSocket(getCsrfToken() || '', 'account', 'private/socket.io');

			socketConnect.on('connect', function () {
				console.log('useSocketP2pBalances connect');

				setSocket(socketConnect);
			});
		}

		return () => {
			socketConnect && socketConnect.disconnect();
		};
	}, [validCallPrivate]);

	useEffect(() => {
		if (socket) {
			socket.on('changeBalance', (data: IBalance) => {
				dispatch(p2pBalancesChanged(data));
				dispatch(p2pValueBalancesChanged(data));
				dispatch(p2pFindBalanceChanged(data));
			});
		}
	}, [socket]);
};
