import UdonIconGif from 'assets/images/loading.gif';
import * as React from 'react';

// tslint:disable-next-line: no-empty-interface
interface LoadingMobileProps {}

export const LoadingMobile: React.FC<LoadingMobileProps> = ({}) => {
	return (
		<div className="td-mobile-cpn-loading">
			<img src={UdonIconGif} alt="loading" />
		</div>
	);
};
