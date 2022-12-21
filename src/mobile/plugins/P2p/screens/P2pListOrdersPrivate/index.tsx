import { Button, Empty } from 'antd';
import classNames from 'classnames';
import { LoadingGif } from 'components/LoadingGif';
import { PaginationMobile } from 'mobile/components';
import { useDebounce, useP2PPrivateListOrders, useP2pPublicInfos } from 'plugins/P2p/hooks';
import React, { useState } from 'react';
import { BiFilterAlt } from 'react-icons/bi';
import { P2pFilterDrawer } from '../../components/P2pFilterDrawer';
import { ItemPrivateOrder } from './ItemPrivateOrder';

export const P2pMobileMyOrdersScreen = () => {
	const [tradingTypeState, setTradingTypeState] = useState<'buy' | 'sell'>('buy');
	const [fiat, setFiat] = useState('');
	const [payment, setPayment] = useState<undefined | number>();

	const [currency, setCurrency] = useState('');
	const [page, setPage] = useState(1);
	const [showFilterDrawer, setShowFilterDrawer] = React.useState(false);

	const [orderMin, setOrderMin] = useState<string>('');

	const infoOrderPublic = useP2pPublicInfos();
	const valueOrderMin = useDebounce(orderMin, 500);

	console.log({
		fiat: fiat,
		currency: currency,
		page: page,
		orderMin: +valueOrderMin,
		payment: payment,
		type: tradingTypeState,
	});

	const { listOrders, meta } = useP2PPrivateListOrders({
		page: page,
	});

	const { currencySupported, paymentSupported } = infoOrderPublic.infoPublicOrders;
	React.useEffect(() => {
		currencySupported[0] && setCurrency(currencySupported[0].id.toUpperCase());
	}, [currencySupported]);

	const onSelectCurrency = (name: string) => {
		setCurrency(name);
	};

	const handleChangePage = (value: number) => {
		setPage(value);
	};

	const onSelectTradingType = (name: 'buy' | 'sell') => {
		setTradingTypeState(name);
	};

	const RenderLoading = () => {
		return (
			<div className="p2p-list-orders-private__loading">
				<LoadingGif />
			</div>
		);
	};

	const RenderHeader = () => {
		const tradeTypeClassName = 'p2p-mobile-screen-p2p-list__header__toggle__btn';

		const classBtnToggleBuy = classNames(tradeTypeClassName, {
			[`${tradeTypeClassName}--buy`]: tradingTypeState === 'buy',
		});

		const classBtnToggleSell = classNames(tradeTypeClassName, {
			[`${tradeTypeClassName}--sell`]: tradingTypeState === 'sell',
		});

		return (
			<div className="p2p-mobile-screen-p2p-list__header container-fluid">
				<div className="d-flex flex-row justify-content-between align-items-center">
					<div className="p2p-mobile-screen-p2p-list__header__toggle ">
						<div className={classBtnToggleBuy} onClick={() => onSelectTradingType('buy')}>
							Buy
						</div>
						<div className={classBtnToggleSell} onClick={() => onSelectTradingType('sell')}>
							Sell
						</div>
					</div>
					<div className="d-flex flex-row">
						<Button style={{ backgroundColor: 'transparent', border: 'none' }} shape="circle">
							<BiFilterAlt style={{ width: '3em', height: '1.5em' }} onClick={() => setShowFilterDrawer(true)} />
						</Button>
					</div>
				</div>
				<div className="p2p-mobile-screen-p2p-list__header__control">
					<div className="p2p-mobile-screen-p2p-list__header__control__bottom-container">{renderCurrencies()}</div>
				</div>
			</div>
		);
	};

	const renderCurrencies = () => {
		if (currencySupported.length == 0) {
			return null;
		}
		return currencySupported.map((currencyItem, index) => {
			const currencyClassName = 'p2p-mobile-screen-p2p-list__header__control__bottom-container__btn';

			return (
				<button
					className={classNames(currencyClassName, {
						[`${currencyClassName}--active`]: currencyItem.id.toUpperCase() == currency,
					})}
					key={index}
					onClick={() => onSelectCurrency(currencyItem.id.toUpperCase())}
				>
					{currencyItem.id.toUpperCase()}
				</button>
			);
		});
	};

	return (
		<div className="p2p-list-orders-private">
			{infoOrderPublic.isLoading ? (
				<RenderLoading />
			) : (
				<>
					<RenderHeader />
					<P2pFilterDrawer
						title="Filter"
						infoOrder={infoOrderPublic.infoPublicOrders}
						show={showFilterDrawer}
						onClose={() => setShowFilterDrawer(false)}
						fiat={fiat}
						payment={payment}
						setFiat={setFiat}
						setPayment={setPayment}
						setOrderMin={setOrderMin}
						orderMin={orderMin}
					/>
					{listOrders.map((e, index) => (
						<ItemPrivateOrder paymentSupported={paymentSupported} item={e} key={index} />
					))}

					{listOrders.length === 0 && (
						<div className="p2p-list-orders-private__empty">
							<Empty />
						</div>
					)}

					{listOrders.length > 0 && (
						<PaginationMobile
							forcePage={page - 1}
							toPage={(index: number) => {
								handleChangePage(index);
							}}
							pageCount={meta.pageCount}
						/>
					)}
				</>
			)}
		</div>
	);
};
