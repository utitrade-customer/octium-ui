import { Modal } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { IoIosCloseCircle } from 'react-icons/io';

interface IP2pModalBase {
	title: string;
	position: 'left' | 'center';
	onClose: () => void;
	children: React.ReactNode;
	haveLine: boolean;
	className?: string;
	show: boolean;
	style?: React.CSSProperties;
}

export const P2pModalBase = (props: IP2pModalBase) => {
	const { title, position, onClose, children, haveLine, className, show, style } = props;

	const classModal = classNames('p2p-container-modal-base', className);

	const classLine = classNames('p2p-container-modal-base__header', {
		'p2p-container-modal-base__header__line': haveLine,
	});

	return (
		<Modal style={{ ...style }} visible={show} closable={false} className={classModal}>
			<div className={classLine}>
				{position === 'center' && <div></div>}
				<div className="p2p-container-modal-base__header__title">{title}</div>
				<div className="p2p-container-modal-base__header__closed">
					<IoIosCloseCircle onClick={onClose} />
				</div>
			</div>

			<div className="p2p-container-modal-base__body">{children}</div>
		</Modal>
	);
};
