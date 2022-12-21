import { AnnouncementItem } from 'modules/plugins/Announcements';
import { CommonState } from '../../../types';

export interface EventItem extends AnnouncementItem {}

export interface EventsState extends CommonState {
	payload: EventItem[];
	loading: boolean;
}
