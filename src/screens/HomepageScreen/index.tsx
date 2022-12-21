import { home } from 'assets';
import { useTranslate } from 'hooks/useTranslate';
import React from 'react';
import { useHistory } from 'react-router';
import { HomeActivityList } from './containers/HomeActivityList';
import { HomeBanner } from './containers/HomeBanner';
import { HomeMarketHotList } from './containers/HomeMarketHotList';
import { MarketOverview } from './containers/MarketOverview';

export const HomepageScreen = () => {
	const history = useHistory();
	const translate = useTranslate();

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const renderDownload = () => {
		return (
			<div
				className="home-download"
				style={{
					backgroundImage: `url(${home.bg_download})`,
				}}
			>
				<div className="d-flex container-fluid">
					<div className="w-50">
						<div className="home-download__title">{translate('page.homepage.download.title')}</div>
						<div className="home-download__sub-title">{translate('page.homepage.download.subtitle')}</div>
						<div className="home-download__description">{translate('page.homepage.download.description')}</div>

						<div className="download-devices">
							<div className="download-devices__logo d-flex flex-column">
								<img src={home.apple_logo} alt="apple-logo" />
								Apple Store
							</div>
							<div className="download-devices__logo d-flex flex-column">
								<img src={home.CHPlay_logo} alt="chplay-logo" />
								CH Play
							</div>
							<div className="download-devices__logo d-flex flex-column">
								<img src={home.android_logo} alt="android-logo" />
								Android APK
							</div>
						</div>
					</div>
					<div className="w-50 d-flex justify-content-center">
						<img src={home.mobileScreen} alt="home-download-img" className="home-download__mobile" />
					</div>
					{/* <div className="home-download__footer">OTICUM</div> */}
				</div>
			</div>
		);
	};
	const renderIntroduction = () => {
		return (
			<div className="home-introduce">
				<div className="introduce-header">
					<div className="home-introduce__title">{translate('page.homepage.introduce.title')}</div>
					<div className="home-introduce__sub-title">{translate('page.homepage.introduce.subtitle')}</div>
				</div>
				<div className="introduce-content mt-5">
					<div className="row justify-content-between">
						<div
							style={{
								backgroundImage: `url(${home.maskGroupIntro1})`,
							}}
							className="col-xl-9 col-md-12 introduce-content__item"
						>
							<div className="introduce-content__item-title">
								{translate('page.homepage.introduce.item1.title')}
							</div>
							<div className="introduce-content__item-sub-title">
								{translate('page.homepage.introduce.item1.subtitle')}
							</div>
						</div>
						<div
							style={{
								backgroundImage: `url(${home.maskGroupIntro2})`,
							}}
							className="col-xl-3 col-md-4 introduce-content__item"
						>
							<div className="introduce-content__item-title">
								{translate('page.homepage.introduce.item2.title')}
							</div>
							<div className="introduce-content__item-sub-title">
								{translate('page.homepage.introduce.item2.subtitle')}
							</div>
						</div>

						<div
							style={{
								backgroundImage: `url(${home.maskGroupIntro3})`,
							}}
							className="col-xl-3 col-md-4 introduce-content__item"
						>
							<div className="introduce-content__item-title text-white">
								{translate('page.homepage.introduce.item3.title')}
							</div>
							<div className="introduce-content__item-sub-title text-white">
								{translate('page.homepage.introduce.item3.subtitle')}
							</div>
						</div>
						<div
							style={{
								backgroundImage: `url(${home.maskGroupIntro4})`,
							}}
							className="col-xl-9 col-md-12 introduce-content__item"
						>
							<div className="introduce-content__item-title">
								{translate('page.homepage.introduce.item4.title')}
							</div>
							<div
								className="introduce-content__item-sub-title"
								style={{
									width: '30%',
								}}
							>
								{translate('page.homepage.introduce.item4.subtitle')}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderMoreServices = () => {
		return (
			<div className="home-more-services">
				<div className="container-fluid">
					<div className="home-more-services__title">{translate('page.homepage.services.title')}</div>
					<div className="home-more-services__content row justify-content-center mt-4">
						{Array.from({
							length: 4,
						}).map((_, index) => {
							const id = index + 1;
							return (
								<div className="home-more-services__item col-xl-3 col-md-6 d-flex justify-content-center flex-column">
									<div className="home-more-services__item-logo d-flex">
										<img src={home[`service${id}`]} alt="more-services-1" />
									</div>
									<div className="home-more-services__item-title ">
										{translate(`page.homepage.services.item${id}.title` as any)}
									</div>
									<div className="home-more-services__item-subtitle">
										{translate(`page.homepage.services.item${id}.description` as any)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className="homepage-desktop-screen">
			<div className="container-fluid">
				<HomeBanner />
				<HomeMarketHotList />
				<HomeActivityList />
				<MarketOverview />
			</div>
			{renderDownload()}
			<div className="container-fluid">{renderIntroduction()}</div>
			{renderMoreServices()}
			<div className="home-footer">
				<div
					style={{
						backgroundImage: `url(${home.trip_bg})`,
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						padding: '4rem',
					}}
				>
					<div className="home-footer__content text-center">{translate('page.homepage.footer.text')}</div>
					<div className="w-10 d-flex mt-4">
						<button className="home-footer__btn m-auto" onClick={() => history.push('/market/btcusd')}>
							{translate('page.homepage.footer.btn.trade')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
