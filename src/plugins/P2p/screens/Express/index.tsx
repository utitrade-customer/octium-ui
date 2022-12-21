import { P2pNavBar } from 'plugins/P2p/components';
import React from 'react';
import ComingSoonImage from 'assets/images/p2p/coming_soon.png';

export const Express = () => {
	return (
		<div className="express-screen">
			<P2pNavBar />
			<div className="d-flex" style={{ minHeight: '40em' }}>
				<img className="m-auto" src={ComingSoonImage} />
			</div>
		</div>
	);
};
