import * as React from 'react';
import { DollarCircleOutlined } from '@ant-design/icons';
import { selectAnnouncementList, selectCategories } from 'modules/plugins/Announcements';
import { fetchCategories } from 'modules/plugins/Announcements';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { fetchAnnouncements } from 'modules/plugins/Announcements';

export const AnnouncementCategory: React.FC = () => {
	const dispatch = useDispatch();
	const location = useLocation<any>();
	const history = useHistory();

	const UrlDetail: string = '/announcements/detail/';
	const UrlCategories: string = '/announcements/categories/';

	const [category, setCategory] = React.useState<any>(location.pathname.split('/')[3]);
	const [reload, setReload] = React.useState<any>(location.pathname.split('/')[3]);

	const announcmentlist = useSelector(selectAnnouncementList);
	const categories = useSelector(selectCategories);

	React.useEffect(() => {
		setReload(location.pathname.split('/')[3]);
		dispatch(fetchAnnouncements(reload));
	}, [reload]);

	React.useEffect(() => {
		dispatch(fetchCategories());
	}, []);

	const handleRedirectDetail = (id: number) => {
		history.push(UrlDetail + id);
	};
	const handleClickCategory = value => {
		setCategory(value);
		dispatch(fetchAnnouncements(value));
		history.push(UrlCategories + value);
	};
	const renderCategory = () => {
		return (
			<div className="announcement__category__session">
				<div className="article">
					{categories.map(category => {
						return (
							<div className="article__item d-flex flex-row" key={category.name}>
								<DollarCircleOutlined />
								<p className="article__name" onClick={() => handleClickCategory(category.name)}>
									{category.name}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	const renderCategoryDetail = () => {
		return (
			<div className="announcement__category__detail">
				<div className="article">
					<h3 className="announcement__category__heading">{category}</h3>
					<div className="article__list">
						{announcmentlist ? (
							announcmentlist.map(announcement => {
								return (
									<div className="article__list__item">
										<p
											key={announcement.id}
											className="article__list__item__name"
											onClick={() => handleRedirectDetail(announcement.id)}
										>
											{announcement.headline}
										</p>
										<div className="article__list__item__created">
											{new Date(announcement.created_at).toLocaleString()}
										</div>
									</div>
								);
							})
						) : (
							<div>No Data Show</div>
						)}
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className="announcment__category">
			<div className="annount__category__container">
				<div className="annount__category__heading">
					<h3>Announcement</h3>
				</div>
				<div className="row">
					<div className="col-lg-3">{renderCategory()}</div>
					<div className="col-lg-9">{renderCategoryDetail()}</div>
				</div>
			</div>
		</div>
	);
};
