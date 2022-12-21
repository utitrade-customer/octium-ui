import { Form, Input } from 'antd';
import { LoadingGif } from 'components/LoadingGif';
import {
	IInfoSupported,
	p2pPrivateOrdersAdd,
	p2pPrivateOrdersUpdate,
	selectPaymentMethods,
	selectPrivateOrdersCRUDLoading,
} from 'modules';
import React, { Dispatch, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import classnames from 'classnames';
import { PostOrderState } from 'plugins/P2p';
import { OrderPostConfirmationModalBottomSheet } from '../../components';
import { checkNumberP2p, formatNumberP2p } from 'plugins/P2p/helper';
import { isNumber } from 'lodash';
import { AiOutlineCheckSquare } from 'react-icons/ai';

interface P2pPostOrderStep3Props {
	step: number;
	setStep: Dispatch<React.SetStateAction<number>>;
	postOrderState: PostOrderState;
	setPostOrderState: Dispatch<React.SetStateAction<PostOrderState>>;
	isPost: boolean;
	idPost?: string;
	infoSupport: IInfoSupported;
	isShow?: boolean;
}

export const P2pPostOrderStep3: FC<P2pPostOrderStep3Props> = ({
	step,
	setStep,
	postOrderState,
	setPostOrderState,
	isPost,
	idPost,
	infoSupport,
	isShow,
}) => {
	const [form] = Form.useForm();

	const { minHoldBtc, autoReplyContent, remarks, requireRegistered } = postOrderState;
	const [holdingBtc, setHoldingBtc] = useState<string>();
	const [registered, setRegistered] = useState<string>();
	const [isNext, setIsNext] = useState<boolean>(false);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const { paymentSupported } = infoSupport;

	const dispatch = useDispatch();
	const isLoadingAddOrder = useSelector(selectPrivateOrdersCRUDLoading);
	const listPayments = useSelector(selectPaymentMethods);
	const history = useHistory();

	useEffect(() => {
		form.setFieldsValue({
			autoReply: autoReplyContent || '',
			remarks: remarks || '',
		});
		setHoldingBtc(checkNumberP2p(minHoldBtc || '0').render);
		setRegistered(checkNumberP2p(requireRegistered || '0').render);
	}, []);

	useEffect(() => {
		if ((requireRegistered ?? 0) >= 0 && (minHoldBtc ?? 0) >= 0) {
			setIsNext(true);
		} else {
			setIsNext(false);
		}
	}, [requireRegistered, minHoldBtc]);

	const callbackWhenAddOrEditDone = (to: string) => {
		history.push(to);
	};

	const onConfirm = () => {
		setShowPopup(true);
	};

	// handle for form
	const onFinish = () => {
		if (isPost) {
			dispatch(
				p2pPrivateOrdersAdd(
					{
						currency: postOrderState.currency as string,
						minHoldBtc: postOrderState.minHoldBtc as number,
						autoReplyContent: postOrderState.autoReplyContent,
						remarks: postOrderState.remarks,
						requireRegistered: postOrderState.requireRegistered,
						fiat: postOrderState.fiat as string,
						price: postOrderState.price as number,
						type: postOrderState.type as 'buy' | 'sell',
						orderMax: postOrderState.orderMax as number,
						orderMin: postOrderState.orderMin as number,
						payments: postOrderState.payments as number[],
						minutesTimeLimit: postOrderState.minutesTimeLimit as number,
						volume: postOrderState.volume as number,
						otp: '123456',
					},
					callbackWhenAddOrEditDone,
				),
			);
		} else {
			if (idPost) {
				dispatch(
					p2pPrivateOrdersUpdate(
						{
							id: +idPost,
							valueUpdate: {
								minHoldBtc: postOrderState.minHoldBtc as number,
								autoReplyContent: postOrderState.autoReplyContent,
								remarks: postOrderState.remarks,
								requireRegistered: postOrderState.requireRegistered,
								price: postOrderState.price as number,
								orderMax: postOrderState.orderMax as number,
								orderMin: postOrderState.orderMin as number,
								payments: postOrderState.payments as number[],
								minutesTimeLimit: postOrderState.minutesTimeLimit as number,
								otp: '123456',
							},
						},
						callbackWhenAddOrEditDone,
					),
				);
			}
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.error('Failed:', errorInfo);
	};

	const parserValue = (valueInput: string, oldValue: number): { render: string; value: number } => {
		const { value, render, valid } = checkNumberP2p(valueInput);

		if (valid) {
			return {
				render,
				value,
			};
		}

		return {
			render: formatNumberP2p(oldValue),
			value: 0,
		};
	};

	const onChangeHoldingBtc = e => {
		if (isNumber(postOrderState.minHoldBtc)) {
			const value = parserValue(e.target.value, postOrderState.minHoldBtc);
			setHoldingBtc(value.render);
			setPostOrderState(pre => ({
				...pre,
				minHoldBtc: value.value,
			}));
		}
	};

	const onChangeRegistered = e => {
		if (isNumber(postOrderState.requireRegistered)) {
			const value = parserValue(e.target.value, postOrderState.requireRegistered);
			setRegistered(value.render);
			setPostOrderState(pre => ({
				...pre,
				requireRegistered: value.value,
			}));
		}
	};

	const onChangeRemarks = e => {
		setPostOrderState({
			...postOrderState,
			remarks: e.target.value,
		});
	};
	const onChangeAutoReply = e => {
		setPostOrderState({
			...postOrderState,
			autoReplyContent: e.target.value,
		});
	};

	const classNameBtnNext = classnames('p2p-post-order-mobile-screen__step-2__navigate__button pg-p2p-config-global__btn', {
		'pg-p2p-config-global__btn--disable': !isNext,
		'pg-p2p-config-global__btn--active': isNext,
	});

	const onSubmitForm = () => {
		onConfirm();
	};

	if (!isShow) {
		return null;
	}

	return (
		<>
			{isLoadingAddOrder && (
				<div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
					<LoadingGif />
				</div>
			)}

			<Form
				initialValues={{ remember: true }}
				autoComplete="off"
				className="w-100"
				onFinish={onSubmitForm}
				onFinishFailed={onFinishFailed}
				form={form}
			>
				<div className="p2p-post-order-mobile-screen-step-wrapper p2p-post-order-mobile-screen__step-3">
					<div className="p2p-post-order-mobile-screen__step-3__remarks">
						<div className="p2p-post-order-mobile-screen__step-3__remarks__label">Remarks (Optional)</div>
						<div className="p2p-post-order-mobile-screen__step-3__remarks__textarea">
							<Form.Item name="remarks">
								<Input.TextArea rows={4} onChange={onChangeRemarks} />
							</Form.Item>
						</div>
					</div>
					<div className="p2p-post-order-mobile-screen__step-3__auto-reply">
						<div className="p2p-post-order-mobile-screen__step-3__auto-reply__label">Auto Reply (Optional)</div>
						<div className="p2p-post-order-mobile-screen__step-3__auto-reply__textarea">
							<Form.Item name="autoReply">
								<Input.TextArea rows={4} onChange={onChangeAutoReply} />
							</Form.Item>
						</div>
					</div>
					<div className="p2p-post-order-mobile-screen__step-3__conditions">
						<div className="p2p-post-order-mobile-screen__step-3__conditions__label">Counterparty Conditions</div>
						<div className="p2p-post-order-mobile-screen__step-3__conditions__complete-kyc">
							<AiOutlineCheckSquare />
							Completed KYC
						</div>
						<div className="p2p-post-order-mobile-screen__step-3__conditions__cb">
							<div className="p2p-post-order-mobile-screen__step-3__conditions__cb__inner">
								Registered <input type="text" value={registered || 0} onChange={onChangeRegistered} /> day(s) ago
							</div>
						</div>
						<div className="p2p-post-order-mobile-screen__step-3__conditions__cb">
							<div className="p2p-post-order-mobile-screen__step-3__conditions__cb__inner">
								Holdings more than <input type="text" value={holdingBtc || 0} onChange={onChangeHoldingBtc} /> BTC
							</div>
						</div>
						{/* 	<div className="p2p-post-order-mobile-screen__step-3__conditions__status">
							<div className="p2p-post-order-mobile-screen__step-3__conditions__status__label">Status</div>
							<Radio.Group>
								<Radio value={'online'}>Online right now</Radio>
								<Radio value={'offline'}>Offline, manually later</Radio>
							</Radio.Group>
						</div> */}
					</div>
				</div>
				<div className="p2p-post-order-mobile-screen__step-2__navigate">
					<button
						className="p2p-post-order-mobile-screen__step-2__navigate__button pg-p2p-config-global__btn pg-p2p-config-global__btn--trans"
						onClick={() => setStep(step - 1)}
					>
						Previous
					</button>
					<button className={classNameBtnNext} type="submit">
						{isPost ? 'Post' : 'Save'}
					</button>
				</div>
			</Form>

			<OrderPostConfirmationModalBottomSheet
				title="Confirm to Post"
				show={showPopup}
				onConfirmation={() => {
					onFinish();
					setShowPopup(false);
				}}
				onClose={() => setShowPopup(false)}
				postOrder={postOrderState}
				paymentMethods={paymentSupported}
				listPayments={listPayments.data}
			/>
		</>
	);
};
