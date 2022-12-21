import { RequestOptions } from 'api';

export const createOptionsP2p = (csrfToken?: string): RequestOptions => {
	return {
		apiVersion: 'p2p',
		headers: { 'X-CSRF-Token': csrfToken },
	};
};
