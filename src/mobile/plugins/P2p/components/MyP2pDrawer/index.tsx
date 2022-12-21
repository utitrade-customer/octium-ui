import { Drawer } from 'antd';
import React, { FC } from 'react';

interface MyP2pDrawerProps {
	title: React.ReactNode;
	visible: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	className: string;
	height?: string | number;
	width?: string | number;
	placement?: 'bottom' | 'top' | 'right' | 'left';
	zIndex?: number;
}

export const MyP2pDrawer: FC<MyP2pDrawerProps> = ({
	title,
	visible,
	onClose,
	children,
	className,
	height = '100vh',
	width = '100vw',
	placement = 'bottom',
	zIndex = 9999999,
}) => {
	const renderCloseIcon = () => {
		return (
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM15 13.59L13.59 15L10 11.41L6.41 15L5 13.59L8.59 10L5 6.41L6.41 5L10 8.59L13.59 5L15 6.41L11.41 10L15 13.59Z"
					fill="black"
				/>
			</svg>
		);
	};

	return (
		<Drawer
			className={className}
			height={height}
			width={width}
			placement={placement}
			onClose={onClose}
			visible={visible}
			zIndex={zIndex}
			title={title}
			closeIcon={renderCloseIcon()}
		>
			{children}
		</Drawer>
	);
};
