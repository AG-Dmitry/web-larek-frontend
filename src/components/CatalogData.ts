import { IItem, ICatalogData } from '../types';
import { EventEmitter } from '../components/base/events';

export class CatalogData extends EventEmitter implements ICatalogData {
	protected items: IItem[];

	constructor() {
		super();

		this.items = [];
	}

	addItem(item: IItem): void {
		this.items.push(item);
		this.emit('changed');
	}

	getItem(id: string): IItem {
		return this.items.find((item) => item.id === id);
	}

	getItemsAll(): IItem[] {
		return this.items;
	}
}
