import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { PlusIcon } from '../../../assets/images/PlusIcon';
import { TipIcon } from '../../../assets/images/TipIcon';
import { TrashBin } from '../../../assets/images/TrashBin';
import { IntlProps } from '../../../index';
import {
	beneficiariesCreateData,
	beneficiariesDelete,
	Beneficiary,
	BeneficiaryBank,
	ChildCurrency,
	Currency,
	MemberLevels,
	memberLevelsFetch,
	RootState,
	selectBeneficiaries,
	selectBeneficiariesCreate,
	selectChildCurrencies,
	selectCurrencies,
	selectMemberLevels,
	selectMobileDeviceState,
	selectUserInfo,
	User,
} from '../../../modules';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { BeneficiariesActivateModal } from './BeneficiariesActivateModal';
import { BeneficiariesAddModal } from './BeneficiariesAddModal';
import { BeneficiariesFailAddModal } from './BeneficiariesFailAddModal';

interface ReduxProps {
	beneficiaries: Beneficiary[];
	beneficiariesAddData: Beneficiary;
	memberLevels?: MemberLevels;
	userData: User;
	isMobileDevice: boolean;
	currencies: Currency[];
	child_currencies: ChildCurrency[];
}

interface DispatchProps {
	deleteAddress: typeof beneficiariesDelete;
	memberLevelsFetch: typeof memberLevelsFetch;
	beneficiariesCreateData: typeof beneficiariesCreateData;
}

interface OwnProps {
	currency: string;
	type: 'fiat' | 'coin';
	onChangeValue: (beneficiary: Beneficiary) => void;
}

interface State {
	currentWithdrawalBeneficiary: Beneficiary;
	isOpenAddressModal: boolean;
	isOpenConfirmationModal: boolean;
	isOpenDropdown: boolean;
	isOpenTip: boolean;
	isOpenFailModal: boolean;
}

const defaultBeneficiary: Beneficiary = {
	id: 0,
	currency: '',
	name: '',
	state: '',
	data: {
		address: '',
	},
};

type Props = ReduxProps & DispatchProps & OwnProps & IntlProps;

// tslint:disable jsx-no-multiline-js
class BeneficiariesComponent extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			currentWithdrawalBeneficiary: defaultBeneficiary,
			isOpenAddressModal: false,
			isOpenConfirmationModal: false,
			isOpenDropdown: false,
			isOpenTip: false,
			isOpenFailModal: false,
		};
	}

	public componentDidMount() {
		const { currency, beneficiaries, memberLevels } = this.props;
		if (currency && beneficiaries.length) {
			this.handleSetCurrentAddressOnUpdate(beneficiaries, currency);
		}

		if (!memberLevels) {
			this.props.memberLevelsFetch();
		}
	}

	public componentWillReceiveProps(nextProps: Props) {
		const { currency, beneficiaries } = this.props;

		if (
			(nextProps.currency && nextProps.currency !== currency) ||
			(nextProps.beneficiaries.length && nextProps.beneficiaries !== beneficiaries)
		) {
			this.handleSetCurrentAddressOnUpdate(nextProps.beneficiaries, nextProps.currency);
		}
	}

	public findBlockchainType = () => {
		const { currency, currencies, child_currencies } = this.props;
		const child_currencies_strings = child_currencies.map(cur => cur.id);

		const parent_currencies = currencies.filter(currency => !child_currencies_strings.includes(currency.id));
		const parent_currencies_strings = parent_currencies.map(cur => cur.id);

		const parent_index = parent_currencies_strings.findIndex((parent_currency_id: string) => parent_currency_id === currency);
		const child_index = child_currencies_strings.findIndex((child_currency_id: string) => child_currency_id === currency);

		if (child_index !== -1) {
			return child_currencies[child_index].blockchain_key;
		}
		if (parent_index !== -1) {
			return parent_currencies[parent_index].blockchain_key;
		}

		return 'Unavailable';
	};

	public render() {
		const { currency, type, beneficiaries, beneficiariesAddData, isMobileDevice } = this.props;
		const { currentWithdrawalBeneficiary, isOpenAddressModal, isOpenConfirmationModal, isOpenFailModal } = this.state;
		const filtredBeneficiaries = this.handleFilterByState(this.handleFilterByCurrency(beneficiaries, currency), [
			'active',
			'pending',
		]);

		const blockchainType = this.findBlockchainType();

		return (
			<div className="pg-beneficiaries">
				<div className="text-dark mb-2">
					{type === 'coin'
						? this.translate('page.body.wallets.beneficiaries.title')
						: this.translate('page.body.wallets.beneficiaries.fiat.title')}
				</div>
				{filtredBeneficiaries.length
					? this.renderAddressDropdown(filtredBeneficiaries, currentWithdrawalBeneficiary, type)
					: this.renderAddAddress()}
				{isOpenAddressModal && (
					<BeneficiariesAddModal
						currency={currency}
						type={type}
						handleToggleAddAddressModal={this.handleToggleAddAddressModal}
						handleToggleConfirmationModal={this.handleToggleConfirmationModal}
						blockchainType={blockchainType}
					/>
				)}
				{isOpenConfirmationModal && (
					<BeneficiariesActivateModal
						beneficiariesAddData={beneficiariesAddData}
						handleToggleConfirmationModal={this.handleToggleConfirmationModal}
					/>
				)}
				{isOpenFailModal && (
					<BeneficiariesFailAddModal
						isMobileDevice={isMobileDevice}
						handleToggleFailModal={this.handleToggleFailModal}
					/>
				)}
			</div>
		);
	}

	private renderAddAddress = () => {
		return (
			<div className="pg-beneficiaries__add" onClick={this.handleClickToggleAddAddressModal()}>
				<span className="pg-beneficiaries__add__label">
					{this.translate('page.body.wallets.beneficiaries.addAddress')}
				</span>
				<PlusIcon className="pg-beneficiaries__add__icon" />
			</div>
		);
	};

	private renderDropdownItem = (item: Beneficiary, index: number, type: 'fiat' | 'coin') => {
		const isPending = item.state && item.state.toLowerCase() === 'pending';
		const itemClassName = classnames('pg-beneficiaries__dropdown__body__item item', {
			'item--pending': isPending,
		});

		if (type === 'fiat') {
			return (
				<div key={index} className={itemClassName}>
					<div className="item__left" onClick={this.handleClickSelectAddress(item)}>
						<span className="item__left__title">
							{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}
						</span>
						<span className="item__left__address">{item.name}</span>
					</div>
					<div className="item__left" onClick={this.handleClickSelectAddress(item)}>
						<span className="item__left__title">
							{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.fullName')}
						</span>
						<span className="item__left__address">{item.data ? (item.data as BeneficiaryBank).full_name : ''}</span>
					</div>
					<div className="item__right">
						{isPending ? (
							<span className="item__right__pending">
								{this.translate('page.body.wallets.beneficiaries.dropdown.pending')}
							</span>
						) : null}
						<span className="item__right__delete" onClick={this.handleClickDeleteAddress(item)}>
							<TrashBin />
						</span>
					</div>
				</div>
			);
		}

		return (
			<div key={index} className={itemClassName}>
				<div className="item__left" onClick={this.handleClickSelectAddress(item)}>
					<span className="item__left__title">
						{this.translate('page.body.wallets.beneficiaries.dropdown.name')}:{' '}
						<span className="text-dark">{item.name}</span>
					</span>
					<span className="item__left__address">{item.data.address}</span>
				</div>
				<div className="item__right">
					{isPending ? (
						<span className="item__right__pending">
							{this.translate('page.body.wallets.beneficiaries.dropdown.pending')}
						</span>
					) : null}
					<span className="item__right__delete" onClick={this.handleClickDeleteAddress(item)}>
						<TrashBin />
					</span>
				</div>
			</div>
		);
	};

	private renderDropdownBody = (beneficiaries: Beneficiary[], type: 'fiat' | 'coin') => {
		const dropdownBodyClassName = classnames('pg-beneficiaries__dropdown__body', {
			'fiat-body': type === 'fiat',
		});

		return (
			<div className={dropdownBodyClassName}>
				{beneficiaries && beneficiaries.map((item, index) => this.renderDropdownItem(item, index, type))}
				<div className="pg-beneficiaries__dropdown__body__add add" onClick={this.handleClickToggleAddAddressModal()}>
					<span className="add__label">{this.translate('page.body.wallets.beneficiaries.addAddress')}</span>
					<PlusIcon className="add__icon" />
				</div>
			</div>
		);
	};

	private renderDropdownTipCryptoNote = (note: string) => {
		return (
			<div className="tip__content__block">
				<span className="tip__content__block__label">
					{this.translate('page.body.wallets.beneficiaries.tipDescription')}
				</span>
				<span className="tip__content__block__value">{note}</span>
			</div>
		);
	};

	private renderDropdownTipCrypto = (currentWithdrawalBeneficiary: Beneficiary) => {
		if (currentWithdrawalBeneficiary) {
			return (
				<div className="pg-beneficiaries__dropdown__tip tip">
					<div className="tip__content">
						<div className="tip__content__block">
							<span className="tip__content__block__label">
								{this.translate('page.body.wallets.beneficiaries.tipAddress')}
							</span>
							<span className="tip__content__block__value">{currentWithdrawalBeneficiary.data.address}</span>
						</div>
						<div className="tip__content__block">
							<span className="tip__content__block__label">
								{this.translate('page.body.wallets.beneficiaries.tipName')}
							</span>
							<span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
						</div>
						{currentWithdrawalBeneficiary.description &&
							this.renderDropdownTipCryptoNote(currentWithdrawalBeneficiary.description)}
					</div>
				</div>
			);
		}

		return;
	};

	private renderDropdownTipFiatDescription = (description: string) => {
		return (
			<div className="tip__content__block">
				<span className="tip__content__block__label">
					{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.description')}
				</span>
				<span className="tip__content__block__value">{description}</span>
			</div>
		);
	};

	private renderDropdownTipFiat = (currentWithdrawalBeneficiary: Beneficiary) => {
		if (currentWithdrawalBeneficiary) {
			return (
				<div className="pg-beneficiaries__dropdown__tip tip fiat-tip">
					<div className="tip__content">
						<div className="tip__content__block">
							<span className="tip__content__block__label">
								{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}
							</span>
							<span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
						</div>
						{currentWithdrawalBeneficiary.description &&
							this.renderDropdownTipFiatDescription(currentWithdrawalBeneficiary.description)}
						<div className="tip__content__block">
							<span className="tip__content__block__label">
								{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.account')}
							</span>
							<span className="tip__content__block__value">
								{(currentWithdrawalBeneficiary.data as BeneficiaryBank).account_number}
							</span>
						</div>
						<div className="tip__content__block">
							<span className="tip__content__block__label">
								{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.bankOfBeneficiary')}
							</span>
							<span className="tip__content__block__value">
								{(currentWithdrawalBeneficiary.data as BeneficiaryBank).bank_name}
							</span>
						</div>
					</div>
				</div>
			);
		}

		return;
	};

	private renderAddressDropdown = (
		beneficiaries: Beneficiary[],
		currentWithdrawalBeneficiary: Beneficiary,
		type: 'fiat' | 'coin',
	) => {
		const { isOpenDropdown, isOpenTip } = this.state;
		const isPending = currentWithdrawalBeneficiary.state && currentWithdrawalBeneficiary.state.toLowerCase() === 'pending';

		const dropdownClassName = classnames('pg-beneficiaries__dropdown', {
			'pg-beneficiaries__dropdown--open': isOpenDropdown,
		});

		if (type === 'fiat') {
			return (
				<div className={dropdownClassName}>
					<div className="pg-beneficiaries__dropdown__select fiat-select select" onClick={this.handleToggleDropdown}>
						<div className="select__left">
							<span className="select__left__title">
								{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.name')}
							</span>
							<span className="select__left__address">{currentWithdrawalBeneficiary.name}</span>
							<span className="select__left__title">
								{this.translate('page.body.wallets.beneficiaries.dropdown.fiat.fullName')}
							</span>
							<span className="select__left__address">
								{currentWithdrawalBeneficiary.data
									? (currentWithdrawalBeneficiary.data as BeneficiaryBank).full_name
									: ''}
							</span>
						</div>
						<div className="select__right">
							<span
								className="select__right__tip"
								onMouseOver={this.handleToggleTip}
								onMouseOut={this.handleToggleTip}
							>
								<TipIcon />
							</span>
							<span className="select__right__select">
								{this.translate('page.body.wallets.beneficiaries.dropdown.select')}
							</span>
							<span className="select__right__chevron">
								<ChevronIcon />
							</span>
						</div>
					</div>
					{isOpenDropdown && this.renderDropdownBody(beneficiaries, type)}
					{isOpenTip && this.renderDropdownTipFiat(currentWithdrawalBeneficiary)}
				</div>
			);
		}

		return (
			<div className={dropdownClassName}>
				<div className="pg-beneficiaries__dropdown__select select" onClick={this.handleToggleDropdown}>
					<div className="select__left">
						<span className="select__left__title text-dark">
							{this.translate('page.body.wallets.beneficiaries.dropdown.name')}:{' '}
							<span>{currentWithdrawalBeneficiary.name}</span>
						</span>
						<span className="select__left__address" style={{ color: 'var(--blue)' }}>
							{currentWithdrawalBeneficiary.data.address}
						</span>
					</div>
					<div className="select__right">
						{isPending ? (
							<span className="select__right__pending">
								{this.translate('page.body.wallets.beneficiaries.dropdown.pending')}
							</span>
						) : null}
						<span className="select__right__select">
							{this.translate('page.body.wallets.beneficiaries.dropdown.select')}
						</span>
						<span className="select__right__chevron">
							<ChevronIcon />
						</span>
					</div>
				</div>
				{isOpenDropdown && this.renderDropdownBody(beneficiaries, type)}
				{isOpenTip && this.renderDropdownTipCrypto(currentWithdrawalBeneficiary)}
			</div>
		);
	};

	private handleClickDeleteAddress = (item: Beneficiary) => () => {
		this.handleDeleteAddress(item);
	};

	private handleClickSelectAddress = (item: Beneficiary) => () => {
		if (item.state && item.state.toLowerCase() === 'pending') {
			this.props.beneficiariesCreateData({ id: item.id } as any);
			this.handleToggleConfirmationModal();
		} else {
			this.handleSetCurrentAddress(item);
		}
	};

	private handleClickToggleAddAddressModal = () => () => {
		const { memberLevels, userData } = this.props;

		if (memberLevels && userData.level < memberLevels.withdraw.minimum_level) {
			this.handleToggleFailModal();
		} else {
			this.handleToggleAddAddressModal();
		}
	};

	private handleDeleteAddress = (item: Beneficiary) => {
		const payload = {
			id: item.id,
		};

		this.props.deleteAddress(payload);
	};

	private handleFilterByCurrency = (beneficiaries: Beneficiary[], currency: string) => {
		if (beneficiaries.length && currency) {
			return beneficiaries.filter(item => item.currency.toLowerCase() === currency.toLowerCase());
		}

		return [];
	};

	private handleFilterByState = (beneficiaries: Beneficiary[], filter: string | string[]) => {
		if (beneficiaries.length) {
			return beneficiaries
				.filter(item => filter.includes(item.state.toLowerCase()))
				.sort((a, b) => (a.sent_at && b.sent_at ? new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime() : 0));
		}

		return [];
	};

	private handleSetCurrentAddress = (item: Beneficiary) => {
		if (item.data) {
			this.setState({
				currentWithdrawalBeneficiary: item,
				isOpenDropdown: false,
			});
			this.props.onChangeValue(item);
		}
	};

	private handleSetCurrentAddressOnUpdate = (beneficiaries: Beneficiary[], currency: string) => {
		const filteredByCurrency = this.handleFilterByCurrency(beneficiaries, currency);
		let filteredByState = this.handleFilterByState(filteredByCurrency, 'active');

		if (!filteredByState.length) {
			filteredByState = this.handleFilterByState(filteredByCurrency, 'pending');
		}

		if (filteredByState.length) {
			this.handleSetCurrentAddress(filteredByState[0]);
		}
	};

	private handleToggleAddAddressModal = () => {
		this.setState(prevState => ({
			isOpenAddressModal: !prevState.isOpenAddressModal,
		}));
	};

	private handleToggleConfirmationModal = () => {
		this.setState(prevState => ({
			isOpenConfirmationModal: !prevState.isOpenConfirmationModal,
		}));
	};

	private handleToggleFailModal = () => {
		this.setState(prevState => ({
			isOpenFailModal: !prevState.isOpenFailModal,
		}));
	};

	private handleToggleDropdown = () => {
		this.setState(prevState => ({
			isOpenDropdown: !prevState.isOpenDropdown,
		}));
	};

	private handleToggleTip = () => {
		this.setState(prevState => ({
			isOpenTip: !prevState.isOpenTip,
		}));
	};

	private translate = (id: string) => this.props.intl.formatMessage({ id });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
	beneficiaries: selectBeneficiaries(state),
	beneficiariesAddData: selectBeneficiariesCreate(state),
	memberLevels: selectMemberLevels(state),
	userData: selectUserInfo(state),
	isMobileDevice: selectMobileDeviceState(state),
	currencies: selectCurrencies(state),
	child_currencies: selectChildCurrencies(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
	deleteAddress: payload => dispatch(beneficiariesDelete(payload)),
	memberLevelsFetch: () => dispatch(memberLevelsFetch()),
	beneficiariesCreateData: payload => dispatch(beneficiariesCreateData(payload)),
});

// tslint:disable-next-line:no-any
export const Beneficiaries = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BeneficiariesComponent) as any) as any;
