export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const pageElements = {
  basketButton: document.querySelector('.header__basket') as HTMLButtonElement,
  cardsContainer: document.querySelector('.gallery') as HTMLElement,
  modalCard: document.querySelector('#modal-card') as HTMLElement,
  modalBasket: document.querySelector('#modal-basket') as HTMLElement,
  modalWithForm: document.querySelector('#modal-with-form') as HTMLElement,
  modalSuccess: document.querySelector('#modal-success') as HTMLElement,
}

export const templates = {
  cardMainTemplate: document.querySelector('#card-catalog') as HTMLTemplateElement,
  cardFullTemplate: document.querySelector('#card-preview') as HTMLTemplateElement,
  cardBasketTemplate: document.querySelector('#card-basket') as HTMLTemplateElement,
  formOrderTemplate: document.querySelector('#order') as HTMLTemplateElement,
  formContactsTemplate: document.querySelector('#contacts') as HTMLTemplateElement,
}

export const errorMesages = {
  payment: 'Необходимо выбрать способ оплаты',
  address: 'Необходимо указать адрес',
  email: 'Необходимо указать адрес электронной почты',
  phone: 'Необходимо указать телефон',
}