import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { OrderInfoData } from './components/OrderInfoData';
import { CatalogData } from './components/CatalogData';
import { BasketData } from './components/BasketData';
import { IApi, Api } from './components/base/api';
import { API_URL, settings, pageElements, templates, errorMesages } from './utils/constants';
import { BasketButton } from './components/BasketButton';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardsContainer } from './components/CardsContainer';
import { IItem, TFormOrderInfo } from './types';
import { CardBasket, CardFull, CardMain } from './components/Card';
import { Modal, ModalBasket, ModalSuccess } from './components/Modal';
import { OrderForm, ContactsForm } from './components/Form';

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

const orderInfoData = new OrderInfoData();
const catalogData = new CatalogData();
const basketData = new BasketData();

const basketButton = new BasketButton(ensureElement(pageElements.basketButton));
const cardsContainer = new CardsContainer(ensureElement(pageElements.cardsContainer));

const modal = {
	modalCard: new Modal(ensureElement(pageElements.modalCard)),
	modalBasket: new ModalBasket(ensureElement(pageElements.modalBasket)),
	modalWithForm: new Modal(ensureElement(pageElements.modalWithForm)),
	modalSuccess: new ModalSuccess(ensureElement(pageElements.modalSuccess)),
}

const form = {
	orderForm: new OrderForm(cloneTemplate(templates.formOrderTemplate), orderInfoData.getData()),
	contactsForm: new ContactsForm(cloneTemplate(templates.formContactsTemplate), orderInfoData.getData()),
}

let currentFullCard: CardFull;

function checkBasketItem(id: string): boolean {
	const itemsInBasket: string[] = basketData.getItemsIdList();
	if (itemsInBasket.includes(id)) return true;
}

function renderBasketModal(): void {
  const basketItems: IItem[] = basketData.getItemsAll();
	const cards: HTMLElement[] = [];
	basketItems.forEach((item, i) => {
		const newItem = new CardBasket(item, cloneTemplate(templates.cardBasketTemplate), i + 1);
		newItem.on('delete', handleBasketDelete);
		cards.push(newItem.render());
	})
	modal.modalBasket.updateContent(cards);
	if (cards.length) {
		modal.modalBasket.setAsFilled();
	} else modal.modalBasket.setAsEmpty();
	modal.modalBasket.updateBasketPrice(basketData.getTotalPrice());
}

function handleBasketDataChange(): void {
	basketButton.setItemsCount(basketData.getItemsCount());
}

function handleBasketIconClick(): void {
	renderBasketModal();
	modal.modalBasket.display();
}

function handleCardClick(e: {id: string}): void {
	const item = catalogData.getItem(e.id);
	const card = new CardFull(item, cloneTemplate(templates.cardFullTemplate));
	if (item.price) card.toggleButtonText(checkBasketItem(e.id));
	card.on('toggle', handleBasketToggle);
	modal.modalCard.updateContainer(card.render());
	modal.modalCard.display();
	currentFullCard = card;
}

function handleBasketToggle(e: {id: string, card: CardFull}): void {
	e.card.toggleButtonText(!checkBasketItem(e.id));
	if (checkBasketItem(e.id)) {
    basketData.removeItem(e.id);
	} else {
		basketData.addItem(catalogData.getItem(e.id));
	}
}

function handleBasketDelete(e: {id: string, card: CardBasket}): void {
	e.card.off('delete', handleBasketDelete);
	e.card.clearEventListner();
  basketData.removeItem(e.id);
	renderBasketModal();
}

function handleBasketProceed(): void {
	if (basketData.getItemsCount()) {
		closeModals();
		form.orderForm.clearErrorMessage();
		modal.modalWithForm.updateContainer(form.orderForm.render());
		modal.modalWithForm.display();
	}
}

function handleOrderFormSubmit(): void {
	if (orderInfoData.validateOrder()) {
		form.contactsForm.clearErrorMessage();
		modal.modalWithForm.updateContainer(form.contactsForm.render());
	}
}

function handleContactsFormSubmit(): void {
	if (orderInfoData.validateAll()) {
		api.postOrderInfo(orderInfoData.getData(), basketData.getTotalPrice(), basketData.getItemsIdList())
		  .then(res => {
				closeModals();
				modal.modalSuccess.updatePrice(res.total);
				modal.modalSuccess.display();
				basketData.removeItemsAll();
			})
			.catch((err) => {
		    console.error(err);
	    })
			.finally(() => handleOrderInfoDataChange());
		form.contactsForm.disableSubmitButton();
	}
}

function handleFormInput(e: {key: keyof TFormOrderInfo, value: string}): void {
	orderInfoData.setData(e.key, e.value);
}

function handleOrderInfoDataChange(): void {
	const data = orderInfoData.getData();
	Object.values(form).forEach(el => {
		el.disableSubmitButton();

		if (el instanceof OrderForm) {
			el.updateButtonSelection(data.payment);
			if (!data.payment) {
        el.displayErrorMessage(errorMesages.payment);
		  } else if (!data.address.length) {
        el.displayErrorMessage(errorMesages.address);
		  } else {
				el.clearErrorMessage();
				el.enableSubmitButton();
			}
		}

		if (el instanceof ContactsForm) {
      if (!data.email.length) {
        el.displayErrorMessage(errorMesages.email);
		  } else if (!data.phone.length) {
        el.displayErrorMessage(errorMesages.phone);
		  } else {
				el.clearErrorMessage();
				el.enableSubmitButton();
			}
		}
	})
}

function closeModals(): void {
	currentFullCard.off('toggle', handleBasketToggle);
	currentFullCard.clearEventListner();
	Object.values(modal).forEach(el => el.hide());
}

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		e.preventDefault();
		closeModals();
	}
})

orderInfoData.on('changed', handleOrderInfoDataChange);
basketData.on('changed', handleBasketDataChange);
basketButton.on('click', handleBasketIconClick);
modal.modalCard.on('close', closeModals);
modal.modalBasket.on('close', closeModals);
modal.modalWithForm.on('close', closeModals);
modal.modalSuccess.on('close', closeModals);
modal.modalBasket.on('proceed', handleBasketProceed);
form.orderForm.on('input', handleFormInput);
form.orderForm.on('submit', handleOrderFormSubmit);
form.contactsForm.on('input', handleFormInput);
form.contactsForm.on('submit', handleContactsFormSubmit);

api.getItems()
  .then((items) => {
    items.forEach(item => {
      catalogData.addItem(item)
    })
	})
	.then(() => {
		const itemsData: IItem[] = catalogData.getItemsAll();
		const cards: HTMLElement[] = [];
		itemsData.forEach(item => {
			const newItem = new CardMain(item, cloneTemplate(templates.cardMainTemplate));
			newItem.on('click', handleCardClick);
		  cards.push(newItem.render());
		})
		cardsContainer.updateContainer(cards);
	})
	.catch((err) => {
		console.error(err);
	})