import produce from 'immer';
import { P2pInfoUserActions } from './actions';
import {
	PRIVATE_INFO_USER_DATA,
	PRIVATE_INFO_USER_FETCH,
	PRIVATE_INFO_USER_RESET_ERR,
	PUBLIC_INFO_USER_DATA,
	PUBLIC_INFO_USER_FETCH,
	PUBLIC_INFO_USER_RESET_ERR,
} from './constants';
import { P2pPrivateInfoUserState, P2pPublicInfoUserState } from './types';

export const initialPublicInfoUser: P2pPublicInfoUserState = {
	loading: false,
};

export const p2pPublicInfoUserReducer = (state = initialPublicInfoUser, action: P2pInfoUserActions): P2pPublicInfoUserState => {
	switch (action.type) {
		case PUBLIC_INFO_USER_FETCH:
			return {
				...state,
				loading: true,
			};
		case PUBLIC_INFO_USER_DATA:
			const nextStateEdit = produce(state, draft => {
				const { payload, loading, error } = action.payload;

				draft.loading = loading;

				if (payload) {
					draft.payload = payload;
				}
				if (error) {
					draft.error = error;
				}
			});
			return nextStateEdit;
		case PUBLIC_INFO_USER_RESET_ERR:
			return {
				...state,
				error: undefined,
			};

		default:
			return state;
	}
};

export const initialPrivateInfoUser: P2pPrivateInfoUserState = {
	loading: false,
};

export const p2pPrivateInfoUserReducer = (
	state = initialPrivateInfoUser,
	action: P2pInfoUserActions,
): P2pPrivateInfoUserState => {
	switch (action.type) {
		case PRIVATE_INFO_USER_FETCH:
			return {
				...state,
				loading: true,
			};
		case PRIVATE_INFO_USER_DATA:
			const nextStateEdit = produce(state, draft => {
				const { payload, loading, error } = action.payload;

				draft.loading = loading;

				if (payload) {
					draft.payload = payload;
				}
				if (error) {
					draft.error = error;
				}
			});
			return nextStateEdit;
		case PRIVATE_INFO_USER_RESET_ERR:
			return {
				...state,
				error: undefined,
			};

		default:
			return state;
	}
};
