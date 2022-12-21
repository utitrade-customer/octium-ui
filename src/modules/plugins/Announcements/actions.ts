import {
	ANNOUNCEMENTS_FETCH,
	ANNOUNCEMENTS_FETCH_DATA,
	ANNOUNCEMENT_DETAIL,
	ANNOUNCEMENT_DETAIL_DATA,
	CATEGORY_FETCH,
	CATEGORY_FETCH_DATA,
	ANNOUNCEMENTS_FETCH_LIST,
	ANNOUNCEMENTS_FETCH_LIST_DATA,
} from './constants';
import { Announcements, AnnouncementItem, AnnouncementDetailId, Categories, Category, AnnouncementList } from './types';

export interface AnnouncementsFetch {
	type: typeof ANNOUNCEMENTS_FETCH;
	payload: Category;
}
export interface AnnouncementsData {
	type: typeof ANNOUNCEMENTS_FETCH_DATA;
	payload: Announcements[];
}

export type AnnouncementFetchAction = AnnouncementsFetch | AnnouncementsData;

export const fetchAnnouncements = (payload: Category): AnnouncementsFetch => ({
	type: ANNOUNCEMENTS_FETCH,
	payload,
});
export const fetchAnnouncementsData = (payload: Announcements[]): AnnouncementsData => ({
	type: ANNOUNCEMENTS_FETCH_DATA,
	payload,
});

export interface AnnouncementDetail {
	type: typeof ANNOUNCEMENT_DETAIL;
	payload: AnnouncementDetailId;
}
export interface AnnouncementDetailData {
	type: typeof ANNOUNCEMENT_DETAIL_DATA;
	payload: AnnouncementItem;
}

export type AnnouncementDetailAction = AnnouncementDetail | AnnouncementDetailData;

export const fetchAnnouncementDetail = (payload: AnnouncementDetailId): AnnouncementDetail => ({
	type: ANNOUNCEMENT_DETAIL,
	payload,
});

export const fetchAnnouncementDetailData = (payload: AnnouncementItem): AnnouncementDetailData => ({
	type: ANNOUNCEMENT_DETAIL_DATA,
	payload,
});

export interface CategoryFetch {
	type: typeof CATEGORY_FETCH;
}
export interface CategoryFetchData {
	type: typeof CATEGORY_FETCH_DATA;
	payload: Categories[];
}

export const fetchCategories = (): CategoryFetch => ({
	type: CATEGORY_FETCH,
});
export const fetchCategoriesData = (payload: Categories[]): CategoryFetchData => ({
	type: CATEGORY_FETCH_DATA,
	payload,
});
export type CategoriesAction = CategoryFetch | CategoryFetchData;

export interface AnnouncementsFetchList {
	type: typeof ANNOUNCEMENTS_FETCH_LIST;
}
export interface AnnouncementsFetchListData {
	type: typeof ANNOUNCEMENTS_FETCH_LIST_DATA;
	payload: AnnouncementList[];
}

export type AnnouncementFetchListAction = AnnouncementsFetchList | AnnouncementsFetchListData;

export const fetchAnnouncementList = (): AnnouncementsFetchList => ({
	type: ANNOUNCEMENTS_FETCH_LIST,
});
export const announcementsData = (payload: AnnouncementList[]): AnnouncementsFetchListData => ({
	type: ANNOUNCEMENTS_FETCH_LIST_DATA,
	payload,
});
