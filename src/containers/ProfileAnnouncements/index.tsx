import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncementList, selectAnnouncementListLatest } from 'modules';
import Slider from 'react-slick';
import { useHistory } from 'react-router';
import _toString from 'lodash/toString';
import { useIntl } from 'react-intl';
import placeHolderPNG from './image-placeholder.png';

const settingEvents = {
	dots: false,
	infinite: true,
	speed: 500,
	autoplay: true,
	autoplaySpeed: 3000,
	pauseOnHover: true,
	slidesToShow: 2,
	slidesToScroll: 1,
};

export const ProfileAnnouncements: React.FC = () => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const history = useHistory();

	const announcements = useSelector(selectAnnouncementListLatest);

	React.useEffect(() => {
		dispatch(fetchAnnouncementList());
	}, []);

	const redirectTolatestDetail = (id: number) => {
		history.push(`/announcements/detail/${id}`);
	};

	const renderAnnouncementLastest = (latest: any, index: number) => {
		return (
			<React.Fragment>
				<div className="ml-3">
					<img
						className="img-responsive"
						style={{ cursor: 'pointer', width: '100%', maxHeight: '175px', objectFit: 'cover' }}
						src={latest.photo_url ? latest.photo_url : placeHolderPNG}
						alt={_toString(latest.id)}
					/>
					<div className="mt-3">
						<h5 className="text-center" onClick={() => redirectTolatestDetail(latest.id)}>
							{latest.headline.slice(0, 50)}
						</h5>
					</div>
				</div>
			</React.Fragment>
		);
	};

	const renderAnnouncementList = () => {
		return (
			<div className="container" style={{ maxWidth: '720px' }}>
				<Slider {...settingEvents}>
					{[...announcements].map((announcement, index) => {
						return renderAnnouncementLastest(announcement, index);
					})}
				</Slider>
			</div>
		);
	};

	return (
		<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__security">
			<div className="td-pg-profile__content__item__header">
				<div className="td-pg-profile__content__item__header__title">
					{intl.formatMessage({ id: 'page.profile.Announcements.title' })}
				</div>
			</div>
			<div className="td-pg-profile__content__item__content d-flex justify-content-center align-items-center">
				{renderAnnouncementList()}
			</div>
		</div>
	);
};
