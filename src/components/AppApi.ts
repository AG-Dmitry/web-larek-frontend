import { IOrderInfo, IItem, IGetItemsResponse, IAppApi } from '../types';
import { IApi } from '../components/base/api';

export class AppApi implements IAppApi {
	private baseApi: IApi;

	constructor(baseApi: IApi) {
		this.baseApi = baseApi;
	}

	getItems(): Promise<IItem[]> {
		return this.baseApi.get<IGetItemsResponse>(`/product`)
		  .then((res: IGetItemsResponse) => res.items);
	}

	postOrderInfo(orderInfo: IOrderInfo, total: number, items: string[]): Promise<IOrderInfo> {
		orderInfo.total = total;
		orderInfo.items = items;
		return this.baseApi.post<IOrderInfo>(`/order`, orderInfo, 'POST')
		  .then((res: IOrderInfo) => res);
	}

}
