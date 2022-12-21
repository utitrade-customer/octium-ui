import { Space } from 'antd';
import { typeFCInputChange } from 'plugins/KYC/containers';
import React from 'react';
import { useIntl } from 'react-intl';
import { nationalities } from 'translations/nationalities';

interface IdentifyInformationProps {
	inputChange: typeFCInputChange;
	dateOfBirth: string;
	nationality: string;
	fullName: string;
}

const MIN_DATE = '1900-01-01';
const MAX_DATE = '2010-01-01';

export const IdentifyInformation = (props: IdentifyInformationProps) => {
	const { inputChange, fullName } = props;

	// const dateFormat = 'YYYY/MM/DD';
	const intl = useIntl();

	const renderSelectCountry = (): any => {
		const options = [
			<option disabled key={'none'} value={'none'}>
				{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.nationally.choose' })}
			</option>,
		];
		const countries =
			nationalities &&
			nationalities.map(name => {
				const nationality = intl.formatMessage({ id: name });
				return (
					<option key={nationality} value={nationality}>
						{nationality}
					</option>
				);
			});
		return options.concat(countries);
	};
	return (
		<div className="identify__information">
			<div className="identify__information__form">
				<h2 className="mb-5">{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.heading' })}</h2>
				<h4>{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.title' })}</h4>
				<div className="form-group">
					<label htmlFor="name">
						{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.nationally.heading' })}
					</label>
					<div className="form-group__selected">
						<select
							className="form-group__selected__country"
							onChange={e => {
								inputChange('nationality', intl.formatMessage({ id: nationalities[e.target.selectedIndex - 1] }));
							}}
							name="nationality"
							defaultValue="none"
						>
							{renderSelectCountry()}
						</select>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="name">{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.fullName' })}</label>
							<input
								type="text"
								className="form-control"
								name="fullname"
								onBlur={e => {
									inputChange(
										'fullname',
										e.target.value
											.trim()
											.split(' ')
											.map(item => item.trim().charAt(0).toUpperCase() + item.slice(1))
											.join(' '),
									);
								}}
								onChange={e => inputChange('fullname', e.target.value)}
								value={fullName}
								maxLength={50}
								placeholder="Enter your name"
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="name">
								{intl.formatMessage({ id: 'kyc.screen.IdentifyInformation.dateOfBirth' })}
							</label>
							<div className="dateOfBirth">
								<Space direction="vertical" size={12}>
									<input
										className="input-dob"
										onChange={event => {
											inputChange('date_of_birth', event.target.value);
										}}
										type="date"
										min={MIN_DATE}
										max={MAX_DATE}
									/>
								</Space>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
