export interface InfoOrdersCache {
	fiat?: string;
	currency?: string;
	payment?: string;
	type?: string;
}
export const getInfoCacheFilterListOrder = (key: keyof InfoOrdersCache): string | undefined => {
	const info = localStorage.getItem('infoCacheFilterListOrder');
	if (info) {
		const parser: InfoOrdersCache = JSON.parse(info);
		return parser[key];
	} else {
		return '';
	}
};

export const setInfoCacheFilterListOrder = (key: keyof InfoOrdersCache, value: string): void => {
	const info = localStorage.getItem('infoCacheFilterListOrder');
	if (info) {
		let newInfo = JSON.parse(info) as InfoOrdersCache;
		newInfo[key] = value;
		localStorage.setItem('infoCacheFilterListOrder', JSON.stringify(newInfo));
	} else {
		const newInfo = {};
		newInfo[key] = value;
		localStorage.setItem('infoCacheFilterListOrder', JSON.stringify(newInfo));
	}
};
