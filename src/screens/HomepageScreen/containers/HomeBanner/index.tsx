import assets from 'assets';
import { useTranslate } from 'hooks/useTranslate';
import { selectUserLoggedIn } from 'modules';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
export const HomeBanner = () => {
	const history = useHistory();

	// selectors
	const isLoggedIn = useSelector(selectUserLoggedIn);
	// states
	const [registerInput, setEmailInput] = React.useState('');

	//  hooks custom
	const translate = useTranslate();
	return (
		<div className="home-banner d-flex w-100 justify-content-between">
			<div className="home-banner__title">
				<div className="home-banner__title--heading">{translate('page.homepage.banner.title')}</div>
				<div className="home-banner__title--sub-title">{translate('page.homePage.banner.subtitle')}</div>
				<div className="register-wrapper">
					{!isLoggedIn ? (
						<React.Fragment>
							<input
								className="register-input"
								value={registerInput}
								onChange={e => setEmailInput(e.target.value)}
								type="email"
								placeholder={translate('page.homePage.banner.btn.register.placeholder')}
							/>

							<button
								className="register-btn"
								onClick={() =>
									history.push({
										pathname: '/register',
										state: {
											email: registerInput,
										},
									})
								}
							>
								{translate('page.homePage.banner.btn.register')}
							</button>
						</React.Fragment>
					) : (
						<button
							className="btn-trade"
							onClick={() =>
								history.push({
									pathname: '/market/btcusd',
								})
							}
						>
							{translate('page.homePage.banner.btn.trade')}
						</button>
					)}
				</div>
			</div>
			<div className="home-banner-logo">
				<img src={assets.icon_gif} alt="logo-icon" />
			</div>
		</div>
	);
};
