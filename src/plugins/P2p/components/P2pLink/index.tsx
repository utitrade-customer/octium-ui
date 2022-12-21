import { Link } from 'components/Link';
import { selectKycStatus, selectUserInfo, selectUserLoggedIn } from 'modules';
import { P2pModalBase } from 'plugins/P2p/containers';
import React, { useState } from 'react';
import { AiOutlineLine } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

interface IP2pLink {
	isPublic?: boolean;
	type: 'link' | 'function';
	to?: string;
	children: any;
	className?: string;
	callBack?: () => void;
	onClick?: () => void;
}

export const P2pLink = (props: IP2pLink) => {
	const infoKyc = useSelector(selectKycStatus);
	const [show, setShow] = useState(false);
	const { children, isPublic, to, className, type, callBack, onClick } = props;
	const history = useHistory();
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const user = useSelector(selectUserInfo);

	const showStep = (): { valid: boolean; current: number; text: string; action: () => void } => {
		const done1 = isLoggedIn;
		const done2 = user.otp && done1;
		const done3 = infoKyc.status === 'verify' && done2;

		if (done3) {
			return {
				valid: true,
				current: 3,
				text: '',
				action: () => {},
			};
		}

		if (done2) {
			return {
				valid: false,
				current: 2,
				text: 'Go to KYC',
				action: () => history.push('/profile/kyc'),
			};
		}

		if (done1) {
			return {
				valid: false,
				current: 1,
				text: 'Turn on 2FA',
				action: () => history.push('/security/2fa', { enable2fa: true }),
			};
		}

		return {
			valid: false,
			current: 0,
			text: 'Login now',
			action: () => history.push('/login'),
		};
	};

	const handlerClick = () => {
		!isLoggedIn && history.push('/login');

		if (isPublic) {
			type === 'function' ? callBack && callBack() : history.push(to || '');
			return;
		}

		if (!showStep().valid) {
			setShow(true);
			return;
		}

		type === 'function' ? callBack && callBack() : history.push(to || '');

		onClick && onClick();
		return;
	};

	return (
		<>
			<P2pModalBase
				title="You need completed to use this feature"
				className="p2p-component-link"
				haveLine={true}
				onClose={() => setShow(false)}
				position="left"
				show={show}
			>
				<div className="p2p-component-link__body">
					<div className="p2p-component-link__body__item">
						<div onClick={() => history.push('/security/2fa', { enable2fa: true })}>
							<BsDot /> Turn on 2fa{' '}
							{user.otp ? <FaCheckCircle className="p2p-component-link__body__item--active" /> : <AiOutlineLine />}
						</div>
					</div>

					<div className="p2p-component-link__body__item">
						<Link to="/profile/kyc">
							<BsDot /> Verify your identity KYC{' '}
							{infoKyc.status === 'verify' ? (
								<FaCheckCircle className="p2p-component-link__body__item--active" />
							) : (
								<AiOutlineLine />
							)}
						</Link>
					</div>
				</div>
				<div className="p2p-component-link__footer">
					<button
						onClick={showStep().action}
						className="p2p-component-link__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--active"
					>
						{showStep().text}
					</button>

					<button
						onClick={() => setShow(false)}
						className="p2p-component-link__footer__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--disable"
					>
						Not now !
					</button>
				</div>
			</P2pModalBase>
			<div className={className} onClick={handlerClick}>
				{children}
			</div>
		</>
	);
};
