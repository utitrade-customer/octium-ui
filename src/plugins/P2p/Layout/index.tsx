import {
	P2pAddPaymentMobileScreen,
	P2pListMobileScreen,
	P2pMobileMyOrdersScreen,
	P2pMyTradeMobile,
	P2pOrderDetail,
	P2pPaymentMobileScreen,
	P2pPostOrderMobileScreen,
	P2pUserCenterMobile,
} from 'mobile/plugins/P2p';
import {
	getKycStatus,
	selectKycStatus,
	selectKycStatusLoading,
	selectMobileDeviceState,
	selectUserFetching,
	selectUserLoggedIn,
} from 'modules';
import { infoSupportedFetch } from 'modules/plugins/p2p/publicInfo';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, useHistory } from 'react-router';
import { PrivateRoute, PublicRoute } from 'routes/Layout';
import { PopupBannedUser } from '../components';
import { useInfoUser, useSocketP2pOrder, useSocketP2pPingHaveNewTrade } from '../hooks';
import {
	P2pAddPayment,
	P2pDetail,
	P2pListPayment,
	P2pListScreen,
	P2pMyTrade,
	P2pPostOrder,
	P2pPrivateListOrders,
} from '../screens';
import { P2pUserCenter } from '../screens/P2pUserCenter';
import './Layout.pcss';

const PrivateRouteCustom: React.FC<any> = ({ isKycVerify, isLoadingInfoKyc, user, ...rest }) => {
	const history = useHistory();

	if (!isKycVerify && !isLoadingInfoKyc && !rest.isLoading && rest.isLoggedIn) {
		console.log('isKycVerify', isKycVerify, 'isLoadingInfoKyc', isLoadingInfoKyc);
		history.push('/profile/kyc');
	}

	return (
		<>
			<PrivateRoute {...rest} />
			<PopupBannedUser user={user} />
		</>
	);
};

export const P2pLayout: React.FC = ({ children }) => {
	const isMobileDevice = useSelector(selectMobileDeviceState);
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const userLoading = useSelector(selectUserFetching);
	const infoKyc = useSelector(selectKycStatus);
	const isLoadingInfoKyc = useSelector(selectKycStatusLoading);
	const dispatch = useDispatch();
	const { isLoading: isLoadingUserP2p, infoUser } = useInfoUser();

	useSocketP2pPingHaveNewTrade();
	useSocketP2pOrder();
	useEffect(() => {
		const pgLayout = document.querySelector('.pg-layout');
		pgLayout?.classList.add('pg-p2p-layout');
		dispatch(getKycStatus());
		dispatch(infoSupportedFetch());

		return () => {
			if (pgLayout?.classList.contains('pg-p2p-layout')) {
				pgLayout?.classList.remove('pg-p2p-layout');
			}
		};
	}, []);

	const isKycVerify = infoKyc.status === 'verify';

	if (isMobileDevice) {
		return (
			<div className="pg-p2p-config-global">
				<Switch>
					<PublicRoute path="/p2p" exact component={P2pListMobileScreen} />
					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/order-detail/:tradeId"
						component={P2pOrderDetail}
					/>

					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/payment"
						component={P2pPaymentMobileScreen}
					/>

					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/add-payment/:methodId"
						component={P2pAddPaymentMobileScreen}
					/>
					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/edit-payment/:methodId"
						component={P2pAddPaymentMobileScreen}
					/>

					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/create"
						component={P2pPostOrderMobileScreen}
					/>

					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/list"
						component={P2pMobileMyOrdersScreen}
					/>

					{/* <PrivateRouteCustom user={infoUser} 
						loading={userLoading&&isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/edit-order/:id"
						component={P2pPostOrderMobileScreen}
					/> */}
					<PrivateRouteCustom
						user={infoUser}
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/my-trade"
						component={P2pMyTradeMobile}
					/>
					<PrivateRoute
						loading={userLoading && isLoadingUserP2p}
						isLogged={isLoggedIn}
						isKycVerify={isKycVerify}
						isLoadingInfoKyc={isLoadingInfoKyc}
						path="/p2p/user-center"
						component={P2pUserCenterMobile}
					/>
					<PublicRoute exact={true} path="/p2p/profile/:userId" component={P2pUserCenterMobile} />
				</Switch>
			</div>
		);
	}

	return (
		<div className="pg-p2p-config-global">
			<Switch>
				<PublicRoute exact path="/p2p" component={P2pListScreen} />

				<PrivateRouteCustom
					user={infoUser}
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/order-detail/:tradeId"
					component={P2pDetail}
				/>
				<PrivateRouteCustom
					user={infoUser}
					exact
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/create"
					component={P2pPostOrder}
				/>

				{/* <PrivateRouteCustom user={infoUser} 
					loading={userLoading&&isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/edit-order/:id"
					component={P2pPostOrder}
				/> */}
				<PrivateRouteCustom
					user={infoUser}
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/list"
					component={P2pPrivateListOrders}
				/>

				<PrivateRouteCustom
					user={infoUser}
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/payment"
					component={P2pListPayment}
				/>
				<PrivateRouteCustom
					user={infoUser}
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/add-payment/:methodId"
					component={P2pAddPayment}
				/>
				<PrivateRouteCustom
					user={infoUser}
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/edit-payment/:methodId"
					component={P2pAddPayment}
				/>

				<PrivateRouteCustom
					user={infoUser}
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/my-trade"
					component={P2pMyTrade}
				/>
				<PrivateRoute
					loading={userLoading && isLoadingUserP2p}
					isLogged={isLoggedIn}
					isKycVerify={isKycVerify}
					isLoadingInfoKyc={isLoadingInfoKyc}
					path="/p2p/user-center"
					component={P2pUserCenter}
				/>

				<PublicRoute exact={true} path="/p2p/profile/:userId" component={P2pUserCenter} />
			</Switch>
		</div>
	);
};
