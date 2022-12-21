export interface InfoTradeCache {
	coin?: string;
	state?: string;
	status?: string;
	type?: string;
}
export const getInfoCacheMyTrade = (key: keyof InfoTradeCache): string | undefined => {
	const info = localStorage.getItem('infoCacheMyTrade');
	if (info) {
		const parser: InfoTradeCache = JSON.parse(info);
		return parser[key];
	} else {
		return '';
	}
};

export const setInfoCacheMyTrade = (key: keyof InfoTradeCache, value: string): void => {
	const info = localStorage.getItem('infoCacheMyTrade');
	if (info) {
		let newInfo = JSON.parse(info) as InfoTradeCache;
		newInfo[key] = value;
		localStorage.setItem('infoCacheMyTrade', JSON.stringify(newInfo));
	} else {
		const newInfo = {};
		newInfo[key] = value;
		localStorage.setItem('infoCacheMyTrade', JSON.stringify(newInfo));
	}
};
