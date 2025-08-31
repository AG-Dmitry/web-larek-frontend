import { IBasketData, IItem } from "../types";
import { CatalogData } from "./CatalogData";

export class BasketData extends CatalogData implements IBasketData{
  constructor() {
    super();
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.emit('changed');
  }

  removeItemsAll(): void {
    this.items = [];
    this.emit('changed');
  }

  getItemsIdList(): string[] {
    const idList: string[] = [];
    this.items.forEach(item => {
      idList.push(item.id);
    })
    return idList;
  }

  getItemsCount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    let totalPrice: number = 0;
    this.items.forEach(item => {
      totalPrice += item.price;
    })
    return totalPrice;
  }

}