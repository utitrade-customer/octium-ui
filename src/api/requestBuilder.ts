import { RequestOptions } from 'api';
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
	airdropUrl,
	applogicUrl,
	authUrl,
	finexUrl,
	ieoAPIUrl,
	referralUrl,
	stakeUrl,
	sunshineUrl,
	tradeUrl,
	walletUrl,
	withCredentials,
	competitionUrl,
	transactionUrl,
	statisticUrl,
	paypalUrl,
	newKycUrl,
	bannerUrl,
	announcementUrl,
	withdrawLimitUrl,
	bankUrl,
	p2pUrl,
	pictureUrl,
} from './config';

export type HTTPMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';

export interface JsonBody {
	// tslint:disable-next-line no-any
	[key: string]: any;
}
export interface Request {
	method: HTTPMethod;
	url: string;
	body?: JsonBody;
}

export interface ApiVariety {
	barong: string;
	applogic: string;
	sunshine: string;
	peatio: string;
	airdrop: string;
}

const getAPI = () => ({
	barong: authUrl(),
	applogic: applogicUrl(),
	peatio: tradeUrl(),
	finex: finexUrl(),
	ieo: ieoAPIUrl(),
	sunshine: sunshineUrl(),
	airdrop: airdropUrl(),
	stake: stakeUrl(),
	wallet: walletUrl(),
	referral: referralUrl(),
	competition: competitionUrl(),
	transaction: transactionUrl(),
	statistic: statisticUrl(),
	paypal: paypalUrl(),
	bank: bankUrl(),
	newKyc: newKycUrl(),
	banner: bannerUrl(),
	announcement: announcementUrl(),
	withdrawLimit: withdrawLimitUrl(),
	p2p: p2pUrl(),
	picture: pictureUrl(),
});

const buildRequest = (request: Request, configData: RequestOptions) => {
	const { body, method, url } = request;
	const { apiVersion, headers } = configData;
	const api = getAPI();

	const contentType = body instanceof FormData ? 'multipart/form-data' : 'application/json';

	const defaultHeaders = {
		'content-type': contentType,
	};

	const apiUrl = api[apiVersion];

	const requestConfig: AxiosRequestConfig = {
		baseURL: apiUrl,
		data: body,
		headers: { ...headers, ...defaultHeaders },
		method,
		url,
		withCredentials: withCredentials(),
	};

	return requestConfig;
};

export const defaultResponse: Partial<AxiosError['response']> = {
	status: 500,
	data: {
		error: 'Server error',
	},
};

export const formatError = (responseError: AxiosError) => {
	const response = responseError.response || defaultResponse;
	const errors = (response.data && (response.data.errors || [response.data.error])) || [];

	return {
		code: response.status,
		message: errors,
	};
};

export const makeRequest = async (request: Request, configData: RequestOptions) => {
	const requestConfig = buildRequest(request, configData);

	return new Promise((resolve, reject) => {
		const axiosRequest: AxiosPromise = axios(requestConfig);
		axiosRequest
			.then((response: AxiosResponse) => {
				if (configData.withHeaders) {
					resolve(response);
				} else {
					resolve(response.data);
				}
			})
			.catch((error: AxiosError) => {
				reject(formatError(error));
			});
	});
};
