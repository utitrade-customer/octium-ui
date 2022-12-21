import { DropdownElem } from '../components/Order';

export const PG_TITLE_PREFIX = 'Octium Exchange';

export const pgRoutes = (isLoggedIn: boolean, isLight?: boolean): string[][] => {
	const routes = [
		['page.header.navbar.trade', '/market/', `trade${isLight ? 'Light' : ''}`],
		['page.header.navbar.wallets', '/wallets', `wallets${isLight ? 'Light' : ''}`],
		['page.header.navbar.openOrders', '/orders', `orders${isLight ? 'Light' : ''}`],
		['page.header.navbar.history', '/history', `history${isLight ? 'Light' : ''}`],
	];
	const routesUnloggedIn = [
		['page.header.navbar.signIn', '/login', `login${isLight ? 'Light' : ''}`],
		['page.header.signUp', '/register', `register${isLight ? 'Light' : ''}`],
		['page.header.navbar.trade', '/market/', `trade${isLight ? 'Light' : ''}`],
	];

	return isLoggedIn ? routes : routesUnloggedIn;
};

export const DEFAULT_CURRENCY_PRECISION = 6;
export const DEFAULT_CCY_PRECISION = 4;
export const STORAGE_DEFAULT_LIMIT = 100;
export const ORDER_BOOK_DEFAULT_SIDE_LIMIT = 100;
export const DEFAULT_TRADING_VIEW_INTERVAL = '30';
export const VALUATION_PRIMARY_CURRENCY = 'BTC';
export const VALUATION_SECONDARY_CURRENCY = 'USDT';

export const PASSWORD_ENTROPY_STEP = 6;

export const DEFAULT_KYC_STEPS = ['email', 'profile', 'document', 'address'];

export const DEFAULT_ORDER_TYPES: DropdownElem[] = ['Limit', 'Market'];
export const AMOUNT_PERCENTAGE_ARRAY = [0.25, 0.5, 0.75, 1];

export const DEFAULT_MARKET = {
	id: '',
	name: '',
	base_unit: '',
	quote_unit: '',
	min_price: '',
	max_price: 0,
	min_amount: 0,
	amount_precision: 0,
	price_precision: 0,
};

export const colors = {
	light: {
		chart: {
			primary: '#fff',
			up: '#54B489',
			down: '#E85E59',
		},
		navbar: {
			sun: 'var(--icons)',
			moon: 'var(--primary-text-color)',
		},
		orderBook: {
			asks: 'var(--asks-level-4)',
			bids: 'var(--bids-level-4)',
		},
		depth: {
			fillAreaAsk: '#fa5252',
			fillAreaBid: '#12b886',
			gridBackgroundStart: '#1a243b',
			gridBackgroundEnd: '#1a243b',
			strokeAreaAsk: '#fa5252',
			strokeAreaBid: '#12b886',
			strokeGrid: '#B8E9F5',
			strokeAxis: '#cccccc',
		},
	},
	basic: {
		chart: {
			primary: 'var(--rgb-body-background-color)',
			up: 'var(--rgb-bids)',
			down: 'var(--rgb-asks)',
		},
		navbar: {
			sun: 'var(--primary-text-color)',
			moon: 'var(--icons)',
		},
		orderBook: {
			asks: 'var(--asks-level-4)',
			bids: 'var(--bids-level-4)',
		},
		depth: {
			fillAreaAsk: 'var(--rgb-asks)',
			fillAreaBid: 'var(--rgb-bids)',
			gridBackgroundStart: 'var(--rgb-asks)',
			gridBackgroundEnd: 'var(--rgb-asks)',
			strokeAreaAsk: 'var(--rgb-asks)',
			strokeAreaBid: 'var(--rgb-bids)',
			strokeGrid: 'var(--rgb-secondary-contrast-cta-color)',
			strokeAxis: 'var(--rgb-primary-text-color)',
		},
	},
};
export const QUOTE_CURRENCIES = ['usdt', 'tusd', 'usdc', 'busd'];
export const CONFIG = {
	udonTotalNumber: 2 * 10 ** 12,
	udonTotalText: '2.000.000.000.000',
	endTime: 'Nov 5,2021',
	priceText: '0,000001 USD',
	priceNumber: '0.000001',
	saleCurrencies: ['bnb', 'usdt', 'busd'],
	address: '0x8606d59312150A2970377502b607c36084aC4806',
};