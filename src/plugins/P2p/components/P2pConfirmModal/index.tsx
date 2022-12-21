import React from 'react';
import { P2pModalBase } from 'plugins/P2p/containers';

interface IModalP2pConfirm {
	show: boolean;
	onClose: () => void;
	onConfirm: () => void;
	content: string | JSX.Element;
}

export const ModalP2pConfirm = (props: IModalP2pConfirm) => {
	const { onClose, onConfirm, show, content } = props;

	return (
		<P2pModalBase
			title={'Confirm'}
			className="p2p-component-confirm"
			haveLine={true}
			onClose={onClose}
			position="left"
			show={show}
		>
			<div className="p2p-component-confirm__body">{content}</div>
			<div className="p2p-component-confirm__footer">
				<button
					onClick={onConfirm}
					className="p2p-component-confirm__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--active"
				>
					Confirm
				</button>

				<button
					onClick={onClose}
					className="p2p-component-confirm__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--disable"
				>
					Cancel
				</button>
			</div>
		</P2pModalBase>
	);
};
