import React from 'react';
import ComingSoonImage from 'assets/images/p2p/coming_soon.png';
import { P2pNavBar } from 'mobile/plugins';

export const ExpressMobileScreen = () => {
	return (
		<div className="express-screen">
			<P2pNavBar />
			<div className="d-flex mt-5">
				<img className="m-auto" src={ComingSoonImage} />
			</div>
		</div>
	);
};
