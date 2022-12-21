import { useEffect } from 'react';

export function useOnClickOutside(ref: React.MutableRefObject<any>, handler: (event: MouseEvent) => void, dependencies?: any[]) {
	useEffect(() => {
		const listener = (event: MouseEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			handler(event);
		};
		document.addEventListener('mousedown', listener);

		return () => {
			// componentwillunmount
			document.removeEventListener('mousedown', listener);
		};
	}, [ref, handler, ...(dependencies || [])]);
}
