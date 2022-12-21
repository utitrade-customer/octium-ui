import * as React from 'react';
import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { Link } from 'components/Link';
import { useTranslate } from './../../hooks/useTranslate';

const Logo = require('../../assets/images/octicumLogoFooter.png');

export const Footer: React.FC = Props => {
	const history = useHistory();
	const translate = useTranslate();
	const [emailAddress, setemailAddress] = useState('');

	const inputEmail = (e: any) => {
		setemailAddress(e.target.value);
	};

	const sendEmail = () => {
		const valueEmail = emailAddress;
		// do something
		setemailAddress(valueEmail);
	};

	if (history.location.pathname.startsWith('/confirm')) {
		return <React.Fragment />;
	}

	return <React.Fragment>{renderFooterDesktop(inputEmail, sendEmail, emailAddress, translate)}</React.Fragment>;
};

const renderFooterDesktop = (inputEmail, sendEmail, emailAddress, translate) => {
	// const valueInput: string = emailAddress;

	return (
		<div className="footerDesktop-screen">
			<div className="container-footer-screen">
				<div className="footer d-flex flex-row justify-content-between ">
					<div className="footer__logo">
						<Link className="footer__logo__img" to="/">
							<img src={Logo} alt="" />
						</Link>
						<p className="footer__info__item mt-5 mb-5">
							{translate('page.footer.info.item.text1')}
							<br />
							{translate('page.footer.info.item.text2')}
							<br />
							{translate('page.footer.info.item.text3')}
							<br /> {translate('page.footer.info.item.text4')}
							<br /> {translate('page.footer.info.item.text5')}
						</p>
						{/* <p className="footer__info__item">Follow us</p>
						<div className="footer__news__list-icon ">
							<div className="footer__news__list-icon__item  ">
								<a href="https://twitter.com/Udonex2021" target="blank">
									<img src={Twiter} alt="twiter" />
								</a>
							</div>
							<div className="footer__news__list-icon__item  ">
								<a href="https://t.me/udonex" target="blank">
									<img src={Telegram} alt="telegram" />
								</a>
							</div>
						</div> */}
					</div>
					<div className="footer__info">
						<p className="footer__info__title">{translate('page.footer.info.title.contact')}</p>
						{/* <div style={{ borderBottom: '2px solid var(--blue)', width: 50, marginBottom: 20 }}></div>
						<p className="footer__info__item">
							<FaPhoneAlt className="footer__info__item__icon" /> +91 76669 03962
						</p> */}
						<p className="footer__info__item">
							<FaEnvelope className="footer__info__item__icon" /> {translate('page.footer.info.link')}
						</p>
					</div>
					<div className="footer__news">
						<p className="footer__news__title">{translate('page.footer.info.title.quick.links')}</p>
						<div style={{ borderBottom: '2px solid var(--blue)', width: 50, marginBottom: 20 }}></div>
						<p className="footer__info__item">
							<Link to="/markets">{translate('page.footer.info.title.item.markets')}</Link>
						</p>
						<p className="footer__info__item">
							<Link to="/ieo">{translate('page.footer.info.title.item.launchpad')}</Link>
						</p>
						<p className="footer__info__item">
							<Link to="/competition">{translate('page.footer.info.title.item.competition')}</Link>
						</p>
						<p className="footer__info__item">
							<Link to="/stake">{translate('page.footer.info.title.item.stake')}</Link>
						</p>
						<p className="footer__info__item">
							<Link to="/promotion">{translate('page.footer.info.title.item.promotion')}</Link>
						</p>
					</div>
					<div className="footer__info">
						<p className="footer__info__title">{translate('page.footer.info.title.service.support')}</p>
						<div style={{ borderBottom: '2px solid var(--blue)', width: 50, marginBottom: 20 }}></div>
						<p className="footer__info__item">
							<Link to="/fee">{translate('page.footer.info.title.asset.fee')}</Link>
						</p>
						<p className="footer__info__item">
							<Link to="/announcements">{translate('page.footer.info.title.announcements')} </Link>
						</p>
						<p className="footer__info__item">
							<a href="https://forms.gle/3Uh36DAqDrrUAZZd7" target="blank">
								{translate('page.footer.info.title.list.token.coin')}
							</a>
						</p>
						<p className="footer__info__item">
							<a href="https://api.cryptoxxpro.io/" target="blank">
								{translate('page.footer.info.title.API.documentation')}
							</a>
						</p>
						{/* <p className="footer__info__item">
							<Link to="/Udonex2cloud">Udonex Cloud Service</Link>
						</p> */}
					</div>
				</div>
			</div>
			<div>
				<div className="white-line"></div>
				<p className="footer__copyright">
					{translate('page.footer.info.copyright.text1')} {' '}
					<span className="text-primary">{translate('page.footer.info.copyright.text2')}</span>{' '}
					{translate('page.footer.info.copyright.text3')}
				</p>
			</div>
		</div>
	);
};
