export const upperFirstCase = (str: string): string => {
	return str
		.trim()
		.split(' ')
		.map(item => item.trim().charAt(0).toUpperCase() + item.slice(1))
		.join(' ');
};
