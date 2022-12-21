import {
	selectInfoUserPrivateLoading,
	selectInfoUserPrivate,
	p2pPrivateInfoUserFetch,
	selectInfoUserErrPrivate,
	p2pPublicInfoUserFetch,
	selectInfoUserPublic,
	selectInfoUserPublicLoading,
	selectInfoUserErrPublic,
	p2pPublicInfoUserData,
	p2pPrivateInfoUserData,
	IInfoUserPublic,
	IInfoUser,
} from 'modules';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallPrivateApi } from './useCallPrivateApi';

interface IUseInfoUserPrivate {
	infoUser?: IInfoUserPublic | IInfoUser;
	isLoading: boolean;
	error: boolean;
}

export const useInfoUser = (id?: string): IUseInfoUserPrivate => {
	const dispatch = useDispatch();
	const validCallPrivate = useCallPrivateApi('low');

	const isLoading = useSelector(selectInfoUserPrivateLoading);
	const infoUser = useSelector(selectInfoUserPrivate);
	const error = !!useSelector(selectInfoUserErrPrivate);

	const isLoadingPublic = useSelector(selectInfoUserPublicLoading);
	const infoUserPublic = useSelector(selectInfoUserPublic);
	const errorPublic = !!useSelector(selectInfoUserErrPublic);

	useEffect(() => {
		if (!isLoading && !id && validCallPrivate) {
			dispatch(p2pPrivateInfoUserFetch());
		}

		if (!isLoading && id) {
			dispatch(
				p2pPublicInfoUserFetch({
					id,
				}),
			);
		}
	}, [id, validCallPrivate]);

	return {
		infoUser: id ? infoUserPublic : infoUser,
		isLoading: id ? isLoadingPublic : isLoading,
		error: id ? errorPublic : error,
	};
};

export const clearErrorInfoUser = (dispatch): void => {
	dispatch(
		p2pPublicInfoUserData({
			loading: false,
			error: undefined,
		}),
	);

	dispatch(
		p2pPrivateInfoUserData({
			loading: false,
			error: undefined,
		}),
	);
};
