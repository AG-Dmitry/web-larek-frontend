import { IBasketButton } from "../types";
import { EventEmitter } from "./base/events";

export class BasketButton extends EventEmitter implements IBasketButton {
  protected button: HTMLButtonElement;
  protected counter: HTMLElement; 

  constructor(element: HTMLButtonElement) {
    super();
    
    this.button = element;
    this.counter = this.button.querySelector('.header__basket-counter');

    this.button.addEventListener('click', () => this.emit('click'))
  }

  setItemsCount(itemsCount: number): void {
    this.counter.textContent = itemsCount.toString();
  }

}