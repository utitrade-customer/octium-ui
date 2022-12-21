import { IP2PReport, p2PReportsFetch, selectReports, selectReportsLoading } from 'modules';
import { IPayload } from 'modules/plugins/p2p/type/interface.common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IUseGetReports {
	data: IPayload<IP2PReport[]>;
	isLoading: boolean;
}

export const useGetReports = (): IUseGetReports => {
	const data = useSelector(selectReports);
	const isLoading = useSelector(selectReportsLoading);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!isLoading) {
			dispatch(p2PReportsFetch());
		}
	}, []);

	return {
		data,
		isLoading,
	};
};
