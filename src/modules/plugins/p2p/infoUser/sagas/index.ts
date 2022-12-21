import { takeLatest } from 'redux-saga/effects';
import { PRIVATE_INFO_USER_EDIT_FETCH, PRIVATE_INFO_USER_FETCH, PUBLIC_INFO_USER_FETCH } from '../constants';
import { p2pPrivateInfoUserEditNameSaga, p2pPrivateInfoUserSaga, p2pPublicInfoUserSaga } from './infoUsersSaga';

export function* rootP2PInfoUserSaga() {
	yield takeLatest(PRIVATE_INFO_USER_FETCH, p2pPrivateInfoUserSaga);
	yield takeLatest(PUBLIC_INFO_USER_FETCH, p2pPublicInfoUserSaga);
	yield takeLatest(PRIVATE_INFO_USER_EDIT_FETCH, p2pPrivateInfoUserEditNameSaga);
}
