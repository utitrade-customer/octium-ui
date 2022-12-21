import * as React from 'react';
import { P2pNavBar } from '../../components';
import { ContentListPaymentMobile } from './ContentListPayment';

export const P2pPaymentMobileScreenComponent = () => {
	return (
		<div className="pg-mobile-p2p-payment-method-screen">
			<P2pNavBar showPoster={false} />

			<div className="container">
				<div className="pg-p2p-layout__title">List payment</div>

				<div className="pg-mobile-p2p-payment-method-screen__box">
					<ContentListPaymentMobile />
				</div>
			</div>
		</div>
	);
};

export const P2pPaymentMobileScreen = React.memo(P2pPaymentMobileScreenComponent);
