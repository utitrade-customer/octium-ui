import * as React from 'react';
import { useHistory } from 'react-router-dom';

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
	to: string;
}

export const Link: React.FC<Props> = (props: Props) => {
	const history = useHistory();

	return (
		<a
			{...props}
			onClick={event => {
				event.preventDefault();
				props.onClick && props.onClick(event);
				history.push(props.to);
			}}
		>
			{props.children}
		</a>
	);
};
