import classNames from 'classnames';
import { CurrencyIcon } from 'components/CurrencyIcon';
import { useAllChildCurrenciesFetch, useCurrenciesFetch } from 'hooks';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { useTranslate } from 'hooks/useTranslate';
import _startCase from 'lodash/startCase';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import { selectAllChildCurrencies, selectCurrencies } from 'modules';
import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { en } from 'translations/en';
import { MarketOverviewList } from '../MarketOverviewList';
import { StatisticList } from '../StatisticList';
export type TTab = 'Top Gainers' | 'Top Losers' | 'Value Leaders' | 'New Coins';
const TABLIST: TTab[] = ['Top Gainers', 'Top Losers', 'Value Leaders', 'New Coins'];

export const MarketOverview = () => {
	const history = useHistory();
	// selectors
	const currencies = useSelector(selectCurrencies);
	const allChildCurrencies = useSelector(selectAllChildCurrencies);

	// side effects
	useCurrenciesFetch();
	useAllChildCurrenciesFetch();

	// initState
	const [currentTab, setCurrentTab] = React.useState<TTab>('Top Gainers');
	const [searchValue, setSearchValue] = React.useState('');
	const [onFocusSearch, setOnFocusSearch] = React.useState(false);

	// init Refs
	const refSearch = React.useRef<HTMLDivElement>(null);

	// hooks custom
	useOnClickOutside(refSearch, () => {
		setOnFocusSearch(false);
		setSearchValue('');
	});
	const translate = useTranslate();

	// classnames
	const searchWrapperClassName = classNames('search-wrapper', {
		'search-wrapper--active': onFocusSearch,
	});

	// *IIFE  get all current currencies
	const currenciesRender = React.useMemo(() => {
		const allChildCurrencyIds = allChildCurrencies.map(currency => currency.id);
		return currencies.filter(option => !allChildCurrencyIds.includes(_toLower(option.id)));
	}, [allChildCurrencies.length, currencies.length]);

	// * Render and Handle Search
	const renderSearch = React.useCallback(() => {
		const currencyResult = currenciesRender.filter(currency => _toLower(currency.id).includes(_toLower(searchValue)));
		return (
			<div className={searchWrapperClassName} ref={refSearch} onClick={() => setOnFocusSearch(true)}>
				<BsSearch />
				<input
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					className="search-input"
					type="text"
					placeholder={translate('page.homePage.marketOverview.search.placeholder')}
				/>
				{onFocusSearch && (
					<div className="search-result">
						{currencyResult.length > 0 ? (
							currencyResult.map(currency => (
								<div
									key={currency.id}
									className="search-result-item"
									onClick={() => history.push(`/wallets/deposit/${_toLower(currency.id)}`)}
								>
									<CurrencyIcon currency_id={currency.id} className="search-result-item-icon" />
									{_toUpper(currency.id)}
									<span>{_startCase(currency.name)}</span>
								</div>
							))
						) : (
							<div className="search-result-empty">
								{translate('page.homePage.marketOverview.searchNotFound.text')}
								<a
									href="https://docs.google.com/forms/d/e/1FAIpQLSfBZfn1urnJoXI7zpv81IMQ5QzSUjnlQzm16_fGpNt8Wx8mgA/viewform"
									target="blank"
								>
									{translate('page.homePage.marketOverview.apply')}
								</a>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}, [currencies, currencies.length, onFocusSearch, searchValue, allChildCurrencies.length]);

	return (
		<div className="home-market-overview">
			<div className="mt-5 mb-5 d-flex justify-content-between">
				<div className="market-overview-heading">
					<div className="market-overview--title">{translate('page.homePage.marketOverview.title')}</div>
					<div className="market-overview--sub-title">{translate('page.homePage.marketOverview.subtitle')}</div>
				</div>

				{renderSearch()}
			</div>
			<div className="d-flex justify-content-between">
				<div className="tab-list">
					{TABLIST.map((tabName, index) => {
						const tabId = `page.homePage.marketOverview.${tabName
							.split(' ')
							.map(item => _startCase(item))
							.join('')}` as keyof typeof en;
						return (
							<div
								key={index}
								className={classNames('tab-list-item', {
									'tab-list-item--active': currentTab === tabName,
								})}
								onClick={() => setCurrentTab(tabName)}
							>
								{translate(tabId)}
								<span
									className={classNames('corner-start', {
										'd-none': index === 0,
									})}
								/>
								<span
									className={classNames('corner-end', {
										'd-none': index === TABLIST.length - 1,
									})}
								/>
							</div>
						);
					})}
				</div>
				<div className="market-link" onClick={() => history.push('/markets')}>{`${translate(
					'page.homePage.btn.more',
				)} >`}</div>
			</div>
			<div className="market-table">
				<MarketOverviewList currenciesRender={currenciesRender} currentTab={currentTab} />
			</div>

			<StatisticList currencies={currenciesRender} />
		</div>
	);
};
