import classNames from 'classnames';
import { Link } from 'components/Link';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { useTranslate } from 'hooks/useTranslate';
import * as React from 'react';
import { FaHistory, FaSignOutAlt, FaStar, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { IoMdArrowForward } from 'react-icons/io';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logoutFetch, selectUserLoggedIn } from '../../modules';

const Logo = require('../../assets/images/octicumLogo.png');
type HeaderControl =
	| 'EarnCoinFree'
	| 'stake'
	| 'ieo'
	| 'register'
	| 'login'
	| 'wallets'
	| ''
	| 'account'
	| 'order'
	| 'markets'
	| 'languages'
	| 'trade';

export const Header: React.FC = () => {
	const history = useHistory();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	// const currentLanguage = useSelector(selectCurrentLanguage);
	const [activeNow, setActiveNow] = React.useState<HeaderControl>('');
	const [activeItemDrop, setActiveItemDrop] = React.useState('');
	const refHeader = React.useRef<HTMLDivElement>(null);
	const locationHeader = window.location.href.split('/').pop();

	useOnClickOutside(refHeader, () => {
		setActiveNow(locationHeader as HeaderControl);
		setActiveItemDrop('');
	});
	const dispatch = useDispatch();
	const translate = useTranslate();

	// const getInfoCurrentLanguage = () => {
	// 	return LANGUAGES.find(lang => lang.code === currentLanguage);
	// };

	React.useEffect(() => {
		setStateActiveNow(String(locationHeader) as HeaderControl);
		setActiveNow(String(locationHeader) as HeaderControl);
		setActiveItemDrop('');
	}, []);

	const setStateActiveNow = (nameActive: HeaderControl) => {
		setActiveNow(nameActive);
		setActiveItemDrop('');
	};

	const classActiveItemDrop = (nameItem: string) =>
		classNames('header__right-menu__dropdown__wrap__content__title d-flex align-items-center ', {
			'header__right-menu__dropdown__wrap__content__title--active': activeItemDrop === nameItem,
		});

	const classActiveLeftItemDrop = (nameItem: string) => {
		return classNames('header__left-menu__dropdown__wrap__content__title d-flex align-items-center', {
			'header__left-menu__dropdown__wrap__content__title--active': activeItemDrop === nameItem,
		});
	};

	const classLinkActive = (nameActive: HeaderControl) => {
		return classNames('header__left-menu__dropdown__wrap', {
			'header__left-menu__dropdown__wrap--active': activeNow === nameActive,
		});
	};
	const classLinkRightActive = (nameActive: HeaderControl) => {
		return classNames('header__right-menu__dropdown__wrap', {
			'header__right-menu__dropdown__wrap--active': activeNow === nameActive,
		});
	};

	const classLinkActiveTitleDrop = (nameActive: HeaderControl) => {
		return classNames('header__right-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center', {
			'header__right-menu__dropdown__wrap__dropbtn--active': activeNow === nameActive,
		});
	};

	// const getLanguageActiveClassName = (code: LanguageCode) => {
	// 	return classNames(
	// 		{
	// 			'language--active': code === currentLanguage,
	// 		},
	// 		'd-flex  language',
	// 	);
	// };
	const renderWalletLink = () => {
		const classItemTitle = classNames('header__right-menu__item__title flex-shrink-0', {
			'header__right-menu__item__title--active': activeNow === 'wallets',
		});

		return (
			isLoggedIn && (
				<div className={classItemTitle} onClick={() => setStateActiveNow('wallets')}>
					<Link to="/wallets">Wallet</Link>
				</div>
			)
		);
	};

	const renderOrderTab = () => {
		return (
			isLoggedIn && (
				<div className="header__left-menu__dropdown flex-shrink-0">
					<div className={classLinkRightActive('order')} onClick={() => setStateActiveNow('order')}>
						<span className={classLinkActiveTitleDrop('order')}>
							{translate('page.body.landing.header.orders')}
							<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
						</span>
						{activeNow === 'order' && (
							<div className="header__right-menu__dropdown__wrap__content">
								<Link
									to="/orders"
									onClick={() => {
										setStateActiveNow('order');
										setActiveItemDrop('orders');
									}}
								>
									<div className={classActiveItemDrop('orders')}>
										<FaStar className="mr-2" />
										{translate('page.body.landing.header.openOrder')}
									</div>
								</Link>
								<Link
									to="/history"
									onClick={() => {
										setStateActiveNow('order');
										setActiveItemDrop('history');
									}}
								>
									<div className={classActiveItemDrop('history')}>
										<FaHistory className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
										{translate('page.body.landing.header.history')}
									</div>
								</Link>
							</div>
						)}
					</div>
				</div>
			)
		);
	};

	const renderLogout = () => {
		if (!isLoggedIn) {
			return null;
		}

		return (
			<Link
				to=" "
				onClick={() => {
					dispatch(logoutFetch());
					setStateActiveNow('');
					setActiveItemDrop('');
				}}
			>
				<div className="header__right-menu__dropdown__wrap__content__title d-flex align-items-center">
					<FaSignOutAlt className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
					<FormattedMessage id={'page.body.profile.content.action.logout'} />
				</div>
			</Link>
		);
	};

	const renderProfileLink = () => {
		return (
			isLoggedIn && (
				<Link
					to="/profile"
					onClick={() => {
						setStateActiveNow('account');
						setActiveItemDrop('profile');
					}}
				>
					<div className={classActiveItemDrop('profile')}>
						<FaUserCircle className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
						<FormattedMessage id={'page.header.navbar.profile'} />
					</div>
				</Link>
			)
		);
	};

	const renderReferralLink = () => {
		return (
			isLoggedIn && (
				<Link
					to="/referral"
					onClick={() => {
						setStateActiveNow('account');
						setActiveItemDrop('referral');
					}}
				>
					<div className={classActiveItemDrop('referral')}>
						<FaUserPlus className="header__right-menu__dropdown__wrap__content__title__icon mr-2" />
						<FormattedMessage id={'page.header.navbar.referral'} />
					</div>
				</Link>
			)
		);
	};

	const renderProfileTab = () => {
		return (
			isLoggedIn && (
				<>
					<div className="header__left-menu__dropdown flex-shrink-0  ">
						<div className={classLinkRightActive('account')} onClick={() => setStateActiveNow('account')}>
							<span className={classLinkActiveTitleDrop('account')}>
								{translate('page.body.landing.header.account')}
								<div className="header__right-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
							</span>
							{activeNow === 'account' && (
								<div className="header__right-menu__dropdown__wrap__content header__right-menu__dropdown__wrap__content--account">
									{renderProfileLink()}
									{renderReferralLink()}
									{renderLogout()}
								</div>
							)}
						</div>
					</div>
				</>
			)
		);
	};

	const redirectSignIn = () => {
		history.push('/login');
	};

	const redirectSingUp = () => {
		history.push('/register');
	};

	const renderUnLogin = () => {
		// const classLinkActiveLogin = classNames('header__right-menu__item__title', {
		// 	'header__right-menu__item__title--active': activeNow === 'login',
		// });

		const classLinkActiveRegister = classNames('header__right-menu__item__title header__right-menu__item__title--btn ', {
			'header__right-menu__item__title--btn--active': activeNow === 'register',
		});

		return (
			!isLoggedIn && (
				<>
					<div
						className="header__right-menu__item flex-shrink-0 custom-poiter"
						onClick={e => {
							redirectSignIn();
							setStateActiveNow('login');
						}}
					>
						<div className="header__right-menu__item__title">
							<span>{translate('page.body.landing.header.button2')}</span>
						</div>
					</div>
					<div
						className="header__right-menu__item flex-shrink-0 custom-poiter"
						onClick={e => {
							redirectSingUp();
							setStateActiveNow('register');
						}}
					>
						<span className={classLinkActiveRegister}>{translate('page.body.landing.header.button3')}</span>
					</div>
				</>
			)
		);
	};
	return (
		<div className="headerDesktop-screen" ref={refHeader}>
			<div className="container-header">
				<nav className="header d-flex flex-row justify-content-between align-items-center">
					<div className="header__left-menu d-flex flex-row align-items-center">
						<div className="header__left-menu__logo" onClick={() => setStateActiveNow('')}>
							<Link to="/">
								<img
									src={Logo}
									alt="logo-site"
									style={{
										height: '4rem',
										objectFit: 'contain',
									}}
								/>
							</Link>
						</div>

						<div className="header__left-menu__dropdown flex-shrink-0">
							<div className={classLinkActive('markets')} onClick={() => setStateActiveNow('markets')}>
								<Link
									to="/markets"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									{translate('header.markets.link.text')}
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0">
							<div
								className={classLinkActive('trade')}
								onMouseMove={() => setStateActiveNow('trade')}
								onMouseLeave={() => setStateActiveNow('')}
							>
								<span className={classLinkActiveTitleDrop('trade')}>
									{translate('header.trade.link.text')}
									<div className="header__left-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
								</span>
								{activeNow === 'trade' && (
									<div className="header__left-menu__dropdown__wrap__content">
										<Link
											to="/market"
											className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
											onClick={() => setStateActiveNow('trade')}
										>
											<div className={classActiveLeftItemDrop('airdrops')}>
												{translate('header.trade.dropdown.spot')}
												<IoMdArrowForward color="#ffff" />
											</div>
										</Link>
										<Link
											to="/p2p"
											className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
											onClick={() => setStateActiveNow('trade')}
										>
											<div className={classActiveLeftItemDrop('trading-competition')}>
												{translate('header.trade.dropdown.p2p')}
												<IoMdArrowForward color="#ffff" />
											</div>
										</Link>
									</div>
								)}
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 ">
							<div className={classLinkActive('ieo')} onClick={() => setStateActiveNow('ieo')}>
								<Link
									to="/ieo"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									{translate('header.launchpad.link.text')}
								</Link>
							</div>
						</div>
						<div className="header__left-menu__dropdown flex-shrink-0 d-none d-lg-block d-xl-block ">
							<div className={classLinkActive('stake')} onClick={() => setStateActiveNow('stake')}>
								<Link
									to="/stake"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									{translate('header.smartStake.link.text')}
								</Link>
							</div>
						</div>
						{/* <div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('vote')} onClick={() => setStateActiveNow('vote')}>
								<Link
									to="/vote"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Vote Listing
								</Link>
							</div>
						</div> */}

						{/* <div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('Announcements')} onClick={() => setStateActiveNow('Announcements')}>
								<Link
									to="/announcements"
									className="header__left-menu__dropdown__wrap__dropbtn d-flex flex-row align-items-center"
								>
									Announcements
								</Link>
							</div>
						</div> */}
					</div>

					<div className="header__right-menu d-flex align-items-center flex-row">
						{renderUnLogin()}
						{renderWalletLink()}
						{renderOrderTab()}
						{renderProfileTab()}
						{/* <div className="header__left-menu__dropdown flex-shrink-0  ">
							<div className={classLinkActive('languages')} onClick={() => setStateActiveNow('languages')}>
								<span className={classLinkActiveTitleDrop('languages')}>
									<img
										src={getInfoCurrentLanguage()?.icon}
										style={{
											width: '1.5rem',
											objectFit: 'contain',
										}}
									/>
									{_toUpper(getInfoCurrentLanguage()?.code) || 'EN'}

									<div className="header__left-menu__dropdown__wrap__dropbtn__icon-drop-down"> </div>
								</span>
								<div
									className="header__right-menu__dropdown__wrap__content"
									style={{
										marginRight: '1.2rem',
									}}
								>
									{activeNow === 'languages' &&
										LANGUAGES.map((language, index) => (
											<div
												key={index}
												onClick={() => dispatch(changeLanguage(language.code))}
												className={getLanguageActiveClassName(language.code)}
												style={{
													padding: ' 1rem 1.25rem',
													fontSize: 'var(--fs-header)',
													color: '#000',
												}}
											>
												<img
													src={language.icon}
													style={{
														width: '1.5rem',
														objectFit: 'contain',
													}}
												/>
												{translate(`page.language.${language.code}`)}
											</div>
										))}
								</div>
							</div>
						</div> */}
					</div>
				</nav>
			</div>
		</div>
	);
};
