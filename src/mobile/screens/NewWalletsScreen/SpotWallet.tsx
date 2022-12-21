import { Empty } from 'antd';
import classnames from 'classnames';
import { ConvertUsd } from 'components';
import { calcWalletsData } from 'helpers';
import { useAllChildCurrenciesFetch, useDocumentTitle, useWalletsFetch } from 'hooks';
import _toNumber from 'lodash/toNumber';
import millify from 'millify';
import { SearchIcon } from 'mobile/assets/icons';
import { plus } from 'number-precision';
import React, { useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DEFAULT_CURRENCY_PRECISION } from '../../../constants';
import { selectAllChildCurrencies, selectWallets } from '../../../modules';
import { Decimal } from '../../components';

export const SpotWallet = () => {
	const intl = useIntl();
	useDocumentTitle(intl.formatMessage({ id: 'page.mobile.wallets.title' }));
	useWalletsFetch();
	useAllChildCurrenciesFetch();

	const wallets = useSelector(selectWallets);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	const [searchString, setSearchString] = useState<string>('');
	const [hideSmallBalance, setHideSmallBalance] = useState<boolean>(false);

	const allChildCurrencyName = allChildCurrencies.map(_e => _e.id);

	const data = calcWalletsData(wallets, allChildCurrencies).filter(({ currency, total }) => {
		if (!currency.includes(searchString.toLowerCase().trim())) {
			return false;
		}

		if (hideSmallBalance && Number(total) <= 0) {
			return false;
		}

		return !allChildCurrencyName.includes(currency);
	});

	const renderWalletList = () => {
		return data
			.sort((prev, cur) => {
				return plus(cur.balance ?? 0, cur.locked ?? 0) - plus(prev.balance ?? 0, prev.locked ?? 0);
			})
			.map(wallet => {
				const total = plus(wallet.balance ?? 0, wallet.locked ?? 0);
				return (
					<Link
						to={`/wallets/${wallet.currency}/detail`}
						className="td-mobile-wallets__list__item"
						key={wallet.currency}
					>
						<div className="td-mobile-wallets__list__item__top">
							<div className="td-mobile-wallets__list__item__top__icon">
								<img src={wallet.iconUrl} alt={wallet.name} />
							</div>
							<span className="td-mobile-wallets__list__item__top__text">{wallet.currency.toUpperCase()}</span>
							<span className="td-mobile-wallets__list__item__top__number">
								<span>{convertAmount(total, _toNumber(wallet.fixed))}</span>
							</span>
						</div>
						<div className="td-mobile-wallets__list__item__bottom">
							<span className="td-mobile-wallets__list__item__bottom__text">{wallet.name}</span>
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
						htmlFor="td-mobile-wallet-hide-small-balance"
					>
						<input
							id="td-mobile-wallet-hide-small-balance"
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
			<div className="td-mobile-wallets__list">{data.length === 0 ? <Empty /> : renderWalletList()}</div>
		</>
	);
};
