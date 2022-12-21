import { Empty } from 'antd';
import classnames from 'classnames';
import { ConvertUsd } from 'components';
import { LoadingGif } from 'components/LoadingGif';
import { useAllChildCurrenciesFetch, useDocumentTitle, useWalletsFetch } from 'hooks';
import _toNumber from 'lodash/toNumber';
import millify from 'millify';
import { SearchIcon } from 'mobile/assets/icons';
import { calcWalletsFundingData } from 'mobile/plugins/P2p/helper';
import { plus } from 'number-precision';
import { PopupBannedUser } from 'plugins/P2p/components';
import { useInfoUser, useP2PBalances, useSocketP2pBalances } from 'plugins/P2p/hooks';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DEFAULT_CURRENCY_PRECISION } from '../../../constants';
import { currenciesFetch, selectCurrencies } from '../../../modules';
import { Decimal, PaginationMobile } from '../../components';

export const FundingWallet = () => {
	const intl = useIntl();
	useDocumentTitle(intl.formatMessage({ id: 'page.mobile.wallets.title' }));
	useWalletsFetch();
	useAllChildCurrenciesFetch();

	const [stateIndexPage, setStateIndexPage] = React.useState<number>(1);
	const [searchString, setSearchString] = useState<string>('');
	const [hideSmallBalance, setHideSmallBalance] = useState<boolean>(false);

	const p2pBalance = useP2PBalances({
		page: stateIndexPage,
		hidden: hideSmallBalance,
	});

	const { infoUser } = useInfoUser();
	useSocketP2pBalances();

	const currencies = useSelector(selectCurrencies);

	const dispatch = useDispatch();

	// side effect
	React.useEffect(() => {
		dispatch(currenciesFetch());
	}, []);

	const onGoToPage = (index: number) => {
		setStateIndexPage(index);
	};

	const data = calcWalletsFundingData(p2pBalance.p2pBalances.data).filter(({ currency }) => {
		if (!currency.includes(searchString.toLowerCase().trim())) {
			return false;
		}
		return true;
	});

	const findNameToken = (id: string) => currencies.find(e => e.id === id)?.name;

	const findIcon = (code: string): string => {
		const currency = currencies.find((currency: any) => currency.id === code);
		try {
			return require(`../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency !== undefined && currency.icon_url) {
				return currency.icon_url;
			}
			return require('../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	const renderWalletList = () => {
		return data
			.sort((prev, cur) => {
				return plus(cur.balance ?? 0, cur.locked ?? 0) - plus(prev.balance ?? 0, prev.locked ?? 0);
			})
			.map(wallet => {
				const total = plus(wallet.balance ?? 0, wallet.locked ?? 0);
				return (
					<Link
						to={`/funding-wallets/${wallet.currency}/detail`}
						className="td-mobile-wallets__list__item"
						key={wallet.currency}
					>
						<div className="td-mobile-wallets__list__item__top">
							<div className="td-mobile-wallets__list__item__top__icon">
								<img src={findIcon(wallet.currency)} alt={wallet.currency} />
							</div>
							<span className="td-mobile-wallets__list__item__top__text">{wallet.currency.toUpperCase()}</span>
							<span className="td-mobile-wallets__list__item__top__number">
								<span>{convertAmount(total, _toNumber(wallet.fixed))}</span>
							</span>
						</div>
						<div className="td-mobile-wallets__list__item__bottom">
							<span className="td-mobile-wallets__list__item__bottom__text">{findNameToken(wallet.currency)}</span>
							<span className="td-mobile-wallets__list__item__bottom__number">
								<ConvertUsd value={Number(total)} symbol={wallet.currency} precision={4} defaultValue="0.00" /> $
							</span>
						</div>
					</Link>
				);
			});
	};

	const convertAmount = (amount: number, fixed: number) => {
		const largeAmountString = (amount: string) => {
			const amountArray = amount.split('');
			const accurency = amountArray.pop();
			const amountString = amountArray.join('');
			return (
				<span>
					<span>{amountString}</span>
					<span className="ml-1" style={{ color: 'var(--yellow)' }}>
						{accurency}
					</span>
				</span>
			);
		};
		return Number(amount) >= 100000000 ? (
			largeAmountString(
				millify(Number(amount), {
					precision: fixed,
				}),
			)
		) : (
			<Decimal fixed={DEFAULT_CURRENCY_PRECISION}>{amount}</Decimal>
		);
	};
	return (
		<>
			<div className="td-mobile-wallets__header">
				<label className="td-mobile-wallets__header__search-box" htmlFor="td-mobile-wallets-search-box">
					<SearchIcon className="td-mobile-wallets__header__search-box__icon" />
					<DebounceInput
						id="td-mobile-wallets-search-box"
						className="td-mobile-wallets__header__search-box__input"
						debounceTimeout={500}
						onChange={e => setSearchString(e.target.value)}
					/>
				</label>

				<div className="td-mobile-wallets__header__toggle">
					<span className="td-mobile-wallets__header__toggle__text">
						{intl.formatMessage({ id: 'page.mobile.wallets.toggleText' })}
					</span>
					<label
						className={classnames('td-mobile-wallets__header__toggle__checkbox', {
							'td-mobile-wallets__header__toggle__checkbox--checked': hideSmallBalance,
						})}
						htmlFor="td-mobile-funding-wallet-hide-small-balance"
					>
						<input
							id="td-mobile-funding-wallet-hide-small-balance"
							className={classnames('td-mobile-wallets__header__toggle__checkbox__input', {
								'td-mobile-wallets__header__toggle__checkbox--checked__input': hideSmallBalance,
							})}
							type="checkbox"
							onChange={e => setHideSmallBalance(e.target.checked)}
						/>
						<div
							className={classnames('td-mobile-wallets__header__toggle__checkbox__dot', {
								'td-mobile-wallets__header__toggle__checkbox--checked__dot': hideSmallBalance,
							})}
						/>
					</label>
				</div>
			</div>
			<div className="td-mobile-wallets__list">
				{data.length === 0 ? (
					<Empty />
				) : (
					<>
						{p2pBalance.isLoading && (
							<div
								style={{
									position: 'fixed',
									zIndex: 9999,
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
								}}
							>
								<LoadingGif />
							</div>
						)}
						{renderWalletList()}

						<div className="td-mobile-wallets__pagination">
							<PaginationMobile
								toPage={onGoToPage}
								forcePage={stateIndexPage - 1}
								pageCount={p2pBalance.p2pBalances.meta.pageCount}
								nextPageExists={p2pBalance.p2pBalances.meta.hasNextPage}
							/>
						</div>
					</>
				)}
			</div>

			{infoUser && <PopupBannedUser user={infoUser} />}
		</>
	);
};
