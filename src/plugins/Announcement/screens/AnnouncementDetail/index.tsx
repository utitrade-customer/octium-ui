import React from 'react';
import { LeftCircleOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import {
	announcement,
	selectAnnouncementListLatest,
	fetchAnnouncementDetail,
	fetchAnnouncementList,
} from 'modules/plugins/Announcements';
import { useDispatch, useSelector } from 'react-redux';
import _toString from 'lodash/toString';

export const AnnouncementDetail: React.FC = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { id } = useParams<any>();
	const UrlDetail: string = '/announcements/detail/';

	const announcementDetail = useSelector(announcement);
	const announcementList = useSelector(selectAnnouncementListLatest);

	React.useEffect(() => {
		dispatch(fetchAnnouncementDetail(id));
		dispatch(fetchAnnouncementList());
	}, [id]);

	const redirectTolatestDetail = (announcementId: number) => {
		history.push(UrlDetail + announcementId);
	};
	const renderAnnouncementLastest = latest => {
		return (
			<div onClick={() => redirectTolatestDetail(latest.id)}>
				<p>{latest && latest.headline}</p>
				<span className="d-flex justify-content-end">{new Date(latest.created_at).toLocaleString()}</span>
			</div>
		);
	};

	const renderImage = () => {
		return !announcementDetail.photo_url ? (
			<div className="d-flex justify-content-center">
				<img style={{ maxWidth: '50%' }} src={announcementDetail.photo_url} alt={_toString(announcementDetail.id)} />
			</div>
		) : null;
	};
	return (
		<div className="announcement__detail">
			<div className="announcement__detail__container">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-8">
							<div className="announcement__article">
								<div className="announcement__article__prev mb-4">
									<LeftCircleOutlined onClick={() => history.goBack()} />
								</div>
								<h2 className="announcement__article__heading">{announcementDetail.headline}</h2>
								<p className="announcement__article__created">
									{new Date(announcementDetail.created_at).toLocaleString()}
								</p>
								{renderImage()}
								<p className="announcement__article__desc">{announcementDetail.description}</p>
								<div
									className="announcement__article__body"
									dangerouslySetInnerHTML={{
										__html: announcementDetail.body,
									}}
								/>
								<div className="udonex__team">Octium</div>
							</div>
						</div>
						<div className="col-lg-4">
							<div className="announcement__latest">
								<h2 className="announcement__latest__heading">Latest Articles</h2>
								<div className="article__box">
									{announcementList
										.slice(0, 6)
										.map(announcementItem => renderAnnouncementLastest(announcementItem))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
