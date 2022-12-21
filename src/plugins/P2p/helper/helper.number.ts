import { formatNumber } from 'helpers';
import { isNumber } from 'lodash';
import { Currency } from 'modules';
import NP from 'number-precision';

export const getPriceHelper = (fiat: number, currency: number): string => {
	return NP.times(fiat, currency).toFixed(2);
};

export const replaceAllHelper = (str: string, find: string, replace: string): string => {
	return str.replace(new RegExp(find, 'g'), replace);
};

export const formatNumberByCurrencyConfig = (id: string, currency: Currency[]) => {
	// if not exit default format percent =6
	const defaultFormat = 6;
	const currencyConfig = currency.find(item => item.id === id);
	return currencyConfig ? currencyConfig.precision : defaultFormat;
};

export const formatNumberP2p = (number: number | string, decimal?: number): string => {
	// if not exit default format percent =6
	const defaultFormat = 6;
	const newNumber = formatNumber(NP.round(+number, defaultFormat).toString());

	if (isNumber(decimal) && decimal >= 0) {
		const [prefix, suffix] = (+number).toString().split('.');
		const newSuffix = suffix && decimal !== 0 ? `.${suffix.slice(0, decimal)}` : '';

		return formatNumber(prefix) + newSuffix;
	}

	return newNumber;
};

export const checkNumberP2p = (
	value: number | string,
	decimal: number = 18,
): {
	valid: boolean;
	value: number;
	render: string;
} => {
	const newValue = (value + '').replace(/[^.\d]/g, '');
	const [prefix, suffix] = newValue.toString().split('.');
	const haveDot = newValue.toString().includes('.') ? '.' : '';

	if (decimal <= 0) {
		decimal = 0;
	}

	const newSuffix = suffix && decimal !== 0 ? `.${suffix.slice(0, decimal)}` : haveDot;
	const newRenderValue = prefix + newSuffix;

	const newRender = prefix.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + newSuffix;

	return {
		valid: true,
		value: Number(`${newRenderValue}`.replace(/\$\s?|(,*)/g, '')),
		render: `${newRender}`,
	};
};

export const increaseNumberP2p = (number: number, type: 'inc' | 'dec'): number => {
	let valueIncrease = 1;
	const suffix = number.toString().split('.')[1];

	if (suffix && suffix.length > 0) {
		valueIncrease = NP.divide(1, Math.pow(10, suffix.length));
	}

	if (type === 'inc') {
		return NP.plus(number, valueIncrease);
	} else {
		return NP.minus(number, valueIncrease);
	}
};
