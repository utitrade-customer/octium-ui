import { IInfoUser, IInfoUserPublic } from 'modules';
import { P2pModalBase } from 'plugins/P2p/containers';
import React, { useState } from 'react';

export interface IPopupBannedUser {
	user: IInfoUser | IInfoUserPublic;
}

export const PopupBannedUser = (props: IPopupBannedUser) => {
	const { user } = props;
	const [isShowPopupBanned, setIsShowPopupBanned] = useState(user?.isBanned);

	return (
		<P2pModalBase
			title="Your account be banned"
			className="p2p-component-banned-user"
			haveLine={true}
			onClose={() => setIsShowPopupBanned(false)}
			position="left"
			show={isShowPopupBanned}
		>
			<div className="p2p-component-banned-user__body">
				<div className="p2p-component-banned-user__body__item">- Your can't transfer token from funding</div>
				<div className="p2p-component-banned-user__body__item">- Your can't open new ads</div>
				<div className="p2p-component-banned-user__body__item">- Your can't sell/by token </div>
				<div className="p2p-component-banned-user__body__item">- Contact to admin to report </div>
			</div>
			<div className="p2p-component-banned-user__footer">
				<button
					onClick={() => setIsShowPopupBanned(false)}
					className="p2p-component-banned-user__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--active"
				>
					I'm understand
				</button>
			</div>
		</P2pModalBase>
	);
};
