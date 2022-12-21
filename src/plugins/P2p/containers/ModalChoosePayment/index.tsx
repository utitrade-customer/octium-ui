import { Empty } from 'antd';
import { LoadingGif } from 'components/LoadingGif';
import { IPaymentMethod, paymentMethodsFetch } from 'modules';
import { useP2pPublicInfos, usePaymentMethodsFetch } from 'plugins/P2p/hooks';
import React from 'react';
import { BiPlus, BiRefresh } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { P2pModalBase } from '../P2pModalBase';

interface IModalChoosePayment {
	show: boolean;
	onClose: () => void;
	onChoose: (payment: IPaymentMethod) => void;
	includedPaymentMethodsConfig?: number[];
	style?: React.CSSProperties | undefined;
}

export const ModalChoosePayment = (props: IModalChoosePayment) => {
	const { show, onClose, onChoose, includedPaymentMethodsConfig, style } = props;
	const { listPaymentMethods, isLoading } = usePaymentMethodsFetch();
	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;

	const dispatch = useDispatch();

	const onReload = () => {
		dispatch(paymentMethodsFetch());
	};

	const itemRenderName = (id: number) => paymentSupported.find(e => e.id === id);

	const filterListPaymentMethods = (idConfig: number) => {
		if (!includedPaymentMethodsConfig) {
			return true;
		}

		return !!includedPaymentMethodsConfig.find(e => e === idConfig);
	};

	const RenderListPayment = () => {
		return (
			<>
				{listPaymentMethods.length > 0 ? (
					<>
						{listPaymentMethods
							.filter(e => filterListPaymentMethods(e.paymentConfig))
							.map((item, index) => (
								<div
									className="p2p-container-modal-payment__body__item"
									key={index}
									onClick={() => onChoose(item)}
								>
									<div className="p2p-container-modal-payment__body__item__header">
										<div>
											<div className="p2p-container-modal-payment__body__item__header__method">
												{paymentSupported.find(e => e.id === item.paymentConfig)?.name}
											</div>
											{/* <div className="p2p-container-modal-payment__body__item__header__name">LETHANHPAT</div> */}
										</div>
									</div>

									{itemRenderName(item.paymentConfig)
										?.fields.filter(e => e.type !== 'image')
										.map(
											(field, key) =>
												item.fields[key]?.value && (
													<div className="p2p-container-modal-payment__body__item__info" key={key}>
														<div>{field.label}</div>
														<span>{item.fields[key].value}</span>
													</div>
												),
										)}
								</div>
							))}
					</>
				) : (
					<Empty />
				)}
			</>
		);
	};

	return (
		<P2pModalBase
			title="Select payment method"
			className="p2p-container-modal-payment"
			haveLine={false}
			onClose={onClose}
			position="left"
			show={show}
			style={style}
		>
			<div className="p2p-container-modal-payment__body">
				{isLoading ? (
					<div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
						<LoadingGif />
					</div>
				) : (
					<RenderListPayment />
				)}
			</div>

			<div className="p2p-container-modal-payment__footer">
				<button className="p2p-container-modal-payment__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--active">
					<BiPlus />
					<Link to="/p2p/payment">Add new</Link>
				</button>

				<button
					onClick={onReload}
					className="p2p-container-modal-payment__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--disable"
				>
					<BiRefresh /> Refresh
				</button>
			</div>
		</P2pModalBase>
	);
};
