import { P2pNavBar } from 'plugins/P2p/components';
import * as React from 'react';
import { ContentListPayment } from './ContentListPayment';

export const P2pListPayment = () => {
	return (
		<div className="p2p-screen-list-payment">
			<P2pNavBar />

			<div className="container">
				<div className="pg-p2p-layout__title">Payments</div>
				<div className="p2p-screen-list-payment__box">
					<ContentListPayment />
				</div>
			</div>
		</div>
	);
};
