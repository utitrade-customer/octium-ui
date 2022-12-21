import { CommonState } from '../../../modules/types';

export interface Announcements {
	id: number;
	headline: string;
	description: string;
	state: boolean;
	body: string;
	priority: number;
	photo_url: string;
	tags: string;
	created_at: string;
	updated_at: string;
}

export interface AnnouncementsState extends CommonState {
	data: Announcements[];
	loading: boolean;
}

export interface Category {
	category: string;
}
export interface CategoryState extends CommonState {
	data: Category;
	loading: boolean;
}

export interface AnnouncementItem {
	id: number;
	headline: string;
	description: string;
	state: boolean;
	body: string;
	priority: number;
	photo_url: string;
	tags: string;
	show_banner: boolean;
	created_at: string;
	updated_at: string;
}
export interface AnnouncementDetailId {
	id: string;
}
export interface AnnouncementDetailState extends CommonState {
	data: AnnouncementItem;
	loading: boolean;
}

export interface Categories {
	name: string;
}
export interface CategoriesState extends CommonState {
	data: Categories[];
	loading: boolean;
}

export interface AnnouncementList {
	id: number;
	body: string;
	description: string;
	headline: string;
	created_at: string;
	photo_url: string;
}

export interface AnnouncementListState extends CommonState {
	data: AnnouncementList[];
	loading: boolean;
}
