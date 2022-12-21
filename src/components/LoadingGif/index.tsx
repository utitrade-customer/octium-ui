import React from 'react';
import loadingGif from 'assets/images/loading.gif';
import { useSelector } from 'react-redux';
import { selectMobileDeviceState } from 'modules';

export const LoadingGif = (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
	const isMobileDevice = useSelector(selectMobileDeviceState);

	return (
		<img
			style={{
				width: isMobileDevice ? '5rem' : '10rem',
				height: 'auto',
			}}
			src={loadingGif}
			alt="loading"
			{...props}
		></img>
	);
};
