import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import classNames from 'classnames';
import { LoadingGif } from 'components/LoadingGif';
import { isNumber } from 'lodash';
import {
	IPaymentMethod,
	PaymentMethodFields,
	paymentMethodsAdd,
	paymentMethodsEdit,
	PaymentSupported,
	selectPaymentMethodsChangeLoading,
	TypeFieldPaymentP2p,
} from 'modules';
import { P2pNavBar } from 'plugins/P2p/components';
import { useP2pPublicInfos, usePaymentMethodsFetch } from 'plugins/P2p/hooks';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

export const P2pAddPayment = () => {
	const history = useHistory();
	const param = useParams<{ methodId: string }>();
	const paymentMethodConfigFetch = useP2pPublicInfos();
	const { paymentSupported } = paymentMethodConfigFetch.infoPublicOrders;
	const { isLoading } = paymentMethodConfigFetch;
	const [methodConfig, setMethodConfig] = React.useState<PaymentSupported>();
	const [method, setMethod] = React.useState<IPaymentMethod>();
	const [valueForm, setValueForm] = React.useState<Record<string, string>>({});

	const listPaymentMethods = usePaymentMethodsFetch();

	const [fakeReloadForm, setFakeReloadForm] = React.useState(false);
	const [isAddPayment, setIsAddPayment] = React.useState(true);
	const [isCanSubmit, setIsCanSubmit] = React.useState(false);

	const isChangeLoading = useSelector(selectPaymentMethodsChangeLoading);
	const dispatch = useDispatch();
	const [form] = Form.useForm();

	React.useEffect(() => {
		if (!param || !isNumber(+param.methodId)) {
			history.push('/p2p/payment');
		}

		if (history.location.pathname.includes('/add-payment')) {
			setIsAddPayment(true);
		} else {
			setIsAddPayment(false);
		}
	}, [param, history]);

	React.useEffect(() => {
		if (!isLoading && !listPaymentMethods.isLoading) {
			// check name payment method
			if (history.location.pathname.includes('/add-payment')) {
				const methodConfig = paymentSupported.find(item => item.id === +(param.methodId || -1));
				if (!methodConfig) {
					history.push('/p2p/payment');
				} else {
					setMethodConfig(methodConfig);
				}
			} else {
				const paymentMethod = listPaymentMethods.listPaymentMethods.find(item => item.id === +(param.methodId || -1));
				const methodConfig = paymentSupported.find(item => item.id === paymentMethod?.paymentConfig);

				if (paymentMethod && methodConfig) {
					setMethod(paymentMethod);
					setMethodConfig(methodConfig);
				} else {
					history.push('/p2p/payment');
				}

				setIsCanSubmit(true);
			}
		}
	}, [isLoading, listPaymentMethods.isLoading]);

	React.useEffect(() => {
		if (!history.location.pathname.includes('/add-payment')) {
			if (methodConfig && method) {
				if (methodConfig.fields) {
					const valueFormTmp: Record<string, string> = {};

					methodConfig.fields.forEach(item => {
						const valueTmp = method.fields.find(e => e.name === item.name)?.value || '';
						form.setFieldsValue({
							[item.name]: valueTmp,
						});

						valueFormTmp[item.name] = valueTmp;
					});
					setFakeReloadForm(!fakeReloadForm);
					setValueForm(valueFormTmp);
				}
			}
		} else {
			if (methodConfig) {
				if (methodConfig.fields) {
					const valueFormTmp: Record<string, string> = {};

					methodConfig.fields.forEach(item => {
						valueFormTmp[item.name] = '';
					});

					setValueForm(valueFormTmp);
				}
			}
		}
	}, [method, methodConfig]);

	// handle for form
	const onFinish = (values: IPaymentMethod) => {
		if (methodConfig) {
			const fields: PaymentMethodFields[] = [];

			methodConfig.fields.map(item => {
				const { name, type } = item;

				if (type === 'number') {
					fields.push({
						name: name,
						value: values[name],
					});
				} else {
					values[name] &&
						fields.push({
							name: name,
							value: (values[name] + '').trim(),
						});
				}
			});

			if (isAddPayment) {
				dispatch(
					paymentMethodsAdd(
						{
							paymentConfig: methodConfig.id,
							fields,
						},
						() => history.push('/p2p/payment'),
					),
				);
			} else {
				method && dispatch(paymentMethodsEdit({ id: method.id, fields: fields }, () => history.push('/p2p/payment')));
			}
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.error('Failed:', errorInfo);
	};

	const convertToBase64 = file => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result);
			};
			fileReader.onerror = error => {
				reject(error);
			};
		});
	};

	// handler img
	const onImageChange = async (e, name: string) => {
		const [file] = e.target.files;

		if (file) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				form.setFields([
					{
						name: name,
						errors: ['You can only upload JPG/PNG file!'],
					},
				]);
			}
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				form.setFields([
					{
						name: name,
						errors: ['Image must smaller than 2MB!'],
					},
				]);
			}

			if (isLt2M && isJpgOrPng) {
				const base64 = (await convertToBase64(file)) as string;

				form.setFieldsValue({
					[name]: base64,
				});

				setFakeReloadForm(!fakeReloadForm);
			}
		}
	};

	const checkIsCanSubmit = e => {
		if (methodConfig) {
			for (let index = 0; index < methodConfig.fields.length; index++) {
				const { required } = methodConfig.fields[index];

				if (required) {
					const value = form.getFieldValue(methodConfig.fields[index].name);

					if (!value) {
						setIsCanSubmit(false);
						return;
					}
				}
			}
			setIsCanSubmit(true);
		}
	};

	const handlerChangeValue = (value: string, nameField: string, type: TypeFieldPaymentP2p) => {
		if (type === 'text' || type === 'image' || type === 'mail') {
			setValueForm({ ...valueForm, [nameField]: value });
		} else {
			const oldValue = valueForm[nameField];
			const regex = /^[0-9]*$/;

			if (regex.test(value)) {
				setValueForm({ ...valueForm, [nameField]: value });
				form.setFieldsValue({
					[nameField]: value,
				});
			} else {
				form.setFieldsValue({
					[nameField]: oldValue,
				});
			}
		}

		setFakeReloadForm(!fakeReloadForm);
	};

	const classNameBtnDone = classNames('p2p-screen-add-payment__box__group-btn__box__btn pg-p2p-config-global__btn', {
		'pg-p2p-config-global__btn--disable': !isCanSubmit,
		'pg-p2p-config-global__btn--active': isCanSubmit,
	});

	// RAFC

	const uploadButton = (
		<div className="p2p-screen-add-payment__box__field__upload-img">
			<PlusOutlined />
			<div>Upload</div>
		</div>
	);

	const Loading = () => {
		return (
			<div className="loading">
				<LoadingGif />
			</div>
		);
	};

	const getNameField = (label: string, required: boolean): string => {
		return `${label} ${required ? '(required)' : 'optional'}`;
	};

	return (
		<div className="p2p-screen-add-payment">
			<P2pNavBar />

			<div className="container  ">
				<div className="pg-p2p-layout__title">Payment Add</div>

				<Form
					name="basic"
					initialValues={{ remember: true }}
					autoComplete="off"
					className="w-100"
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					form={form}
					onChange={checkIsCanSubmit}
				>
					{isChangeLoading && <Loading />}

					{methodConfig && (
						<>
							<div className="p2p-screen-add-payment__box">
								<div className="p2p-screen-add-payment__box__name-method">{methodConfig.name}</div>

								{methodConfig.fields.map((item, key) => {
									const { label, required, type, name } = item;

									switch (type) {
										case 'text':
										case 'number':
											return (
												<div className="p2p-screen-add-payment__box__field" key={key}>
													<Form.Item
														label={getNameField(label, required)}
														name={name}
														rules={[
															{
																required: required,
																message: `Please input your ${label}!`,
															},
														]}
													>
														<Input
															value={valueForm[name]}
															onChange={e => {
																handlerChangeValue(e.target.value, name, type);
															}}
														/>
													</Form.Item>
												</div>
											);
										case 'mail':
											return (
												<div className="p2p-screen-add-payment__box__field" key={key}>
													<Form.Item
														label={getNameField(label, required)}
														name={name}
														rules={[
															{
																required: required,
																message: `Please input your ${label}!`,
															},
															{ type: 'email' },
														]}
													>
														<Input
															value={valueForm[name]}
															onChange={e => {
																handlerChangeValue(e.target.value, name, type);
															}}
														/>
													</Form.Item>
												</div>
											);

										case 'image':
											return (
												<div className="p2p-screen-add-payment__box__field" key={key}>
													<Form.Item label={getNameField(label, required)} name={name}>
														<Button type="dashed" className="btn-up-img">
															<label htmlFor={'inputImg' + name}>
																{form.getFieldValue(name) ? (
																	<img
																		src={form.getFieldValue(name)}
																		alt="avatar"
																		className="w-100"
																	/>
																) : (
																	uploadButton
																)}
																<input
																	type="file"
																	id={'inputImg' + name}
																	className="d-none"
																	onChange={e => onImageChange(e, name)}
																/>
															</label>
														</Button>
													</Form.Item>
												</div>
											);

										default:
											return <></>;
									}
								})}

								<div className="p2p-screen-add-payment__box__tips">
									<div className="p2p-screen-add-payment__box__tips__title">Tips</div>
									<div className="p2p-screen-add-payment__box__tips__desc">
										When you sell your cryptocurrency, the added payment method will be shown to the buyer
										during the transaction. To accept cash transfer, please make sure the information is
										correct.
									</div>
								</div>

								<div className="p2p-screen-add-payment__box__group-btn">
									<div className="p2p-screen-add-payment__box__group-btn__box">
										<button
											type="button"
											className="p2p-screen-add-payment__box__group-btn__box__btn pg-p2p-config-global__btn pg-p2p-config-global__btn--cancel"
											onClick={() => history.goBack()}
										>
											Cancel
										</button>
										<button type="submit" className={classNameBtnDone}>
											{isAddPayment ? 'Confirm' : 'Update'}
										</button>
									</div>
								</div>
							</div>
						</>
					)}
				</Form>
			</div>
		</div>
	);
};
