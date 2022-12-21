import { IPaymentMethod, PaymentSupported, paymentMethodsRemove } from 'modules';
import { ModalP2pConfirm } from 'plugins/P2p/components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

interface IProps {
	item: IPaymentMethod;
	config: PaymentSupported | undefined;
}

export const PaymentItem = (props: IProps) => {
	const { item, config } = props;
	const { fields, id } = item;
	const [visible, setVisible] = useState(false);
	const dispatch = useDispatch();

	const handleVisibleChange = (newVisible: boolean) => {
		setVisible(newVisible);
	};

	const onRemoveItem = () => {
		dispatch(paymentMethodsRemove({ id: id }, () => {}));
		handleVisibleChange(false);
	};

	const renderRow = (title: string, value: string, key: number) => {
		return (
			<div className="p2p-screen-list-payment__box__body__item__body__info" key={key}>
				<span>{title}</span>
				<div>{value}</div>
			</div>
		);
	};

	return (
		<div className="p2p-screen-list-payment__box__body__item">
			<div className="p2p-screen-list-payment__box__body__item__header">
				<div className="p2p-screen-list-payment__box__body__item__header__title">{config?.name}</div>
				<div className="p2p-screen-list-payment__box__body__item__header__group-btn">
					<Link to={`/p2p/edit-payment/${id}`}>Edit</Link>

					<button onClick={() => handleVisibleChange(true)}>Delete</button>
				</div>
			</div>

			<div className="p2p-screen-list-payment__box__body__item__body">
				{fields.slice(0, 3).map((field, key) => {
					const { name, value } = field;
					if (name && value && config && config.fields.find(item => item.name === name)?.type !== 'image') {
						return renderRow(config.fields[key].label, value, key);
					}
					return null;
				})}
			</div>

			<ModalP2pConfirm
				show={visible}
				onClose={() => handleVisibleChange(false)}
				content="Do you want to delete the payment?"
				onConfirm={onRemoveItem}
			/>
		</div>
	);
};
