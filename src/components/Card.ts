import { Category, ICard, ICardBasket, ICardFull, IItem } from '../types';
import { CDN_URL } from '../utils/constants';
import { addCorrectAffix, formatNumber } from '../utils/utils';
import { EventEmitter } from './base/events';

export abstract class Card extends EventEmitter implements ICard {
	protected card: HTMLElement;
	protected id: string;
	protected category: HTMLElement;
	protected categotyClass: string;
	protected title: HTMLElement;
	protected text: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(item: IItem, element: HTMLElement) {
		super();

		this.card = element;
		this.id = item.id;
		this.category = this.card.querySelector('.card__category');
		this.title = this.card.querySelector('.card__title');
		this.text = this.card.querySelector('.card__text');
		this.image = this.card.querySelector('.card__image');
		this.price = this.card.querySelector('.card__price');
		this.button = this.card.querySelector('.card__button');

		this.title.textContent = item.title;
		if (typeof item.price === 'number') {
			this.price.textContent =
				formatNumber(item.price) + addCorrectAffix(item.price);
		} else this.price.textContent = 'Бесценно';
	}

	render(): HTMLElement {
		return this.card;
	}

	protected getCategoryClass(item: IItem): string {
		switch (item.category) {
			case Category.Button:
				return 'card__category_button';
			case Category.HardSkill:
				return 'card__category_hard';
			case Category.SoftSkill:
				return 'card__category_soft';
			case Category.Misc:
				return 'card__category_additional';
			default:
				return 'card__category_other';
		}
	}

	protected emitEvent(): void {}
}

export class CardMain extends Card implements ICard {
	constructor(item: IItem, element: HTMLElement) {
		super(item, element);

		this.category.textContent = item.category;
		this.categotyClass = this.getCategoryClass(item);
		this.category.classList.add(this.categotyClass);
		this.image.src = CDN_URL + item.image.slice(0, -3) + 'png';

		this.card.addEventListener('click', this.emitEvent.bind(this));
	}

	protected emitEvent(): void {
		this.emit('click', { id: this.id });
	}
}

export class CardFull extends Card implements ICardFull {
	constructor(item: IItem, element: HTMLElement) {
		super(item, element);

		this.category.textContent = item.category;
		this.categotyClass = this.getCategoryClass(item);
		this.category.classList.add(this.categotyClass);
		this.text.textContent = item.description;
		this.image.src = CDN_URL + item.image.slice(0, -3) + 'png';

		this.emitEvent = this.emitEvent.bind(this);

		if (this.button) {
			if (!item.price) {
				this.button.disabled = true;
				this.button.textContent = 'Недоступно';
			} else {
				this.button.addEventListener('click', this.emitEvent);
			}
		}
	}

	toggleButtonText(isInBasket: boolean): void {
		if (isInBasket) {
			this.button.textContent = 'Удалить из корзины';
		} else {
			this.button.textContent = 'В корзину';
		}
	}

	clearEventListner(): void {
		this.button.removeEventListener('click', this.emitEvent);
	}

	protected emitEvent(): void {
		this.emit('toggle', { id: this.id, card: this });
	}
}

export class CardBasket extends Card implements ICardBasket {
	protected counter: number;
	protected basketIndex: HTMLButtonElement;

	constructor(item: IItem, element: HTMLElement, counter: number) {
		super(item, element);

		this.counter = counter;
		this.basketIndex = this.card.querySelector('.basket__item-index');

		if (this.basketIndex)
			this.basketIndex.textContent = this.counter.toString();

		this.emitEvent = this.emitEvent.bind(this);

		this.button.addEventListener('click', this.emitEvent);
	}

	clearEventListner(): void {
		this.button.removeEventListener('click', this.emitEvent);
	}

	protected emitEvent(): void {
		this.emit('delete', { id: this.id, card: this });
	}
}
