import { IPaymentMethod } from 'modules';
import { Tooltip } from 'antd';
import { useP2pPublicInfos } from 'plugins/P2p/hooks';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

interface IItemPaymentCustom {
	item: IPaymentMethod;
	onChoose: (id: number) => void;
	onRemove?: (id: number) => void;
}
export const ItemPaymentCustom = (props: IItemPaymentCustom) => {
	const { item, onChoose, onRemove } = props;
	const { id } = item;

	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;

	const itemRenderName = (id: number) => paymentSupported.find(e => e.id === id);

	const renderRow = (title: string, value: string) => {
		return (
			<div className="p2p-container-modal-payment__body__item__info" key={title + value}>
				<Tooltip placement="top" title={title}>
					<div>{title}</div>
				</Tooltip>

				<span>{value}</span>
			</div>
		);
	};

	return (
		<div className="p2p-container-modal-payment__body__item" onClick={() => onChoose(id)}>
			<div className="p2p-container-modal-payment__body__item__header">
				<div>
					<div className="p2p-container-modal-payment__body__item__header__method">
						{itemRenderName(item.paymentConfig)?.name}
					</div>
				</div>

				{onRemove && (
					<div className="p2p-container-modal-payment__body__item__header__remove">
						<IoMdClose onClick={() => onRemove(id)} />
					</div>
				)}
			</div>

			{itemRenderName(item.paymentConfig)
				?.fields.filter(e => e.type !== 'image')
				.map((field, key) => {
					return item.fields[key]?.value && renderRow(field.label, item.fields[key].value);
				})}
		</div>
	);
};
