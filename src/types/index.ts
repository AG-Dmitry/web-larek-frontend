import { IEvents } from '../components/base/events';

export interface IOrderInfo {
	payment: PaymentMethod | null;
	email: string;
	phone: string;
	address: string;
	total?: number;
	items?: string[];
}

export interface IItem {
	id: string;
	title: string;
	category: string;
	description: string;
	price: number | null;
	image: string;
}

export interface IOrderInfoData extends IEvents {
	getData(data: keyof TFormOrderInfo): TFormOrderInfo;
	setData(key: keyof TFormOrderInfo, value: string): void;
	validateOrder(): boolean;
	validateAll(): boolean;
}

export interface ICatalogData extends IEvents {
	addItem(item: IItem): void;
	getItem(id: string): IItem;
}

export interface IBasketData extends ICatalogData {
	removeItem(id: string): void;
	removeItemsAll(): void;
	getItemsIdList(): string[];
	getItemsCount(): number;
	getTotalPrice(): number;
}

export interface IBasketButton {
	setItemsCount(itemsCount: number): void;
}

export interface ICardsContainer {
	updateContainer(items: HTMLElement[]): void;
}

export interface ICard {
	render(): HTMLElement;
}

export interface ICardFull extends ICard {
	toggleButtonText(isInBasket: boolean): void;
	clearEventListner(): void;
}

export interface ICardBasket extends ICard {
	clearEventListner(): void;
}

export interface IModal {
	toggleModal(state: boolean): void;
	updateContainer(item: HTMLElement): void;
}

export interface IModalSuccess extends IModal {
	updatePrice(sum: number): void;
}

export interface IModalBasket {
	updateContent(items: HTMLElement[]): void;
	setAsEmpty(): void;
	setAsFilled(): void;
	updateBasketPrice(sum: number): void;
}

export interface IForm {
	displayErrorMessage(message: string): void;
	clearErrorMessage(): void;
	enableSubmitButton(): void;
	disableSubmitButton(): void;
	render(): HTMLElement;
}

export interface IOrderForm extends IForm {
	updateButtonSelection(paymentMethod: PaymentMethod): void;
}

export interface IAppApi {
	getItems(): Promise<IItem[]>;
	postOrderInfo(
		orderInfo: IOrderInfo,
		total: number,
		items: string[]
	): Promise<IOrderInfo>;
}

export interface IGetItemsResponse {
	total: number;
	items: IItem[];
}

export enum PaymentMethod {
	Online = 'online',
	UponReceipt = 'upon receipt',
}

export enum Category {
	Misc = 'дополнительное',
	Other = 'другое',
	Button = 'кнопка',
	SoftSkill = 'софт-скил',
	HardSkill = 'хард-скил',
}

export type TFormOrderInfo = Pick<
	IOrderInfo,
	'payment' | 'email' | 'phone' | 'address'
>;

export type TBasketItem = Pick<IItem, 'id' | 'title' | 'category' | 'price'>;
