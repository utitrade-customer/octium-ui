import {
	PRIVATE_INFO_USER_DATA,
	PRIVATE_INFO_USER_EDIT_FETCH,
	PRIVATE_INFO_USER_FETCH,
	PRIVATE_INFO_USER_RESET_ERR,
	PUBLIC_INFO_USER_DATA,
	PUBLIC_INFO_USER_FETCH,
	PUBLIC_INFO_USER_RESET_ERR,
} from './constants';
import { P2pPublicInfoUserState, P2pPrivateInfoUserState, IP2PPrivateInfoUserEdit } from './types';

export interface PrivateInfoUserFetch {
	type: typeof PRIVATE_INFO_USER_FETCH;
}

export interface PrivateInfoUserData {
	type: typeof PRIVATE_INFO_USER_DATA;
	payload: P2pPrivateInfoUserState;
}

export interface PublicInfoUserFetch {
	type: typeof PUBLIC_INFO_USER_FETCH;
	payload: { id: string };
}

export interface PublicInfoUserData {
	type: typeof PUBLIC_INFO_USER_DATA;
	payload: P2pPublicInfoUserState;
}

export interface PublicInfoUserResetErr {
	type: typeof PUBLIC_INFO_USER_RESET_ERR;
}

export interface PrivateInfoUserResetErr {
	type: typeof PRIVATE_INFO_USER_RESET_ERR;
}

export interface PrivateInfoUserEditNameFetch {
	type: typeof PRIVATE_INFO_USER_EDIT_FETCH;
	payload: IP2PPrivateInfoUserEdit;
	callBack: () => void;
}

export type P2pInfoUserActions =
	| PublicInfoUserFetch
	| PublicInfoUserData
	| PrivateInfoUserFetch
	| PrivateInfoUserData
	| PublicInfoUserResetErr
	| PrivateInfoUserResetErr
	| PrivateInfoUserEditNameFetch;

export const p2pPrivateInfoUserFetch = (): PrivateInfoUserFetch => ({
	type: PRIVATE_INFO_USER_FETCH,
});

export const p2pPrivateInfoUserData = (payload: P2pPrivateInfoUserState): PrivateInfoUserData => ({
	type: PRIVATE_INFO_USER_DATA,
	payload,
});

export const p2pPublicInfoUserFetch = (payload: { id: string }): PublicInfoUserFetch => ({
	type: PUBLIC_INFO_USER_FETCH,
	payload,
});

export const p2pPublicInfoUserData = (payload: P2pPublicInfoUserState): PublicInfoUserData => ({
	type: PUBLIC_INFO_USER_DATA,
	payload,
});

export const p2pPublicInfoUserResetErr = (): PublicInfoUserResetErr => ({
	type: PUBLIC_INFO_USER_RESET_ERR,
});

export const p2pPrivateInfoUserResetErr = (): PrivateInfoUserResetErr => ({
	type: PRIVATE_INFO_USER_RESET_ERR,
});

export const p2pPrivateInfoUserEditNameFetch = (
	payload: IP2PPrivateInfoUserEdit,
	callBack: () => void,
): PrivateInfoUserEditNameFetch => ({
	type: PRIVATE_INFO_USER_EDIT_FETCH,
	payload,
	callBack,
});
