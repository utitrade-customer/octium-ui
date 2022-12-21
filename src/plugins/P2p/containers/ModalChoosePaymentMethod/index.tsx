import { Input } from 'antd';
import classNames from 'classnames';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import { useDebounce } from 'plugins/P2p/hooks';
import * as React from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { P2pModalBase } from '../P2pModalBase';

interface IModalChoosePaymentMethod {
	isVisible: boolean;
	onClose: () => void;
}

export const ModalChoosePaymentMethod: React.FC<IModalChoosePaymentMethod> = props => {
	const { isVisible, onClose } = props;

	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;
	const [valueSearch, setValueSearch] = React.useState<string>();
	const [quickSearch, setQuickSearch] = React.useState<string>('ALL');
	const searchDebounce = useDebounce(valueSearch, 500);

	React.useEffect(() => {
		setValueSearch('');
		setQuickSearch('ALL');
	}, [isVisible]);

	const onSearch = (value: string) => {
		setValueSearch(value);
		setQuickSearch('');
	};

	const onQuickSearch = (value: string) => {
		setValueSearch('');
		setQuickSearch(value);
	};

	const classActiveQuickSearch = (value: string) =>
		classNames('p2p-container-modal-payment-method__body__quick-search__item', {
			'p2p-container-modal-payment-method__body__quick-search__item--active': value === quickSearch,
		});

	const FindRecommend = () => {
		const find = paymentSupported.find(e => e.name === 'Bank Tranfer' || e.name === 'Bank Transfer');
		if (find) {
			return <Link to={`/p2p/add-payment/${find.id}`}>{find.name}</Link>;
		}
		return null;
	};

	return (
		<P2pModalBase
			title="Select payment method"
			className="p2p-container-modal-payment-method"
			haveLine={true}
			onClose={onClose}
			position="center"
			show={isVisible}
		>
			<div className="p2p-container-modal-payment-method__body">
				<div className="p2p-container-modal-payment-method__body__recommended">
					<div className="p2p-container-modal-payment-method__body__recommended__title">Recommended</div>

					<div className="p2p-container-modal-payment-method__body__recommended__text">
						<FindRecommend />
					</div>
				</div>

				{/*  */}

				<div className="p2p-container-modal-payment-method__body__search">
					<div className="p2p-container-modal-payment-method__body__search__title">All Payment Methods</div>
					<div className="p2p-container-modal-payment-method__body__search__input">
						<Input
							placeholder="Search"
							prefix={<FiSearch />}
							onChange={e => {
								onSearch(e.target.value);
							}}
						/>
					</div>
				</div>
				{/*  */}

				<div className="p2p-container-modal-payment-method__body__quick-search">
					<div className={classActiveQuickSearch('ALL')} onClick={() => onQuickSearch('ALL')}>
						All
					</div>

					{'abcdefghijklmnopqrstuvwxyz'
						.split('')
						.filter(e => paymentSupported.find(item => item.name.charAt(0).toLocaleLowerCase() === e))
						.map((item, key) => (
							<div
								key={key}
								onClick={() => onQuickSearch(item.toUpperCase())}
								className={classActiveQuickSearch(item.toUpperCase())}
							>
								{item.toUpperCase()}
							</div>
						))}
				</div>
				{/*  */}

				<div className="p2p-container-modal-payment-method__body__list">
					{paymentSupported
						.filter(e => {
							if (quickSearch) {
								if (quickSearch === 'ALL') {
									return true;
								}
								return e.name.toUpperCase().startsWith(quickSearch);
							}
							return e.name.toLocaleLowerCase().includes((searchDebounce || '').toLocaleLowerCase());
						})
						.map((item, key) => (
							<div key={key} className="p2p-container-modal-payment-method__body__list__item">
								<Link to={`/p2p/add-payment/${item.id}`}>{item.name}</Link>
							</div>
						))}
				</div>
			</div>
		</P2pModalBase>
	);
};
