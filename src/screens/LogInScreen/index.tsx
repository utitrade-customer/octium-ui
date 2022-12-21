import cx from 'classnames';
import { GeetestCaptcha } from 'containers';
import * as React from 'react';
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Login, TwoFactorAuth } from '../../components';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import { IntlProps } from '../../index';
import {
	Configs,
	RootState,
	selectAlertState,
	selectConfigs,
	selectSignInRequire2FA,
	selectSignUpRequireVerification,
	selectUserFetching,
	selectUserLoggedIn,
	signIn,
	signInError,
	signInRequire2FA,
	signUpRequireVerification,
} from '../../modules';

interface ReduxProps {
	isLoggedIn: boolean;
	loading?: boolean;
	require2FA?: boolean;
	requireEmailVerification?: boolean;
	configs: Configs;
}

interface DispatchProps {
	signIn: typeof signIn;
	signInError: typeof signInError;
	signInRequire2FA: typeof signInRequire2FA;
	signUpRequireVerification: typeof signUpRequireVerification;
}

interface LogInState {
	email: string;
	emailError: string;
	emailFocused: boolean;
	password: string;
	passwordError: string;
	passwordFocused: boolean;
	otpCode: string;
	error2fa: string;
	codeFocused: boolean;
	geetestCaptchaSuccess: boolean;
	reCaptchaSuccess: boolean;
	shouldGeetestReset: boolean;
	captcha_response?: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class FormLogin extends React.Component<Props, LogInState> {
	public state: LogInState = {
		email: '',
		emailError: '',
		emailFocused: false,
		password: '',
		passwordError: '',
		passwordFocused: false,
		otpCode: '',
		error2fa: '',
		codeFocused: false,
		geetestCaptchaSuccess: false,
		reCaptchaSuccess: false,
		shouldGeetestReset: false,
	};

	private reCaptchaRef;
	private geetestCaptchaRef;
	public constructor(props) {
		super(props);
		this.reCaptchaRef = React.createRef();
		this.geetestCaptchaRef = React.createRef();
	}
	public componentDidMount() {
		setDocumentTitle(this.props.intl.formatMessage({ id: 'page.header.signIn' }));
		this.props.signInError({ code: 0, message: [''] });
		this.props.signUpRequireVerification({ requireVerification: false });
	}

	public componentWillReceiveProps(props: Props) {
		if (props.isLoggedIn) {
			this.props.history.push('/wallets');
		}
		if (props.requireEmailVerification) {
			props.history.push('/email-verification', { email: this.state.email });
		}
	}

	public render() {
		const { loading, require2FA } = this.props;

		const className = cx('pg-sign-in-screen__container', { loading });

		return (
			<div className="pg-sign-in-screen">
				<div className={className}>{require2FA ? this.render2FA() : this.renderSignInForm()}</div>
			</div>
		);
	}

	private renderSignInForm = () => {
		const { loading } = this.props;
		const { email, emailError, emailFocused, password, passwordError, passwordFocused } = this.state;

		return (
			<Login
				email={email}
				emailError={emailError}
				emailFocused={emailFocused}
				emailPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
				password={password}
				passwordError={passwordError}
				passwordFocused={passwordFocused}
				passwordPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
				labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
				labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp' })}
				emailLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
				passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
				receiveConfirmationLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.receiveConfirmation' })}
				forgotPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.forgotPassword' })}
				isLoading={loading}
				onForgotPassword={this.forgotPassword}
				onSignUp={this.handleSignUp}
				onSignIn={this.handleSignIn}
				handleChangeFocusField={this.handleFieldFocus}
				isFormValid={this.validateForm}
				refreshError={this.refreshError}
				changeEmail={this.handleChangeEmailValue}
				changePassword={this.handleChangePasswordValue}
				renderCaptcha={this.renderCaptcha()}
				reCaptchaSuccess={this.state.reCaptchaSuccess}
				geetestCaptchaSuccess={this.state.geetestCaptchaSuccess}
				captcha_response={this.state.captcha_response}
				captchaType={this.props.configs.captcha_type}
			/>
		);
	};

	private handleGeetestCaptchaSuccess = value => {
		this.setState({
			geetestCaptchaSuccess: true,
			captcha_response: value,
			shouldGeetestReset: false,
		});
	};
	private handleReCaptchaSuccess: ReCAPTCHAProps['onChange'] = value => {
		this.setState({
			reCaptchaSuccess: true,
			captcha_response: value || '',
		});
	};
	private renderCaptcha = () => {
		const { configs } = this.props;
		const { shouldGeetestReset } = this.state;

		switch (configs.captcha_type) {
			case 'recaptcha':
				if (configs.captcha_id) {
					return (
						<div className="cr-sign-up-form__recaptcha">
							<ReCAPTCHA
								ref={this.reCaptchaRef}
								sitekey={configs.captcha_id}
								onChange={this.handleReCaptchaSuccess}
							/>
						</div>
					);
				}
				return null;
			case 'geetest':
				return (
					<GeetestCaptcha
						ref={this.geetestCaptchaRef}
						shouldCaptchaReset={shouldGeetestReset}
						onSuccess={this.handleGeetestCaptchaSuccess}
					/>
				);
			default:
				return null;
		}
	};

	private render2FA = () => {
		const { loading } = this.props;

		const { otpCode, error2fa, codeFocused } = this.state;

		return (
			<TwoFactorAuth
				isLoading={loading}
				onSubmit={this.handle2FASignIn}
				title={this.props.intl.formatMessage({ id: 'page.password2fa' })}
				label={this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' })}
				buttonLabel={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
				message={this.props.intl.formatMessage({ id: 'page.password2fa.message' })}
				codeFocused={codeFocused}
				otpCode={otpCode}
				error={error2fa}
				handleOtpCodeChange={this.handleChangeOtpCode}
				handleChangeFocusField={this.handle2faFocus}
				handleClose2fa={this.handleClose}
			/>
		);
	};

	private refreshError = () => {
		this.setState({
			emailError: '',
			passwordError: '',
		});
	};

	private handleChangeOtpCode = (value: string) => {
		this.setState({
			error2fa: '',
			otpCode: value,
		});
	};

	private handleSignIn = () => {
		const { email, password } = this.state;

		this.props.signIn({
			email,
			password,
		});
	};

	private handle2FASignIn = () => {
		const { email, password, otpCode } = this.state;

		if (!otpCode) {
			this.setState({
				error2fa: 'Please enter 2FA code',
			});
		} else {
			this.props.signIn({
				email,
				password,
				otp_code: otpCode,
			});
		}
	};

	private handleSignUp = () => {
		this.props.history.push('/register');
	};

	private forgotPassword = () => {
		this.props.history.push('/forgot_password');
	};

	private handleFieldFocus = (field: string) => {
		switch (field) {
			case 'email':
				this.setState(prev => ({
					emailFocused: !prev.emailFocused,
				}));
				break;
			case 'password':
				this.setState(prev => ({
					passwordFocused: !prev.passwordFocused,
				}));
				break;
			default:
				break;
		}
	};

	private handle2faFocus = () => {
		this.setState(prev => ({
			codeFocused: !prev.codeFocused,
		}));
	};

	private validateForm = () => {
		const { email, password } = this.state;
		const isEmailValid = email.match(EMAIL_REGEX);

		if (!isEmailValid) {
			this.setState({
				emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
				passwordError: '',
			});

			return;
		}
		if (!password) {
			this.setState({
				emailError: '',
				passwordError: this.props.intl.formatMessage({ id: ERROR_EMPTY_PASSWORD }),
			});

			return;
		}
	};

	private handleChangeEmailValue = (value: string) => {
		this.setState({
			email: value,
		});
	};

	private handleChangePasswordValue = (value: string) => {
		this.setState({
			password: value,
		});
	};

	private handleClose = () => {
		this.props.signInRequire2FA({ require2fa: false });
	};
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	alert: selectAlertState(state),
	isLoggedIn: selectUserLoggedIn(state),
	loading: selectUserFetching(state),
	require2FA: selectSignInRequire2FA(state),
	requireEmailVerification: selectSignUpRequireVerification(state),
	configs: selectConfigs(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	signIn: data => dispatch(signIn(data)),
	signInError: error => dispatch(signInError(error)),
	signInRequire2FA: payload => dispatch(signInRequire2FA(payload)),
	signUpRequireVerification: data => dispatch(signUpRequireVerification(data)),
});

export const LogInScreen = compose(
	injectIntl,
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
)(FormLogin) as React.ComponentClass;
