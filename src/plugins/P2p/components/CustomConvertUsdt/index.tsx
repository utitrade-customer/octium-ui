import { useConvertToUSD } from 'hooks';
import { formatNumberP2p } from 'plugins/P2p/helper';
import * as React from 'react';

// tslint:disable-next-line: no-empty-interface
interface CustomConvertUsdtProps {
	value: number;
	precision?: number;
	symbol: string;
	defaultValue?: string;
}

export const CustomConvertUsdt: React.FC<CustomConvertUsdtProps> = ({ value, symbol, precision, defaultValue }) => {
	const price = useConvertToUSD(value, symbol, precision, defaultValue);
	return <>{formatNumberP2p(+price)}</>;
};
