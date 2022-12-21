import classNames from 'classnames';
import { IItemPublicOrder, selectInfoUserPrivate, selectUserInfo, selectUserLoggedIn } from 'modules';
import moment from 'moment';
import { P2pLink } from 'plugins/P2p/components';
import { checkNumberP2p } from 'plugins/P2p/helper';
import React from 'react';
import { useSelector } from 'react-redux';
import NP from 'number-precision';
interface ICustomBtn {
	item: IItemPublicOrder;
	totalBTC: string;
	callBack: () => void;
}
export const CustomBtn = (props: ICustomBtn) => {
	const { item, totalBTC, callBack } = props;
	const { type, owner, minHoldBtc, requireRegistered, status, volume, orderMin, price } = item;
	const user = useSelector(selectUserInfo);
	const infoUserP2p = useSelector(selectInfoUserPrivate);
	const isLoggedIn = useSelector(selectUserLoggedIn);

	const renderTextType = () => {
		if (!isLoggedIn) {
			return {
				text: (type === 'buy' ? 'Sell' : 'Buy') + ' ' + item.currency.toUpperCase(),
				active: true,
			};
		}

		if (status === 'canceled') {
			return {
				text: 'Limited',
				active: false,
			};
		}

		if (owner.id === infoUserP2p?.id) {
			return {
				text: 'Self',
				active: false,
			};
		}

		if (minHoldBtc || requireRegistered) {
			const { value } = checkNumberP2p(totalBTC);

			const a = moment(user.created_at);
			const b = moment();

			const diff = b.diff(a, 'days');

			if (value < minHoldBtc || (requireRegistered && diff < requireRegistered)) {
				return {
					text: 'Restricted',
					active: false,
				};
			}
		}

		if (volume <= NP.divide(orderMin, price) || volume <= 0) {
			return {
				text: 'Restricted',
				active: false,
			};
		}

		return {
			text: (type === 'buy' ? 'Sell' : 'Buy') + ' ' + item.currency.toUpperCase(),
			active: true,
		};
	};

	const classBtnBuySell = classNames('item-row-p2p__item__trade__btn pg-p2p-config-global__btn', {
		'item-row-p2p__item__trade__btn--buy': type === 'sell' && renderTextType().active,
		'item-row-p2p__item__trade__btn--sell': type === 'buy' && renderTextType().active,
		'pg-p2p-config-global__btn--disable': !renderTextType().active,
	});

	return (
		<P2pLink
			type="function"
			callBack={() => {
				renderTextType().active && callBack();
			}}
		>
			<button className={classBtnBuySell}>{renderTextType().text}</button>
		</P2pLink>
	);
};
