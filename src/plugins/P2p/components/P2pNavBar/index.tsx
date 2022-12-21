import React from 'react';
import P2PBlueIcon from 'assets/icons/p2p/p2p_blue_icon.svg';
import P2PIcon from 'assets/icons/p2p/p2p_icon.svg';
import Illustration from 'assets/images/p2p/illustration.png';
import P2PPosterTitle from 'assets/images/p2p/p2p_poster_title.png';
import { selectKycStatus, selectUserLoggedIn } from 'modules';
import { BiDollarCircle } from 'react-icons/bi';
import { BsFillCaretDownFill, BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import { RiFileList2Line, RiFilePaperLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ShowNewTrades } from './ShowNewTrades';
import { P2pLink } from '../P2pLink';
import { useP2pMyTradeNewItem } from 'plugins/P2p/hooks';
import { Badge } from 'antd';

interface P2pNavBarProps {
	showBanner?: boolean;
}
export enum P2PRoutes {
	ROOT = '/p2p',
	EXPRESS = '/express',
	MY_ORDER = '/p2p/my-trade',
	USER_CENTER = '/p2p/user-center',
}

export const P2pNavBar = (props: P2pNavBarProps) => {
	const { showBanner = true } = props;
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const history = useHistory();
	const infoKyc = useSelector(selectKycStatus);
	const { isLoading, listItem } = useP2pMyTradeNewItem();

	const isNavBarItemSelected = (key: string): boolean => {
		return history.location.pathname.includes(key);
	};

	const showMoreDropdown = () => {
		return (
			<div className="p2p-component-nav-bar__more-dropdown__dropdown">
				<P2pLink
					className="p2p-component-nav-bar__more-dropdown__dropdown__option"
					key="0"
					type="link"
					to={'/p2p/payment'}
				>
					<div>
						<BiDollarCircle className="mr-2" /> PayMent method
					</div>
				</P2pLink>
				<P2pLink
					className="p2p-component-nav-bar__more-dropdown__dropdown__option"
					key="1"
					type="link"
					to={'/p2p/create'}
				>
					<div>
						<BsPlus className="mr-2" /> Post new Ad
					</div>
				</P2pLink>
				<P2pLink className="p2p-component-nav-bar__more-dropdown__dropdown__option" key="2" type="link" to={'/p2p/list'}>
					<div>
						<RiFilePaperLine className="mr-2" /> My Ads
					</div>
				</P2pLink>
			</div>
		);
	};

	const renderMainItem = (title: string, isSelected = false, route: P2PRoutes) => {
		return (
			<div className="p2p-component-nav-bar__main-item__label" onClick={() => history.push(route)}>
				<div className={`p2p-component-nav-bar__main-item ${isSelected && 'p2p-component-nav-bar__main-item--selected'}`}>
					{title}
				</div>
			</div>
		);
	};

	return (
		<div>
			{showBanner && (
				<div className="p2p-component-nav-bar__poster">
					<div className="container d-flex flex-row justify-content-center">
						<div
							id="p2p-component-nav-bar__poster__left-content"
							className="d-flex flex-column align-items-start justify-content-center mr-3 ml-3"
							style={{ width: '50%' }}
						>
							<img src={P2PPosterTitle} />
							<h3 className="p2p-component-nav-bar__poster__title">Buy/Sell Your Crypto Locally</h3>
							<p className="p2p-component-nav-bar__poster__subtitle">
								Peer-to-peer exchange (or P2P exchange) is a marketplace where people can trade crypto directly
								with each other on their own terms, in virtually any country.
							</p>
						</div>
						<img src={Illustration} style={{ marginBottom: '2em' }} />
					</div>
				</div>
			)}
			{isLoggedIn && (
				<div className="d-flex flex-row" style={{ backgroundColor: 'rgb(var(--rgb-lucky-point))', minWidth: '100%' }}>
					<div className="p2p-component-nav-bar container">
						<div className="d-flex flex-row">
							{renderMainItem('Express', isNavBarItemSelected(P2PRoutes.EXPRESS), P2PRoutes.EXPRESS)}
							{renderMainItem('P2P', isNavBarItemSelected(P2PRoutes.ROOT), P2PRoutes.ROOT)}
						</div>

						{!isNavBarItemSelected(P2PRoutes.EXPRESS) && (
							<div className="d-flex flex-row">
								<div className="p2p-component-nav-bar__orders-dropdown">
									<Badge size="small" count={listItem.length}>
										<P2pLink
											type="link"
											to={P2PRoutes.MY_ORDER}
											className="p2p-component-nav-bar__item__label"
										>
											<div
												className={`p2p-component-nav-bar__item ${
													isNavBarItemSelected('my-trade') && 'p2p-component-nav-bar__item--selected'
												}`}
											>
												<RiFileList2Line className="p2p-component-nav-bar__item__icon" />
												Orders
											</div>
										</P2pLink>
									</Badge>
									{infoKyc.status === 'verify' && <ShowNewTrades isLoading={isLoading} listItem={listItem} />}
								</div>
								<P2pLink
									type="link"
									isPublic
									to={P2PRoutes.USER_CENTER}
									className={`p2p-component-nav-bar__item mr-5 ml-5 ${
										isNavBarItemSelected('user-center') && 'p2p-component-nav-bar__item--selected'
									}`}
								>
									<div style={{ color: 'red' }}>
										<img
											src={isNavBarItemSelected('user-center') ? P2PBlueIcon : P2PIcon}
											className="p2p-component-nav-bar__item__icon"
										/>
									</div>

									<div className="p2p-component-nav-bar__item__label">P2P User Center</div>
								</P2pLink>

								<div className="p2p-component-nav-bar__more-dropdown">
									<div className="p2p-component-nav-bar__item h-100">
										<BsThreeDotsVertical className="p2p-component-nav-bar__item__icon" />

										<span className="p2p-component-nav-bar__item__label">More</span>
										<BsFillCaretDownFill
											className="p2p-component-nav-bar__item__icon"
											style={{ height: '1em' }}
										/>
									</div>
									{showMoreDropdown()}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
