import { Button, Input, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { RiErrorWarningFill, RiUpload2Line } from 'react-icons/ri';
import { IoMdCloseCircle } from 'react-icons/io';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { alertPush } from 'modules';
import { LoadingGif } from 'components/LoadingGif';
import { CreateP2PReportPayload } from 'modules/plugins/p2p/reports';

const { Option } = Select;
const { TextArea } = Input;

interface ReportModalProps {
	isModalVisible: boolean;
	handleOk: (payload: CreateP2PReportPayload) => void;
	handleCancel: () => void;
	isLoading: boolean;
}
export const ReportModal = (props: ReportModalProps) => {
	const { isModalVisible = true, handleOk, handleCancel, isLoading } = props;
	const [reportReason, setReportReason] = useState(0);
	const [tradeID, setTradeID] = useState('');
	const [description, setDescription] = useState<string>('');
	const [isDescriptionValid, setIsDescriptionValid] = React.useState(false);

	const dispatch = useDispatch();

	const history = useHistory();

	const [files, setFiles] = useState<string[]>([]);

	const inputImageFile = React.useRef<HTMLInputElement | null>(null);

	const isValid = () => {
		if (isInP2PUserCenter) {
			return reportReason !== 0 && tradeID.length !== 0 && description.length >= 20 && files.length !== 0;
		}
		return reportReason !== 0 && description.length >= 20 && files.length !== 0;
	};

	const onAddingFileClick = () => {
		inputImageFile?.current?.click();
	};

	React.useEffect(() => {
		if (!isLoading) {
			clearFormData();
		}
	}, [isLoading]);

	const bytesToMegaBytes = (bytes: number) => {
		// 1MB = 1024^2 Bytes
		return bytes / Math.pow(1024, 2);
	};

	function isFileImage(base64: string) {
		return base64.split('/')[0].split(':')[1] === 'image';
	}

	function uploadSingleFile(e: React.ChangeEvent<HTMLInputElement>) {
		try {
			if (e.target.files) {
				let filesAmount = e.target.files.length;
				let images: string[] = [];

				for (let i = 0; i < filesAmount; i++) {
					// Get the instance of the FileReader
					const reader = new FileReader();
					reader.readAsDataURL(e.target.files[i]);
					const fileSize = e.target.files[i].size;

					// Once loaded, do something with the string
					reader.onload = event => {
						const base64 = event.target?.result as string;

						if (!isFileImage(base64)) {
							dispatch(alertPush({ message: ['Invalid or unsupported file format'], type: 'error' }));
							return;
						}

						// If file size > 10MB
						if (bytesToMegaBytes(fileSize) > 10) {
							dispatch(alertPush({ message: ['File size must be <= 10MB'], type: 'error' }));
							return;
						}

						images.push(base64);
						if (i === filesAmount - 1) {
							if (files.length > 4 || images.length > 5) {
								dispatch(alertPush({ message: ['Maximum number of files is 5'], type: 'error' }));
							} else {
								setFiles([...files].concat(images));
							}
						}
					};
				}
				e.target.value = '';
			}
		} catch (error) {
			dispatch(alertPush({ message: [(error as any).message], type: 'error' }));
		}
		/* 	let ImagesArray = Object.entries(e.target.files!).map(e => {
			console.log();
			return URL.createObjectURL(e[1]);
		}); */
	}

	function deleteFile(deletingIndex: number) {
		const newFiles = files.filter((item, index) => index !== deletingIndex);
		setFiles(newFiles);
	}

	function clearFormData() {
		setReportReason(0);
		setTradeID('');
		setDescription('');
		setFiles([]);
	}

	const isInP2PUserCenter =
		history.location.pathname.includes('/p2p/user-center') || history.location.pathname.includes('/p2p/profile');

	return (
		<Modal className="p2p-component-report-modal" title="Report" visible={isModalVisible} onCancel={handleCancel}>
			<div className="p2p-component-report-modal__notice">
				<RiErrorWarningFill
					style={{ color: 'rgb(var(--rgb-blue))', width: '1.5em', height: '1.5em', marginRight: '1em' }}
				/>
				<div>Malicious reports will cause an account freeze</div>
			</div>
			{isLoading && (
				<div className="p2p-component-report-modal__loading">
					<LoadingGif />
				</div>
			)}
			<div className="p2p-component-report-modal__content">
				<div className="mb-3 d-flex flex-column">
					<label className="p2p-component-report-modal__content__label">Report Reason</label>
					<Select
						placeholder={'Please select report reason'}
						size={'large'}
						onChange={(e: number) => {
							setReportReason(Number(e.toString()));
						}}
						value={reportReason}
					>
						<Option value={0}>Select reason</Option>
						<Option value={1}>Trading order fraud or scam</Option>
						<Option value={2}>Advertisement conditions unreasonable</Option>
						<Option value={3}>Other reasons</Option>
					</Select>
				</div>
				{/* <div className="mb-3 d-flex flex-column">
					<label className="p2p-component-report-modal__content__label">Your Email</label>
					<Input placeholder="Enter email address" size="large" />
				</div> */}
				{isInP2PUserCenter && (
					<div className="mb-3 d-flex flex-column">
						<label className="p2p-component-report-modal__content__label">Order Number</label>
						<Input
							value={tradeID}
							placeholder="Enter trade ID"
							size="large"
							onChange={e => {
								const value = e.target.value;
								if (!Number(value) && value.length > 0) {
									return;
								}

								setTradeID(value);
							}}
						/>
					</div>
				)}
				<div className="mb-3 d-flex flex-column">
					<label className="p2p-component-report-modal__content__label">Description</label>
					<TextArea
						style={{ height: '7em' }}
						maxLength={500}
						value={description}
						onChange={e => {
							let value = e.target.value;

							if (value.length < 20) {
								setIsDescriptionValid(true);
							} else {
								setIsDescriptionValid(false);
							}

							setDescription(value);
						}}
						placeholder="Please provide as much details as possible."
						size="large"
					/>
					<div className="d-flex flex-row justify-content-between">
						{isDescriptionValid ? (
							<div style={{ color: 'red' }}>Description must be at least 20 characters</div>
						) : (
							<div></div>
						)}
						<div>{description.length}/500</div>
					</div>
				</div>
				<div className="d-flex flex-column p2p-component-report-modal__content__upload-proof">
					<label className="p2p-component-report-modal__content__label">Upload proof</label>

					<p className="p2p-component-report-modal__content__upload-proof__suggestion">
						Screenshots or video/audio recordings of payment and communication data should not exceed a total of 5
						files with total size of 50 MB. Supported file formats include jpg, jpeg, png.
					</p>
					<div className="p2p-component-report-modal__content__upload-proof__images-container">
						{files.length > 0 &&
							files.map((item, index) => {
								return (
									<div
										key={index}
										className="p2p-component-report-modal__content__upload-proof__images-container__image-container"
									>
										<img
											className="p2p-component-report-modal__content__upload-proof__images-container__image-container__image"
											src={item}
											alt="image"
										/>
										<IoMdCloseCircle
											className="p2p-component-report-modal__content__upload-proof__images-container__image-container__delete-image-icon"
											onClick={() => deleteFile(index)}
										/>
									</div>
								);
							})}
						<div
							className="p2p-component-report-modal__content__upload-proof__upload-btn"
							onClick={onAddingFileClick}
						>
							<RiUpload2Line />
							<div>Upload</div>
							<input
								type="file"
								id="file-1"
								ref={inputImageFile}
								style={{ display: 'none' }}
								accept="image/*"
								multiple
								onChange={uploadSingleFile}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="p2p-component-report-modal__button-group">
				<Button
					className="p2p-component-report-modal__button-group__cancel"
					onClick={() => {
						handleCancel();
					}}
				>
					Cancel
				</Button>
				<Button
					disabled={!isValid() || isLoading}
					className={`p2p-component-report-modal__button-group__confirm p2p-component-report-modal__button-group__confirm${
						isValid() ? '' : '--disabled'
					}`}
					onClick={() => {
						handleOk({
							trade: Number(tradeID),
							reason: reportReason,
							description,
							images: files,
						});
					}}
				>
					Submit
				</Button>
			</div>
		</Modal>
	);
};
