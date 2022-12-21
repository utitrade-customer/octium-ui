import React, { FC, useState } from 'react';
import { MyP2pDrawer } from '../MyP2pDrawer';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import classNames from 'classnames';
import _capitalize from 'lodash/capitalize';
import { Input, Checkbox, Button } from 'antd';
const { TextArea } = Input;

interface FeedbackModalBottomSheetProps {
	title: string;
	show: boolean;
	onClose: () => void;
	onConfirmation: () => void;
}

export const FeedbackModalBottomSheet: FC<FeedbackModalBottomSheetProps> = ({ title, show, onClose, onConfirmation }) => {
	const [feedbackStatus, setFeedbackStatus] = useState<'positive' | 'negative'>('positive');
	const [textAreaInput, setTextAreaValueInput] = useState<string>('');

	const renderFeedbackButton = (type: typeof feedbackStatus) => {
		const FeedBackClassName = 'p2p-mobile-component-feedback-modal-bottom-sheet__reacting-btn';

		const ButtonClassName = classNames(FeedBackClassName, {
			[`${FeedBackClassName}--active__${type}`]: feedbackStatus === type,
		});
		const feedBackIconContainerClassName = 'p2p-mobile-component-feedback-modal-bottom-sheet__reacting-btn__icon-container';

		return (
			<div className={ButtonClassName} onClick={() => setFeedbackStatus(type)}>
				<div
					className={classNames(feedBackIconContainerClassName, {
						[`${FeedBackClassName}--active`]: feedbackStatus === type,
					})}
				>
					{type === 'positive' ? (
						<AiFillLike
							className={classNames(feedBackIconContainerClassName + '__icon', {
								[`${feedBackIconContainerClassName}__icon--${type}`]: feedbackStatus === type,
							})}
						/>
					) : (
						<AiFillDislike
							className={classNames(feedBackIconContainerClassName + '__icon', {
								[`${feedBackIconContainerClassName}__icon--${type}`]: feedbackStatus === type,
							})}
						/>
					)}
				</div>
				<div>{_capitalize(type)}</div>
			</div>
		);
	};

	return (
		<MyP2pDrawer
			className="p2p-mobile-component-feedback-modal-bottom-sheet"
			onClose={() => {
				onClose();
			}}
			visible={show}
			title={title}
			height={'55vh'}
		>
			<div className="p2p-mobile-component-feedback-modal-bottom-sheet__title">How was your trading experience?</div>
			<div className="d-flex flex-row justify-content-center">
				{renderFeedbackButton('positive')}
				{renderFeedbackButton('negative')}
			</div>
			<div className="mb-2 d-flex flex-column">
				<TextArea
					style={{ height: '7em' }}
					maxLength={500}
					value={textAreaInput}
					onChange={({ target }) => setTextAreaValueInput(target.value)}
					placeholder={`Let other users know about the ${feedbackStatus} experience`}
					size="large"
				/>
				<div className="d-flex flex-row justify-content-end">{textAreaInput.length}/500</div>
			</div>
			<Checkbox className="p2p-mobile-component-feedback-modal-bottom-sheet__check-box">
				<div className="d-flex flex-column">
					<div className="mr-3">Anonymous</div>
					<div style={{ fontWeight: 400 }}>The counterparty can view comments</div>
				</div>
			</Checkbox>
			<Button className="p2p-mobile-component-feedback-modal-bottom-sheet__submit-btn">Leave comments</Button>
			<div className="p2p-mobile-component-feedback-modal-bottom-sheet__divider"></div>
		</MyP2pDrawer>
	);
};
