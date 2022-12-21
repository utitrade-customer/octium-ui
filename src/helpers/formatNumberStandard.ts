import { formatNumber } from './formatNumber';
import _toString from 'lodash/toString';
import millify from 'millify';
import toNumber from 'lodash/toNumber';

interface formatNumberStandardParams {
	value: any;
	milestone?: number;
	precision?: number;
}
export const formatNumberByMilestone = (value: number, milestone: number, precision: number) => {
	if (value < milestone) {
		return formatNumber(_toString(value), precision);
	}
	return millify(toNumber(value), {
		precision,
	});
};
export const formatNumberStandard = (params: formatNumberStandardParams | number) => {
	if (typeof params === 'number') {
		return formatNumberByMilestone(params, 11_000, 2);
	}
	const { value, milestone = 1_000, precision = 6 } = params;
	return formatNumberByMilestone(value, milestone, precision);
};
