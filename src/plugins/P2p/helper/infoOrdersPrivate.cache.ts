export interface InfoOrdersPrivateCache {
	currency?: string;
	type?: string;
	status?: string;
}
export const getCachePrivateOrders = (key: keyof InfoOrdersPrivateCache): string | undefined => {
	const info = localStorage.getItem('infoCacheFilterOrderPrivate');
	if (info) {
		const parser: InfoOrdersPrivateCache = JSON.parse(info);
		return parser[key];
	} else {
		return '';
	}
};

export const setCachePrivateOrders = (key: keyof InfoOrdersPrivateCache, value: string): void => {
	const info = localStorage.getItem('infoCacheFilterOrderPrivate');
	if (info) {
		let newInfo = JSON.parse(info) as InfoOrdersPrivateCache;
		newInfo[key] = value;
		localStorage.setItem('infoCacheFilterOrderPrivate', JSON.stringify(newInfo));
	} else {
		const newInfo = {};
		newInfo[key] = value;
		localStorage.setItem('infoCacheFilterOrderPrivate', JSON.stringify(newInfo));
	}
};
