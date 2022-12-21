import { takeLatest } from 'redux-saga/effects';
import { PAYMENT_METHODS_ADD, PAYMENT_METHODS_EDIT, PAYMENT_METHODS_FETCH, PAYMENT_METHODS_REMOVE } from '../constants';
import { addPaymentMethodsSaga, editPaymentMethodsSaga, paymentMethodsSaga, removePaymentMethodsSaga } from './paymentSaga';

export function* rootPaymentSaga() {
	yield takeLatest(PAYMENT_METHODS_FETCH, paymentMethodsSaga);
	yield takeLatest(PAYMENT_METHODS_ADD, addPaymentMethodsSaga);
	yield takeLatest(PAYMENT_METHODS_EDIT, editPaymentMethodsSaga);
	yield takeLatest(PAYMENT_METHODS_REMOVE, removePaymentMethodsSaga);
}
