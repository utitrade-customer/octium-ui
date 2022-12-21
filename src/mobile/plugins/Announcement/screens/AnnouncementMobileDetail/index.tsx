import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAnnouncementDetail } from 'modules/plugins/Announcements';
import { announcement } from 'modules/plugins/Announcements';

export const AnnouncementMobileDetail: React.FC = () => {
	const dispatch = useDispatch();
	const { id } = useParams<any>();

	const announcementDetail = useSelector(announcement);

	React.useEffect(() => {
		dispatch(fetchAnnouncementDetail(id));
	}, [id]);

	return (
		<div className="td-mobile__announcement__detail">
			<div className="container">
				<div className="td-mobile__announcement__article">
					<h2 className="td-mobile__announcement__article__heading">{announcementDetail.headline}</h2>
					<p className="td-mobile__announcement__article__created">
						{new Date(announcementDetail.created_at).toLocaleString()}
					</p>
					<p className="td-mobile__announcement__article__desc">{announcementDetail.description}</p>
					<div
						className="td-mobile__announcement__article__body"
						dangerouslySetInnerHTML={{
							__html: announcementDetail.body,
						}}
					/>
					<div className="td-mobile__udonex__team">Octium</div>
				</div>
			</div>
		</div>
	);
};
