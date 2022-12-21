import { CurrencyIcon } from 'components/CurrencyIcon';
import { CONFIG } from '../../constants';
import _toLower from 'lodash/toLower';
import _toUpper from 'lodash/toUpper';
import { selectTransactionPriceList, transactionPriceListFetch } from 'modules/plugins/transactions';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ModalHomepage = props => {
	// selectors
	const transactionPrices = useSelector(selectTransactionPriceList);

	// dispatch
	const dispatch = useDispatch();

	React.useEffect(() => {
		const currencies = CONFIG.saleCurrencies.map(currency => _toLower(currency));
		dispatch(transactionPriceListFetch({ currencies: currencies }));
	}, []);

	return (
		<React.Fragment>
			<div className="desktop-model-homepage">
				<div className="row desktop-model-homepage__content">
					<div className="col-lg-6">
						<h4 className="modal-body-title">How to join Octium Sale Whitelist ?</h4>
						<div className="modal-body-description">
							<ul>
								<li>1. Copy Octium sale wallet</li>
								<li>2. Sent Your BNB, USDT or BUSD to OCTIUM SALE WALLET</li>
								<li>3. Your amount will auto cover to USD</li>
							</ul>
						</div>
						<span className="modal-body-node">
							Note: Only use personal wallet to sent BNB, USDT or BUSD (Metamask)
						</span>
					</div>
					<div className="col-lg-6 d-flex flex-column justify-content-space-around desktop-model-homepage__content__price">
						<div className="row desktop-model-homepage__content__price-main">
							<div className="col-lg-12 d-flex align-items-center justify-content-center">
								<div>
									<span>{CONFIG.priceText}</span>
								</div>
							</div>
						</div>
						{CONFIG.saleCurrencies.map(currency => {
							return (
								<div className="row mt-3">
									<div className="col-lg-6">
										<div className="d-flex align-items-center">
											<CurrencyIcon isCircle={true} currency_id={currency} />
											<span style={{ color: '#333333', marginLeft: 8, fontSize: 16 }}>
												{_toUpper(currency)}
											</span>
										</div>
									</div>
									<div className="col-lg-6 d-flex align-items-center justify-content-center">
										<div>
											<span className="desktop-model-homepage__content__price-last">
												${' '}
												{transactionPrices.find(price => price.base_currency === currency)?.price ??
													'Updating'}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
