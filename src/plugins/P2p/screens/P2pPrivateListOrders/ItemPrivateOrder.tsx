import { IP2PPrivateOrder, p2pPrivateOrdersClosed } from 'modules';
import { FiShare } from 'react-icons/fi';
import { TiDeleteOutline } from 'react-icons/ti';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import moment from 'moment';
import { checkNumberP2p, formatNumberP2p } from 'plugins/P2p/helper';
import { uniqBy } from 'lodash';
import { ModalP2pConfirm } from 'plugins/P2p/components';

interface IItemPrivateOrder {
	item: IP2PPrivateOrder;
}

export const ItemPrivateOrder = (props: IItemPrivateOrder) => {
	const { item } = props;
	const {
		fiat,
		currency,
		type,
		id,
		orderMax,
		orderMin,
		status,
		originVolume,
		volume,
		price,
		payments,
		createdAt,
		updatedAt,
	} = item;
	const [showDeleteConfirmationForm, setShowDeleteConfirmationForm] = useState(false);
	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;
	const dispatch = useDispatch();

	const RenderListPayment = () => {
		const findNamePaymentMethods = (id: number) => paymentSupported.find(item => item.id === id)?.name;
		return (
			<>
				{uniqBy(payments, function (e) {
					return e.paymentConfig;
				}).map((idPayment, index) => (
					<div key={index}>{findNamePaymentMethods(idPayment.paymentConfig)}</div>
				))}
			</>
		);
	};

	const showModal = () => {
		setShowDeleteConfirmationForm(true);
	};

	const handleDeleteAds = () => {
		dispatch(p2pPrivateOrdersClosed({ id }));
		setShowDeleteConfirmationForm(false);
	};

	const handleCloseConfirmationForm = () => {
		setShowDeleteConfirmationForm(false);
	};

	return (
		<>
			<div className="p2p-screen-my-ads__body__item--adv">
				<div className="p2p-screen-my-ads__body__item--adv__id">{id}</div>
				<div className={`p2p-screen-my-ads__body__item--adv__exchanging-type${type === 'buy' ? '--buy' : '--sell'}`}>
					{type.toUpperCase()}
				</div>
				<div>
					{currency.toUpperCase()} / {fiat.toUpperCase()}
				</div>
			</div>

			<div className="p2p-screen-my-ads__body__item--total">
				<div>
					{formatNumberP2p(volume)} {currency.toUpperCase()}
				</div>
				<div>
					{formatNumberP2p(checkNumberP2p(originVolume).value - checkNumberP2p(volume).value)} {currency.toUpperCase()}
				</div>
				<div>
					{checkNumberP2p(orderMin).render} {fiat.toUpperCase()}-{checkNumberP2p(orderMax).render} {fiat.toUpperCase()}
				</div>
			</div>

			<div className="p2p-screen-my-ads__body__item--price">
				<div>
					{formatNumberP2p(price.toString())} {fiat.toUpperCase()}
				</div>
			</div>

			<div className="p2p-screen-my-ads__body__item--pay">
				<RenderListPayment />
			</div>

			<div className="p2p-screen-my-ads__body__item--time">
				<div>{moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>
				<div>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
			</div>
			<div className="p2p-screen-my-ads__body__item--status">
				<div>{status[0].toUpperCase() + status.slice(1)}</div>
			</div>
			<div className="p2p-screen-my-ads__body__item--act">
				<div>
					{false && <FiShare />}

					{status !== 'canceled' && <TiDeleteOutline style={{ color: 'red' }} onClick={showModal} />}
				</div>
			</div>

			<ModalP2pConfirm
				show={showDeleteConfirmationForm}
				onClose={handleCloseConfirmationForm}
				content="Do you want to close the order?"
				onConfirm={handleDeleteAds}
			/>
		</>
	);
};
