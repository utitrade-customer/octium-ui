import * as React from 'react';
import { Button } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { EmailForm } from '../../components';
import { EMAIL_REGEX, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import { IntlProps } from '../../index';
import { forgotPassword, RootState, selectCurrentLanguage, selectForgotPasswordSuccess } from '../../modules';

interface ReduxProps {
	success: boolean;
}

interface DispatchProps {
	forgotPassword: typeof forgotPassword;
}

interface ForgotPasswordState {
	email: string;
	emailError: string;
	emailFocused: boolean;
	isOpenNotification: boolean;
}

type Props = RouterProps & ReduxProps & DispatchProps & IntlProps;

class ForgotPasswordComponent extends React.Component<Props, ForgotPasswordState> {
	constructor(props: Props) {
		super(props);
		this.state = {
			email: '',
			emailError: '',
			emailFocused: false,
			isOpenNotification: false,
		};
	}

	public componentDidMount() {
		setDocumentTitle(this.props.intl.formatMessage({ id: 'page.forgotPassword.documentTitle' }));
	}

	private renderCheckingEmail() {
		return (
			<div
				className="pg-emailverification-container"
				style={{
					height: '100%',
				}}
			>
				<div className="pg-emailverification">
					<div className="pg-emailverification-title">
						{' '}
						{this.props.intl.formatMessage({ id: 'notification.forgot.password.title' })}
					</div>
					<div className="pg-emailverification-body">
						<div className="pg-emailverification-body-text">
							{this.props.intl.formatMessage({ id: 'notification.forgot.password.text' })}
						</div>
						<div className="pg-emailverification-body-container">
							<Button
								block={true}
								type="button"
								size="lg"
								variant="primary"
								onClick={() => this.props.history.push('/login')}
								style={{
									width: '50%',
									borderRadius: '15px',
									backgroundColor: 'var(--blue)',
								}}
							>
								{this.props.intl.formatMessage({ id: 'notification.forgot.password.btn.login' })}
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
	public render() {
		const { email, emailFocused, emailError } = this.state;
		const forgotPasswordClassName = !this.state.isOpenNotification
			? 'pg-forgot-password___form'
			: 'pg-forgot-password___form d-flex justify-content-center';
		return (
			<div className="pg-forgot-password-screen" onKeyPress={this.handleEnterPress}>
				<div className="pg-forgot-password-screen__container">
					<div
						className={forgotPasswordClassName}
						style={{
							minHeight: '100%',
						}}
					>
						{this.state.isOpenNotification ? (
							this.renderCheckingEmail()
						) : (
							<EmailForm
								OnSubmit={this.handleChangeEmail}
								title={this.props.intl.formatMessage({ id: 'page.forgotPassword' })}
								emailLabel={this.props.intl.formatMessage({ id: 'page.forgotPassword.email' })}
								buttonLabel={this.props.intl.formatMessage({ id: 'page.forgotPassword.send' })}
								email={email}
								emailFocused={emailFocused}
								emailError={emailError}
								message={this.props.intl.formatMessage({ id: 'page.forgotPassword.message' })}
								validateForm={this.validateForm}
								handleInputEmail={this.handleInputEmail}
								handleFieldFocus={this.handleFocusEmail}
								handleReturnBack={this.handleComeBack}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}

	private handleChangeEmail = () => {
		const { email } = this.state;
		this.props.forgotPassword({
			email,
		});
		if (!this.state.emailError)
			this.setState({
				isOpenNotification: true,
			});
	};

	private handleFocusEmail = () => {
		this.setState({
			emailFocused: !this.state.emailFocused,
		});
	};

	private handleInputEmail = (value: string) => {
		this.setState({
			email: value,
		});
	};

	private validateForm = () => {
		const { email } = this.state;

		const isEmailValid = email ? email.match(EMAIL_REGEX) : true;

		if (!isEmailValid) {
			this.setState({
				emailError: ERROR_INVALID_EMAIL,
			});

			return;
		}
	};

	private handleComeBack = () => {
		this.props.history.goBack();
	};

	private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();

			this.handleChangeEmail();
		}
	};
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	success: selectForgotPasswordSuccess(state),
	i18n: selectCurrentLanguage(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	forgotPassword: credentials => dispatch(forgotPassword(credentials)),
});

export const ForgotPasswordScreen = compose(
	injectIntl,
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
)(ForgotPasswordComponent) as React.ComponentClass;
