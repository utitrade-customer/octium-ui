import { takeLatest } from 'redux-saga/effects';

import { ANNOUNCEMENTS_FETCH, ANNOUNCEMENT_DETAIL, CATEGORY_FETCH, ANNOUNCEMENTS_FETCH_LIST } from '../constants';
import { AnnouncementsSaga, AnnouncementItemSaga, CategoriesSaga, AnnouncementListSaga } from './announcementSaga';

export function* rootAnnouncementSaga() {
	yield takeLatest(ANNOUNCEMENTS_FETCH, AnnouncementsSaga);
	yield takeLatest(ANNOUNCEMENT_DETAIL, AnnouncementItemSaga);
	yield takeLatest(CATEGORY_FETCH, CategoriesSaga);
	yield takeLatest(ANNOUNCEMENTS_FETCH_LIST, AnnouncementListSaga);
}
