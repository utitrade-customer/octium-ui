export interface Meta {
	page: number;
	limit: number;
	itemCount: number;
	pageCount: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
}

export interface IPayload<T> {
	data: T;
	meta: Meta;
}
