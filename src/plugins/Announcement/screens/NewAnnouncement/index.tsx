import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCategories,
	selectAnnouncementListLatest,
	AnnouncementList,
	// fetchCategories,
	// fetchAnnouncements,
	fetchAnnouncementList,
} from 'modules/plugins/Announcements';
import { useHistory } from 'react-router-dom';
import Icons1 from './Assets/Group1.png';
import Icons2 from './Assets/Group2.png';
import Icons3 from './Assets/Group3.png';
import ImagePlaceholder from './Assets/image-placeholder.png';
import _toString from 'lodash/toString';

export const NewAnnouncement: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const baseAnnouncementUrlDetail: string = '/announcements/detail/';
	// const UrlCategories: string = '/announcements/categories/';

	const categories = useSelector(selectCategories);
	const announcementLatest = useSelector(selectAnnouncementListLatest);

	React.useEffect(() => {
		// dispatch(fetchCategories());
		dispatch(fetchAnnouncementList());
	}, []);

	// const redirectToCategory = name => {
	// 	history.push(UrlCategories + name);
	// 	dispatch(fetchAnnouncements(name));
	// };
	const redirectTolatestDetail = (id: number) => {
		history.push(baseAnnouncementUrlDetail + id);
	};
	const renderCategory = (category, desc: string, icons: any) => {
		return (
			<div
				className="category__box"
				// onClick={() => redirectToCategory(category.name)}
			>
				<img src={icons} alt="icons" />
				<div className="category__title">{category && category.name}</div>
				<div className="category__desc">{desc}</div>
			</div>
		);
	};
	const renderAnnouncementLastest = (latest: AnnouncementList, index: number) => {
		return (
			<React.Fragment>
				<div className="article__box__item">
					<img
						style={{ cursor: 'pointer' }}
						onClick={() => redirectTolatestDetail(latest.id)}
						src={latest.photo_url ? latest.photo_url : ImagePlaceholder}
						alt={_toString(latest.id)}
					/>
					<div className="article__box__item__body">
						<h2 onClick={() => redirectTolatestDetail(latest.id)}>{latest.headline}</h2>
						<div className="text-dark" style={{ marginBottom: '1rem' }}>
							{new Date(latest.created_at).toLocaleString()}
						</div>
						<p className="article__box__item__body__desc">{latest.description}</p>
					</div>
				</div>
			</React.Fragment>
		);
	};
	const renderLatestArticle = () => {
		return (
			<div className="announcement__latest">
				<h3 className="announcement__latest__heading">Latest Articles</h3>
				<div className="announcement__latest__grid">
					<div className="article__box">
						{announcementLatest.length ? (
							announcementLatest.map((annoucement, index) => renderAnnouncementLastest(annoucement, index))
						) : (
							<div className="w-100 text-dark mt-3">
								<h3>There aren't have lastest announcements.</h3>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	const renderCategories = () => {
		return (
			<div className="announcement__category">
				<h3 className="announcement__category__heading">All Topics</h3>
				<div className="row">
					<div className="col-lg-4">
						{renderCategory(
							categories[0],
							'Check out the latest coin listings and pairs on Launchpad, Launchpool, Spot, Margin, and Futures markets.',
							Icons1,
						)}
					</div>
					<div className="col-lg-4">
						{renderCategory(categories[1], "Stay on top of what's new in Binance.", Icons2)}
					</div>
					<div className="col-lg-4">
						{renderCategory(categories[2], 'Check the latest crypto airdrops Binance supports.', Icons3)}
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className="new__announcement">
			<div className="announs__container">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<h2 className="new__announcement__heading">Announcement</h2>
							{renderCategories()}
							{renderLatestArticle()}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
