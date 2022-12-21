import { selectKycStatus, selectUserLoggedIn } from 'modules';
import { useSelector } from 'react-redux';

export const useCallPrivateApi = (level: 'hight' | 'low' = 'hight'): boolean => {
	const isLoggedIn = useSelector(selectUserLoggedIn);
	const infoKyc = useSelector(selectKycStatus);

	if (level === 'hight') {
		return isLoggedIn && infoKyc.status === 'verify';
	}

	return isLoggedIn;
};
