import { ICardsContainer } from '../types';

export class CardsContainer implements ICardsContainer {
	protected container: HTMLElement;

	constructor(element: HTMLElement) {
		this.container = element;
	}

	updateContainer(items: HTMLElement[]): void {
		this.container.replaceChildren(...items);
	}
}
