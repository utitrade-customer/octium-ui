import { LoadingMobile } from 'mobile/components';
import { fetchIEODetail, selectIEODetail } from 'modules';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

export const InformationIEO = () => {
	const intl = useIntl();
	const toUpperCaseFirstChar = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};
	const { ieo_id: ieoID } = useParams<{ ieo_id: string }>();
	const ieoDetail = useSelector(selectIEODetail);
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(
			fetchIEODetail({
				ieo_id: Number(ieoID),
			}),
		);
	}, []);

	const {
		name,
		date,
		price,
		homepage,
		bonus,
		bonus_lockup,
		softcap,
		hardcap,
		usage,
		whitepaper,
		tech,
		bottom_banner,
		sns,
	} = ieoDetail.payload || {
		name: '',
		date: '',
		price: '',
		homepage: '',
		bonus: '',
		bonus_lockup: '',
		softcap: '',
		hardcap: '',
		usage: '',
		whitepaper: '',
		tech: '',
		sns: [],
	};
	const information = {
		name,
		date,
		price,
		homepage,
		bonus,
		bonus_lockup,
		softcap,
		hardcap,
		usage,
		whitepaper,
		tech,
		sns,
	};
	const renderValueOfKey = (key: string) => {
		if (key === 'sns') {
			const elementSocials = sns.map((social, index) => {
				const key = Object.keys(social); // {telegram:"link"} -> [telegram]
				const link = social[key[0]];
				return (
					<a key={index} className="text-dark" href={`${link}`} style={{ paddingRight: '0.5rem' }}>
						{key}
					</a>
				);
			});
			return <div className="d-flex">{elementSocials}</div>;
		}
		return (
			<React.Fragment>
				<p>{information[key]}</p>
			</React.Fragment>
		);
	};

	const loadingSpinner = () => {
		return (
			<div className="loading d-flex justify-content-center w-100">
				<LoadingMobile />
			</div>
		);
	};
	const showInformationComponent = () => {
		let content: Array<JSX.Element> = [];
		for (let key in information) {
			const jsx = (
				<div key={key} className="col-md-6 col-sm-12 d-flex detail" style={{ padding: '0px' }}>
					<div className="content-key col-4">
						<p>{toUpperCaseFirstChar(key)}</p>
					</div>
					<div className="content-value col-8">{renderValueOfKey(key)}</div>
				</div>
			);
			content.push(jsx);
		}
		return content;
	};
	return (
		<React.Fragment>
			<div id="information-ieo-mobile">
				<div className="information-ieo-title">
					<h3>{intl.formatMessage({ id: 'page.ieo.detail.infoIeo.title' })}</h3>
				</div>
				<div className="col-11 content row" style={{ padding: '0px' }}>
					{ieoDetail.loading ? loadingSpinner() : showInformationComponent()}
				</div>
			</div>

			<div className="information-ieo-image mt-4 d-flex justify-content-center">
				{bottom_banner ? <img src={bottom_banner} alt="img-description"></img> : null}
			</div>
		</React.Fragment>
	);
};
