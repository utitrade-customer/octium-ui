import { CommonState } from 'modules/types';

export interface IInfoUserPublic {
	fullName: string;
	id: string;
	statistic: {
		completedPercent: number;
		totalQuantity: number;
		totalCompleted: number;
		totalCompleted30d: number;
		totalQuantity30d: number;
	};
	isBanned: boolean;
}

export interface IInfoUser extends IInfoUserPublic {
	memberId: number;
}

export interface P2pPublicInfoUserState extends CommonState {
	payload?: IInfoUserPublic;
	loading: boolean;
}

export interface P2pPrivateInfoUserState extends CommonState {
	payload?: IInfoUser;
	loading: boolean;
}

export interface IP2PPrivateInfoUserEdit {
	fullName: string;
}
