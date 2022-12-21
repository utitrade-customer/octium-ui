import { currenciesFetch, selectCurrencies } from 'modules';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _find from 'lodash/find';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';

interface CurrencyIconProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
	currency_id: string;
	isCircle?: boolean;
}
export const CurrencyIcon = (props: CurrencyIconProps) => {
	const { isCircle, currency_id, style } = props;
	const dispatch = useDispatch();
	const currencies = useSelector(selectCurrencies);

	useEffect(() => {
		if (!currencies.length) {
			dispatch(currenciesFetch());
		}
	}, []);

	const findIcon = () => {
		try {
			const currency = _find(currencies, { id: _toLower(currency_id) });
			if (currency) {
				return currency.icon_url;
			}
			return require(`../../../node_modules/cryptocurrency-icons/128/color/${currency_id.toLowerCase()}.png`);
		} catch (err) {
			return require('../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	return <img {...props} style={{ ...style, ...(isCircle ? { borderRadius: 50 } : {}) }} src={findIcon()} alt={currency_id} />;
};
