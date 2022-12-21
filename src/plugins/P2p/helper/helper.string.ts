export const formatLongText = (text: string, type: 'center' | 'right' = 'center', maxFormat: number = 10) => {
	if (!text) return '';
	if (text.length >= maxFormat) {
		if (type === 'center') {
			return text.slice(0, 4) + '...' + text.slice(text.length - 3);
		}

		return text.slice(0, 6) + '....';
	}

	return text;
};
