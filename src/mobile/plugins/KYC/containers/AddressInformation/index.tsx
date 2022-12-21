import { upperFirstCase } from 'helpers/upperFirstCase';
import { typeFCInputChange } from 'plugins/KYC';
import React from 'react';
import { useIntl } from 'react-intl';

interface AddressInformationProps {
	inputChange: typeFCInputChange;
	postalCode: string;
	city: string;
	residentialAddress: string;
}

export const MobileAddressInformation = (props: AddressInformationProps) => {
	const { inputChange, postalCode, city, residentialAddress } = props;
	const intl = useIntl();

	return (
		<div className="mobile-address-information">
			<div className="mobile-address-information__form">
				<h2 className="mb-5">{intl.formatMessage({ id: 'kyc.screen.AddressInformation.heading' })}</h2>
				<h4>{intl.formatMessage({ id: 'kyc.screen.AddressInformation.title' })}</h4>

				<div className="row">
					<div className="col-md-12">
						<div className="form-group">
							<label htmlFor="name">{intl.formatMessage({ id: 'kyc.screen.AddressInformation.address' })}</label>
							<input
								autoFocus
								type="text"
								className="form-control"
								name="residential_address"
								onBlur={e => inputChange('residential_address', upperFirstCase(e.target.value))}
								onChange={e => inputChange('residential_address', e.target.value)}
								value={residentialAddress}
								placeholder={'Enter your residenfinal address'}
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="name">{intl.formatMessage({ id: 'kyc.screen.AddressInformation.postalCode' })}</label>
							<input
								type="text"
								className="form-control"
								name="postal_code"
								onChange={e => inputChange('postal_code', e.target.value)}
								value={postalCode}
								placeholder={'Enter your postal code'}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group">
							<label htmlFor="name">{intl.formatMessage({ id: 'kyc.screen.AddressInformation.city' })}</label>
							<input
								type="text"
								className="form-control"
								name="city"
								onBlur={e => inputChange('city', upperFirstCase(e.target.value))}
								onChange={e => inputChange('city', e.target.value)}
								value={city}
								placeholder={'Enter your city'}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
