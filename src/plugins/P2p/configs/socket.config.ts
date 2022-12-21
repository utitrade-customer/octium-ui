import { p2pUrl } from 'api';
import { io, Socket } from 'socket.io-client';
import Url from 'url-parse';

export const initSocket = (csrfToken: string, namespace: string, path: string): Socket => {
	const url = new Url(p2pUrl());

	let extraHeaders = {};
	if (csrfToken) {
		extraHeaders = {
			'X-CSRF-Token': csrfToken,
		};
	}

	const socket = io(`${url.origin}/${namespace}`, {
		path: `${url.pathname}/${path}`,
		reconnectionDelayMax: 10000,
		extraHeaders: {
			...extraHeaders,
		},
		transports: ['polling'],
		secure: true,
	});
	return socket;
};
