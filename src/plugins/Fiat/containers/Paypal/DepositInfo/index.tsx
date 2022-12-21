import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { TradeList } from '../../../../../components';
import { CurrencyInfo } from '../../../../../components/CurrencyInfo';
import { selectCurrencies, selectWallets } from '../../../../../modules';
import _toLower from 'lodash/toLower';
import _find from 'lodash/find';
import { CurrencyIcon } from 'components/CurrencyIcon';

const SelectStyles = {
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isFocused ? 'var(--blue)' : 'var(--main-background-color)',
		color: state.isFocused ? '#000' : 'var(--system-text-black-color)',
		cursor: 'pointer',
	}),
	control: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: '#000',
		backgroundColor: 'var(--body-background-color)',
	}),
	placeholder: (provided, state) => ({
		...provided,
		color: 'var(--system-text-black-color)',
	}),
	singleValue: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: 'var(--system-text-black-color)',
		backgroundColor: '#000456',
	}),
	menu: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: 'var(--system-text-black-color)',
		backgroundColor: 'var(--main-background-color)',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	}),
	input: (provided, state) => ({
		...provided,
		color: 'var(--system-text-black-color)',
	}),
};

interface PaypalDepositInfoProps {
	currency_id: string;
}

export const PaypalDepositInfo: React.FC<PaypalDepositInfoProps> = (props: PaypalDepositInfoProps) => {
	const { currency_id } = props;

	const intl = useIntl();
	const history = useHistory();

	// selectors
	const currencies = useSelector(selectCurrencies);
	// tslint:disable-next-line:variable-name
	const wallets = useSelector(selectWallets);

	// tslint:disable-next-line:no-shadowed-variable
	const wallet = wallets.find(wallet => wallet.currency.toLowerCase() === currency_id.toLowerCase()) || {
		currency: '',
		name: '',
		type: 'fiat',
		fee: 0,
		fixed: 0,
	};

	// tslint:disable-next-line:no-shadowed-variable
	const options = currencies
		.filter(currency => currency.type === 'fiat')
		.map(currency => {
			const newCurrency = {
				value: currency.id,
				label: (
					<span>
						<CurrencyIcon
							style={{ width: '2rem', borderRadius: '50%' }}
							currency_id={currency.id}
							alt={currency.id}
						/>{' '}
						{currency.id.toUpperCase()} | {currency.name.toUpperCase()}
					</span>
				),
			};

			return newCurrency;
		});

	const handleChange = (selectedOption: any) => {
		const selectedCurrency = String(selectedOption.value);
		const location = {
			pathname: `/wallets/deposit/fiat/${selectedCurrency.toUpperCase()}`,
		};
		history.push(location);
	};

	return (
		<div className="desktop-desktop-fiat-deposit-info">
			<div className="container desktop-fiat-deposit-info__container">
				<div className="row desktop-fiat-deposit-info__container__header">
					<div className="col-6 d-flex flex-wrap ">
						<button className="desktop-fiat-deposit-info__container__header__mode desktop-fiat-deposit-info__container__header__mode--active">
							{intl.formatMessage({ id: 'page.body.wallet.deposit' })}
						</button>
						<button
							className="desktop-fiat-deposit-info__container__header__mode"
							onClick={() => history.push({ pathname: `/wallets/withdraw/fiat/${currency_id.toUpperCase()}` })}
						>
							{intl.formatMessage({ id: 'page.body.wallet.withdraw' })}
						</button>
					</div>
					<div className="col-6 desktop-fiat-deposit-info__container__header__selection">
						<Select
							autoFocus
							backspaceRemovesValue={false}
							controlShouldRenderValue={false}
							hideSelectedOptions={false}
							isClearable={false}
							onChange={handleChange}
							options={options}
							placeholder={intl.formatMessage({ id: 'page.body.wallet.searchBoxPlaceholder' })}
							styles={SelectStyles}
							tabSelectsValue={false}
							value={options.filter(option => option.value.toLowerCase() === currency_id.toLowerCase())}
						/>
					</div>
				</div>
				<div className="row" style={{ marginTop: '50px' }}>
					<div className="col-12">
						<CurrencyInfo wallet={wallet} />
					</div>
				</div>
				<div className="d-flex flex-wrap" style={{ padding: '25px 0px' }}>
					<div className="col-12">
						<h5>{intl.formatMessage({ id: 'page.body.wallet.goToTrade' })}:</h5>
					</div>
					<div className="col-12 d-flex flex-wrap">
						<TradeList currency_id={currency_id} />
					</div>
				</div>
			</div>
		</div>
	);
};
