import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { CurrencyInfo } from '../../../../../components/CurrencyInfo';
import { selectCurrencies } from '../../../../../modules';
import { selectWallets } from 'modules';
import _find from 'lodash/find';
import _reduce from 'lodash/reduce';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import { CurrencyIcon } from 'components/CurrencyIcon';

const SelectStyles = {
	option: (provided, state) => ({
		...provided,
		backgroundColor: state.isFocused ? 'rgb(var(--rgb-blue))' : 'var(--main-background-color)',
		color: 'rgb(var(--rgb-text-black))',
		cursor: 'pointer',
	}),
	control: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: 'rgb(var(--rgb-text-black))',
		backgroundColor: 'rgb(var(--rgb-body-background-color))',
	}),
	placeholder: (provided, state) => ({
		...provided,
		color: 'rgb(var(--rgb-default-text-color))',
	}),
	singleValue: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: 'rgb(var(--rgb-default-text-color))',
		backgroundColor: '#000456',
	}),
	menu: (provided, state) => ({
		...provided,
		border: '1px solid #4A505',
		color: 'rgb(var(--rgb-text-black))',
		backgroundColor: 'var(--main-background-color)',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	}),
	input: (provided, state) => ({
		...provided,
		color: 'rgb(var(--rgb-text-black))',
	}),
};
interface BankWithdrawInfoProps {
	currency_id: string;
}

export const BankWithdrawInfo: React.FC<BankWithdrawInfoProps> = (props: BankWithdrawInfoProps) => {
	const intl = useIntl();

	const { currency_id } = props;
	// history
	const history = useHistory();

	// selector
	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets);

	const wallet = wallets.find(wallet => _toLower(wallet.currency) === _toLower(currency_id)) || {
		currency: '',
		name: '',
		type: 'fiat',
		fee: 0,
		fixed: 0,
	};

	// method

	const options = _reduce(
		currencies,
		(result: { value: string; label: JSX.Element }[], currency, key) => {
			if (currency.type === 'fiat') {
				result.push({
					value: currency.id,
					label: (
						<span>
							<CurrencyIcon
								style={{ width: '2rem', borderRadius: '50%' }}
								currency_id={currency.id}
								alt={currency.id}
							/>{' '}
							{_toUpper(currency.id)} | {_toUpper(currency.name)}
						</span>
					),
				});
			}
			return result;
		},
		[],
	);

	const handleChange = (selectedOption: any) => {
		const currency_id = String(selectedOption.value);
		if (currency_id) {
			const location = {
				pathname: `/wallets/withdraw/fiat/${currency_id.toUpperCase()}`,
			};
			history.push(location);
		}
	};

	return (
		<div className="desktop-fiat-withdraw-info">
			<div className="container desktop-fiat-withdraw-info__container">
				<div className="row desktop-fiat-withdraw-info__container__header">
					<div className="col-6 d-flex flex-wrap flex-row">
						<button
							className="desktop-fiat-withdraw-info__container__header__mode"
							onClick={() => history.push({ pathname: `/wallets/deposit/fiat/${currency_id.toUpperCase()}` })}
						>
							{intl.formatMessage({ id: 'page.body.wallet.deposit' })}
						</button>
						<button className="desktop-fiat-withdraw-info__container__header__mode desktop-fiat-withdraw-info__container__header__mode--active">
							{intl.formatMessage({ id: 'page.body.wallet.withdraw' })}
						</button>
					</div>
					<div className="col-6 desktop-fiat-withdraw-info__container__header__selection">
						<Select
							autoFocus
							backspaceRemovesValue={false}
							controlShouldRenderValue={false}
							hideSelectedOptions={false}
							isClearable={false}
							onChange={handleChange}
							options={options}
							placeholder="Search Coin/Token Name"
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
			</div>
		</div>
	);
};
