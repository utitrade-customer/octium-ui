import { RootState } from '../../index';
export const selectCategories = (state: RootState) => state.plugins.announcements.categories.data;
export const selectAnnouncementList = (state: RootState) => state.plugins.announcements.announcements.data;
export const announcement = (state: RootState) => state.plugins.announcements.announcementItem.data;
export const selectAnnouncementListLatest = (state: RootState) => state.plugins.announcements.announcementList.data;
