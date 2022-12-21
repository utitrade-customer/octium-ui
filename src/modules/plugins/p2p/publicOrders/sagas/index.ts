import { takeLatest } from 'redux-saga/effects';
import { PUBLIC_ORDER_FETCH, PUBLIC_ORDER_ITEM_FETCH } from '../constants';
import { p2pPublicOrderSaga, p2pPublicOrderItemSaga } from './publicOrdersSaga';

export function* rootP2PPublicOrdersSaga() {
	yield takeLatest(PUBLIC_ORDER_FETCH, p2pPublicOrderSaga);
	yield takeLatest(PUBLIC_ORDER_ITEM_FETCH, p2pPublicOrderItemSaga);
}
