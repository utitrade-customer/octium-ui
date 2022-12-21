import toString from 'lodash/toString';
import _toNumber from 'lodash/toNumber';
export const formatNumber = (value: any, precision?: number) => {
	value = toString(value);
	if (precision) {
		value = toString(_toNumber(value).toFixed(precision));
	}
	let result = value;
	if (value.indexOf('e') !== -1) {
		const exponent = parseInt(value.split('-')[1], 10);
		result = _toNumber(value).toFixed(exponent);
	}
	const stringFormat = `${result}`;
	const x = stringFormat.split('.');
	let x1 = x[0];
	const x2 = x.length > 1 ? `.${x[1]}` : '';
	const regex = /(\d+)(\d{3})/;
	while (regex.test(x1)) {
		x1 = x1.replace(regex, '$1,$2');
	}

	return x1 + x2;
};
