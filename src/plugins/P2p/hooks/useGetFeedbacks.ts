import { IP2PFeedback, p2PFeedbacksFetch, selectFeedbacks, selectFeedbacksLoading } from 'modules';
import { IPayload } from 'modules/plugins/p2p/type/interface.common';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IUseGetFeedbacks {
	data: IPayload<IP2PFeedback[]>;
	isLoading: boolean;
}

export const useGetFeedbacks = (): IUseGetFeedbacks => {
	const data = useSelector(selectFeedbacks);
	const isLoading = useSelector(selectFeedbacksLoading);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!isLoading) {
			dispatch(p2PFeedbacksFetch());
		}
	}, []);

	return {
		data,
		isLoading,
	};
};
