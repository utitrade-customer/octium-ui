import { Skeleton } from 'antd';
import { Link } from 'components/Link';
import { useTranslate } from 'hooks/useTranslate';
import { eventFetch, selectEvents } from 'modules';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider, { Settings } from 'react-slick';

const SLIDE_SHOW = 3;
const TEXT_LIMIT = 50;
export const HomeActivityList = React.memo(() => {
	const dispatch = useDispatch();

	// selectors
	const events = useSelector(selectEvents);
	const { loading, payload: activities } = events;

	// custom hooks
	const translate = useTranslate();

	// !side-effects
	React.useEffect(() => {
		dispatch(eventFetch());
	}, []);

	const settingSliderPhotos: Settings = {
		dots: true,
		infinite: false,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 2000,
		speed: 1000,
		adaptiveHeight: true,
		slidesToShow: SLIDE_SHOW,
		slidesToScroll: SLIDE_SHOW,
	};

	const settingsAnnouncement: Settings = {
		dots: false,
		infinite: true,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		vertical: true,
		verticalSwiping: true,
		swipeToSlide: true,
		autoplay: true,
		autoplaySpeed: 3000,
		speed: 1000,
	};

	return (
		<div className="home-activity-list">
			<Slider {...settingSliderPhotos}>
				{loading
					? Array.from({
							length: SLIDE_SHOW,
					  }).map(() => {
							return (
								<div className="activity-photo">
									<Skeleton />
								</div>
							);
					  })
					: activities
							.filter(activity => activity?.photo_url)
							.map((activity, index) => {
								return (
									<div className="activity-photo" key={index}>
										<Link to={`/announcements/detail/${activity.id}`} className="slide" target="_blank">
											<img src={activity.photo_url} alt={activity.headline} />
										</Link>
									</div>
								);
							})}
			</Slider>

			{activities.length > 0 && (
				<div className="activity-wrapper mt-5 d-flex justify-content-between">
					<div className="d-flex align-items-center">
						<div className="activity-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="24" height="24" rx="3" fill="var(--primary)" />
								<path
									d="M13.5556 18.6111V17.4056C14.813 17.0426 15.8403 16.3458 16.6375 15.3153C17.4347 14.2847 17.8333 13.1148 17.8333 11.8056C17.8333 10.4963 17.438 9.32315 16.6472 8.28611C15.8565 7.24907 14.8259 6.55556 13.5556 6.20556V5C15.163 5.36296 16.4722 6.17639 17.4833 7.44028C18.4944 8.70417 19 10.1593 19 11.8056C19 13.4519 18.4944 14.9069 17.4833 16.1708C16.4722 17.4347 15.163 18.2481 13.5556 18.6111ZM5 14.1583V9.49167H8.11111L12 5.60278V18.0472L8.11111 14.1583H5ZM13.1667 15.0917V8.53889C13.8667 8.75926 14.4306 9.17407 14.8583 9.78333C15.2861 10.3926 15.5 11.0731 15.5 11.825C15.5 12.5898 15.2861 13.2704 14.8583 13.8667C14.4306 14.463 13.8667 14.8713 13.1667 15.0917ZM10.8333 8.55833L8.63611 10.6583H6.16667V12.9917H8.63611L10.8333 15.1111V8.55833Z"
									fill="white"
								/>
							</svg>
						</div>
						<Slider {...settingsAnnouncement} className="activity-slider">
							{activities.map(announcement => {
								return (
									<div className="activity-description" key={announcement.id}>
										{`${announcement.headline.substring(0, TEXT_LIMIT)}${
											announcement.headline.length > TEXT_LIMIT ? '  ...' : ''
										}`}
										<span className="activity-time">
											{moment(new Date(announcement.updated_at)).format('YYYY/MM/DD')}
										</span>
									</div>
								);
							})}
						</Slider>
					</div>

					<Link to="/announcements" className="activity-link">
						{translate('page.homePage.btn.more')} {' >'}
					</Link>
				</div>
			)}
		</div>
	);
});
