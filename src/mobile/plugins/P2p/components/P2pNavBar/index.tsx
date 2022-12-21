import { Badge } from 'antd';
import P2PBlueIcon from 'assets/icons/p2p/p2p_blue_icon.svg';
import P2pIcon from 'assets/icons/p2p/p2p_icon.svg';
import Illustration from 'assets/images/p2p/illustration.png';
import P2PPosterTitle from 'assets/images/p2p/p2p_poster_title.png';
import { selectUserLoggedIn } from 'modules';
import { P2pLink, P2PRoutes } from 'plugins/P2p/components';
import { useP2pMyTradeNewItem } from 'plugins/P2p/hooks';
import React from 'react';
import { BiDollarCircle } from 'react-icons/bi';
import { BsFillCaretDownFill, BsPlus, BsThreeDotsVertical } from 'react-icons/bs';
import { RiFileList2Line, RiFilePaperLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

interface P2pNavBarProps {
	showPoster?: boolean;
}

export const P2pNavBar = (props: P2pNavBarProps) => {
	const { showPoster = true } = props;
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const history = useHistory();
	const { listItem } = useP2pMyTradeNewItem();
	const [openMoreDropdown, setOpenMoreDropdown] = React.useState(false);

	const isNavBarItemSelected = (key: string): boolean => {
		return history.location.pathname.includes(key);
	};

	window.addEventListener('click', function (event) {
		if (document.getElementById('p2p__nav-bar__more-dropdown') && event.target !== null) {
			if (!document.getElementById('p2p__nav-bar__more-dropdown')?.contains(event.target as Node) && openMoreDropdown) {
				setOpenMoreDropdown(false);
			}
		}
	});

	const showMoreDropdown = () => {
		return (
			<div
				className={`p2p-mobile-component-nav-bar__nav-bar__more-dropdown__dropdown ${
					openMoreDropdown && 'p2p-mobile-component-nav-bar__nav-bar__more-dropdown__dropdown--open'
				}`}
			>
				<div className="p2p-mobile-component-nav-bar__nav-bar__more-dropdown__dropdown__option" key="0">
					<P2pLink type="link" to="/p2p/payment">
						<BiDollarCircle className="mr-2" /> PayMent method
					</P2pLink>
				</div>
				<div className="p2p-mobile-component-nav-bar__nav-bar__more-dropdown__dropdown__option" key="1">
					<P2pLink type="link" to="/p2p/create">
						<BsPlus className="mr-2" /> Post new Ad
					</P2pLink>
				</div>
				<div className="p2p-mobile-component-nav-bar__nav-bar__more-dropdown__dropdown__option" key="2">
					<P2pLink type="link" to="/p2p/list">
						<RiFilePaperLine className="mr-2" /> My Ads
					</P2pLink>
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className={`p2p-mobile-component-nav-bar__poster container-fluid ${!showPoster && 'd-none'}`}>
				<div className="d-flex flex-column align-items-start justify-content-center mr-3">
					<img src={P2PPosterTitle} style={{ width: '13em' }} />
					<h6 className="p2p-mobile-component-nav-bar__poster__title">Buy/Sell Your Crypto Locally</h6>
					<p className="p2p-mobile-component-nav-bar__poster__subtitle">
						Peer-to-peer exchange (or P2P exchange) is a marketplace where people can trade crypto directly with each
						other on their own terms, in virtually any country.
					</p>
				</div>
				<div>
					<img src={Illustration} style={{ width: '11em', height: '10em' }} />
				</div>
			</div>
			{isLoggedIn && (
				<div className="p2p-mobile-component-nav-bar__nav-bar">
					<div className="d-flex flex-row">
						<div
							className={`p2p-mobile-component-nav-bar__nav-bar__item ${
								isNavBarItemSelected(P2PRoutes.EXPRESS) && 'p2p-mobile-component-nav-bar__nav-bar__item--selected'
							}`}
							onClick={() => history.push(P2PRoutes.EXPRESS)}
						>
							<span className="p2p-mobile-component-nav-bar__nav-bar__item__label">Express</span>
						</div>

						<div className="mx-3" onClick={() => history.push(P2PRoutes.ROOT)}>
							<div
								className={`p2p-mobile-component-nav-bar__nav-bar__item ${
									isNavBarItemSelected(P2PRoutes.ROOT) &&
									'p2p-mobile-component-nav-bar__nav-bar__item--selected'
								}`}
							>
								<span className="p2p-mobile-component-nav-bar__nav-bar__item__label">P2P</span>
							</div>
						</div>
					</div>

					{!isNavBarItemSelected(P2PRoutes.EXPRESS) && (
						<div className="d-flex flex-row align-items-center">
							<Badge size="small" count={listItem.length}>
								<P2pLink
									type="link"
									className={`p2p-mobile-component-nav-bar__nav-bar__item ${
										isNavBarItemSelected('my-trade') &&
										'p2p-mobile-component-nav-bar__nav-bar__item--selected'
									}`}
									to="/p2p/my-trade"
								>
									<RiFileList2Line className="p2p-mobile-component-nav-bar__nav-bar__item__icon" />
								</P2pLink>
							</Badge>

							<P2pLink
								type="link"
								isPublic
								className={`p2p-mobile-component-nav-bar__nav-bar__item ml-4 mr-4 ${
									isNavBarItemSelected('user-center') && 'p2p-mobile-component-nav-bar__nav-bar__item--selected'
								}`}
								to="/p2p/user-center"
							>
								<img
									src={isNavBarItemSelected('user-center') ? P2PBlueIcon : P2pIcon}
									className="p2p-mobile-component-nav-bar__nav-bar__item__icon"
									style={{ margin: 0 }}
								/>
							</P2pLink>

							<div
								id="p2p__nav-bar__more-dropdown"
								className="p2p-mobile-component-nav-bar__nav-bar__more-dropdown"
								onClick={() => setOpenMoreDropdown(state => !state)}
							>
								<div className="p2p-mobile-component-nav-bar__nav-bar__item ">
									<BsThreeDotsVertical className="p2p-mobile-component-nav-bar__nav-bar__item__icon" />

									<span className="p2p-mobile-component-nav-bar__nav-bar__item__label">More</span>
									<BsFillCaretDownFill
										className="p2p-mobile-component-nav-bar__nav-bar__item__icon"
										style={{ height: '1em' }}
									/>
								</div>
								{showMoreDropdown()}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
