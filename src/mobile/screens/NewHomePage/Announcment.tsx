import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAnnouncementListLatest } from 'modules/plugins/Announcements';
import { fetchAnnouncementList } from 'modules/plugins/Announcements';
import Slider from 'react-slick';
import { ListIcon, SpeakIcon } from 'mobile/assets/icons';
import { useHistory } from 'react-router-dom';
import { Link } from 'components/Link';

// tslint:disable-next-line: no-empty-interface
interface AnnouncmentProps {}

export const Announcment: React.FC<AnnouncmentProps> = ({}) => {
	const settings = {
		dots: false,
		infinite: false,
		arrows: false,
		slidesToShow: 1,
		slidesToScroll: 1,
		vertical: true,
		verticalSwiping: true,
		swipeToSlide: true,
		autoplay: true,
		autoplaySpeed: 4000,
	};
	const dispatch = useDispatch();
	const history = useHistory();

	const announcementLatest = useSelector(selectAnnouncementListLatest);

	React.useEffect(() => {
		dispatch(fetchAnnouncementList());
	}, []);

	const redirectsToAnnouncementDetail = (id: number) => {
		history.push('/announcements/detail/' + id);
	};

	const renderAnnouncementLatest = () => {
		return (
			<Slider {...settings}>
				{announcementLatest.map(announcement => {
					return (
						<div
							className="announcement__item"
							key={announcement.id}
							onClick={() => redirectsToAnnouncementDetail(announcement.id)}
						>
							{`${announcement.headline.substring(0, 38)}${announcement.headline.length > 38 ? '...' : ''}`}
						</div>
					);
				})}
			</Slider>
		);
	};
	return (
		<div className="td-mobile-screen-home__announcment">
			<div>
				<SpeakIcon />
			</div>
			<div className="td-mobile-screen-home__announcment__slider ml-3">
				<div className="td-mobile-screen-home__announcment__slider__inner">{renderAnnouncementLatest()}</div>
			</div>
			<div>
				<Link to="/announcement">
					<ListIcon />
				</Link>
			</div>
		</div>
	);
};
