import { alertPush, IP2pSendMessage } from 'modules';
import React, { useRef, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { MdAssistantPhoto, MdInsertPhoto } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

export const CustomInputP2pMessage = React.memo(({ sendMessage }: { sendMessage: (message: IP2pSendMessage) => void }) => {
	const { tradeId: idTrade } = useParams<{ tradeId: string }>();

	const refInput = useRef<HTMLInputElement>(null);
	const [contentInput, setContentInput] = useState('');
	const dispatch = useDispatch();

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setContentInput(e.target.value);
	};

	const onSendMessage = () => {
		if (contentInput.trim()) {
			sendMessage({
				content: contentInput.trim(),
				type: 'text',
				trade: +idTrade,
			});
			setContentInput('');

			refInput.current && refInput.current.focus();
		}
	};

	const onPingAdmin = () => {
		sendMessage({
			content: contentInput,
			type: 'ping-admin',
			trade: +idTrade,
		});
		setContentInput('');
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
	const onSendImage = async e => {
		const [file] = e.target.files;

		if (file) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				dispatch(alertPush({ message: ['You can only upload JPG/PNG/JPGE file!'], type: 'error' }));
			}
			const isLt5M = file.size / 1024 / 1024 < 5;
			if (!isLt5M) {
				dispatch(alertPush({ message: ['Image must smaller than 5MB!'], type: 'error' }));
			}
			if (isLt5M && isJpgOrPng) {
				const base64 = (await convertToBase64(file)) as string;

				sendMessage({
					content: base64,
					type: 'image',
					trade: +idTrade,
				});
			}
		}
	};

	return (
		<div className="p2p-component-box-chat__type-area">
			<input
				ref={refInput}
				type="text"
				placeholder="Write a message"
				value={contentInput}
				onChange={onChangeInput}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						onSendMessage();
					}
				}}
			/>

			<button>
				<label htmlFor="inputImg" className="mb-0">
					<MdInsertPhoto />
					<input
						type="file"
						accept="image/png, image/jpg, image/jpeg"
						id="inputImg"
						className="d-none"
						onChange={e => onSendImage(e)}
					/>
				</label>
			</button>
			<button onClick={onPingAdmin}>
				<MdAssistantPhoto />
			</button>
			<button onClick={onSendMessage}>
				<IoIosSend />
			</button>
		</div>
	);
});
