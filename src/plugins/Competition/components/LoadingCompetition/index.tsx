import { LoadingGif } from 'components/LoadingGif';
import React from 'react';

interface LoadingCompetitionProps {
	className?: string;
}
export const LoadingCompetition = (props: LoadingCompetitionProps) => {
	return (
		<div className={`loading-competition ${props.className} d-flex justify-content-center`}>
			<LoadingGif />
		</div>
	);
};
