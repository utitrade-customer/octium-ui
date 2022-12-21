import { takeLatest } from 'redux-saga/effects';
import {
	P2P_PRIVATE_ORDER_UPDATE,
	P2P_PRIVATE_ORDER_ADD,
	P2P_PRIVATE_ORDER_FETCH,
	P2P_PRIVATE_ORDER_CLOSED,
	P2P_PRIVATE_ORDER_FIND_FETCH,
} from '../constants';
import {
	p2pPrivateOrderAddSaga,
	p2pPrivateOrderUpdateSaga,
	p2pPrivateOrderFetch,
	p2pPrivateOrderFindItemFetch,
	p2pPrivateOrderClosedSaga,
} from './ordersSaga';

export function* rootP2POrdersSaga() {
	yield takeLatest(P2P_PRIVATE_ORDER_FIND_FETCH, p2pPrivateOrderFindItemFetch);
	yield takeLatest(P2P_PRIVATE_ORDER_FETCH, p2pPrivateOrderFetch);
	yield takeLatest(P2P_PRIVATE_ORDER_ADD, p2pPrivateOrderAddSaga);
	yield takeLatest(P2P_PRIVATE_ORDER_UPDATE, p2pPrivateOrderUpdateSaga);
	yield takeLatest(P2P_PRIVATE_ORDER_CLOSED, p2pPrivateOrderClosedSaga);
}
