import { IModal, IModalBasket, IModalSuccess } from '../types';
import { addCorrectAffix, formatNumber } from '../utils/utils';
import { EventEmitter } from './base/events';

export class Modal extends EventEmitter implements IModal {
	protected modal: HTMLElement;
	protected cross: HTMLElement;
	protected container: HTMLElement;

	constructor(element: HTMLElement) {
		super();

		this.modal = element;
		this.cross = this.modal.querySelector('.modal__close');
		this.container = element.querySelector('.modal__content');

		this.handleEscape = this.handleEscape.bind(this);

		this.cross.addEventListener('click', () => this.emit('close'));
		this.modal.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('modal')) {
				this.emit('close');
			}
		});
	}

	toggleModal(state: boolean = true): void {
		this.modal.classList.toggle('modal_active', state);
		if (state) document.addEventListener('keydown', this.handleEscape);
	}

	updateContainer(item: HTMLElement): void {
		this.container.replaceChildren(item);
	}

	protected handleEscape(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			this.emit('close');
			document.removeEventListener('keydown', this.handleEscape);
		}
	}
}

export class ModalBasket extends Modal implements IModalBasket {
	container: HTMLElement;
	emptyMessage: HTMLElement;
	proceedButton: HTMLButtonElement;
	basketPrice: HTMLElement;

	constructor(element: HTMLElement) {
		super(element);

		this.container = element.querySelector('.basket__list');
		this.emptyMessage = element.querySelector('.modal__empty-message');
		this.proceedButton = element.querySelector('.button');
		this.basketPrice = element.querySelector('.basket__price');

		this.proceedButton.addEventListener('click', () => this.emit('proceed'));
	}

	updateContent(items: HTMLElement[]): void {
		this.container.replaceChildren(...items);
	}

	setAsEmpty(): void {
		this.proceedButton.disabled = true;
		this.emptyMessage.classList.remove('modal__empty-message_hidden');
	}

	setAsFilled(): void {
		this.proceedButton.disabled = false;
		this.emptyMessage.classList.add('modal__empty-message_hidden');
	}

	updateBasketPrice(sum: number): void {
		this.basketPrice.textContent = formatNumber(sum) + addCorrectAffix(sum);
	}
}

export class ModalSuccess extends Modal implements IModalSuccess {
	protected priceElement: HTMLElement;
	protected confirmButton: HTMLButtonElement;

	constructor(element: HTMLElement) {
		super(element);

		this.priceElement = this.modal.querySelector('.film__description');
		this.confirmButton = this.modal.querySelector('.order-success__close');

		this.confirmButton.addEventListener('click', () => this.emit('close'));
	}

	updatePrice(sum: number): void {
		this.priceElement.textContent = `Списано ${formatNumber(
			sum
		)}${addCorrectAffix(sum)}`;
	}
}
