import { takeLatest } from 'redux-saga/effects';
import { PRIVATE_MY_TRADE_FETCH, PRIVATE_MY_TRADE_ITEM_FETCH } from '../constants';
import { p2pPrivateTradesSaga, p2pPrivateTradeItemSaga } from './myTradesSaga';

export function* rootP2PPrivateTradesSaga() {
	yield takeLatest(PRIVATE_MY_TRADE_FETCH, p2pPrivateTradesSaga);
	yield takeLatest(PRIVATE_MY_TRADE_ITEM_FETCH, p2pPrivateTradeItemSaga);
}
