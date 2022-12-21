import { takeLatest } from 'redux-saga/effects';
import { OPEN_TRADES_FETCH, INFO_TRADE_ITEM_FETCH, CANCEL_TRADES_FETCH } from '../constants';
import { p2pOpenTradeSaga, p2pInfoTradeSaga, p2pCancelTradeSaga } from './tradesSaga';

export function* rootP2PTradesSaga() {
	yield takeLatest(OPEN_TRADES_FETCH, p2pOpenTradeSaga);
	yield takeLatest(INFO_TRADE_ITEM_FETCH, p2pInfoTradeSaga);
	yield takeLatest(CANCEL_TRADES_FETCH, p2pCancelTradeSaga);
}
