import { AnnouncementFetchAction, AnnouncementDetailAction, CategoriesAction, AnnouncementFetchListAction } from './actions';
import {
	ANNOUNCEMENTS_FETCH,
	ANNOUNCEMENTS_FETCH_DATA,
	ANNOUNCEMENTS_FETCH_LIST,
	ANNOUNCEMENTS_FETCH_LIST_DATA,
	ANNOUNCEMENT_DETAIL,
	ANNOUNCEMENT_DETAIL_DATA,
	CATEGORY_FETCH,
	CATEGORY_FETCH_DATA,
} from './constants';
import { AnnouncementsState, AnnouncementDetailState, CategoriesState, AnnouncementListState } from './types';

export const initialAnnouncements: AnnouncementsState = {
	data: [],
	loading: false,
};

export const initialAnnouncementDetail: AnnouncementDetailState = {
	data: {
		id: 0,
		headline: '',
		description: '',
		state: true,
		body: '',
		priority: 0,
		photo_url: '',
		tags: '',
		created_at: '',
		updated_at: '',
		show_banner: false,
	},
	loading: false,
};

export const initialCategories: CategoriesState = {
	data: [],
	loading: false,
};
export const initialAnnouncementList: AnnouncementListState = {
	data: [],
	loading: false,
};

export const AnnouncementsReducer = (state = initialAnnouncements, action: AnnouncementFetchAction): AnnouncementsState => {
	switch (action.type) {
		case ANNOUNCEMENTS_FETCH:
			return {
				...state,
				loading: true,
			};
		case ANNOUNCEMENTS_FETCH_DATA:
			return {
				...state,
				data: action.payload,
				loading: false,
			};

		default:
			return state;
	}
};

export const AnnouncementDetailReducer = (
	state = initialAnnouncementDetail,
	action: AnnouncementDetailAction,
): AnnouncementDetailState => {
	switch (action.type) {
		case ANNOUNCEMENT_DETAIL:
			return {
				...state,
				loading: true,
			};

		case ANNOUNCEMENT_DETAIL_DATA:
			return {
				...state,
				data: action.payload,
				loading: false,
			};

		default:
			return state;
	}
};
export const CategoriesReducer = (state = initialCategories, action: CategoriesAction): CategoriesState => {
	switch (action.type) {
		case CATEGORY_FETCH:
			return {
				...state,
				loading: true,
			};
		case CATEGORY_FETCH_DATA:
			return {
				...state,
				data: action.payload,
				loading: false,
			};

		default:
			return state;
	}
};

export const AnnouncementListReducer = (
	state = initialAnnouncementList,
	action: AnnouncementFetchListAction,
): AnnouncementListState => {
	switch (action.type) {
		case ANNOUNCEMENTS_FETCH_LIST:
			return {
				...state,
				loading: true,
			};
		case ANNOUNCEMENTS_FETCH_LIST_DATA:
			return {
				...state,
				data: action.payload,
				loading: false,
			};

		default:
			return state;
	}
};
