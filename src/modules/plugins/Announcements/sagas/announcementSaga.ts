import { API, RequestOptions } from 'api';
import { put, call } from 'redux-saga/effects';
import { getCsrfToken } from 'helpers';

import {
	fetchAnnouncementsData,
	AnnouncementDetail,
	fetchAnnouncementDetailData,
	fetchCategoriesData,
	AnnouncementsFetch,
	AnnouncementsFetchList,
	announcementsData,
} from '../actions';
import { AnnouncementList } from '../types';
const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'announcement', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* AnnouncementsSaga(action: AnnouncementsFetch) {
	try {
		const announcements = yield call(API.get(createOptions(getCsrfToken())), `/public/article/list`);
		yield put(fetchAnnouncementsData(announcements.announcement_list));
	} catch (error) {
		yield put(fetchAnnouncementsData([]));
	}
}

export function* AnnouncementItemSaga(action: AnnouncementDetail) {
	try {
		const id = action.payload;
		const announcement = yield call(API.get(createOptions(getCsrfToken())), `/public/article/` + id);
		yield put(fetchAnnouncementDetailData(announcement));
	} catch (error) {
		console.log(`Error call get announcement item: ${JSON.stringify(error)}`);
	}
}

export function* CategoriesSaga() {
	try {
		const categoryList = yield call(API.get(createOptions(getCsrfToken())), `/public/announcement/fetch/category`);
		yield put(fetchCategoriesData(categoryList.categories));
	} catch (error) {
		console.log(`Error call get category: ${JSON.stringify(error)}`);
	}
}
export function* AnnouncementListSaga(action: AnnouncementsFetchList) {
	try {
		const announcementList: AnnouncementList[] = yield call(API.get(createOptions(getCsrfToken())), `/public/article/list`);
		yield put(announcementsData(announcementList));
	} catch (error) {
		yield put(announcementsData([]));
	}
}
