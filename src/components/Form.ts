import { PaymentMethod, IOrderInfo, TFormOrderInfo, IForm, IOrderForm } from "../types";
import { EventEmitter } from "./base/events";

export abstract class Form extends EventEmitter implements IForm {
  protected form: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected errorMessage: HTMLElement;

  constructor(element: HTMLElement) {
    super();

    this.form = element;
    this.submitButton = this.form.querySelector('.button__submit');
    this.errorMessage = this.form.querySelector('.form__errors');

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.emit('submit');
    })
  }

  displayErrorMessage(message: string): void {
    this.errorMessage.textContent = message;
  }

  clearErrorMessage(): void {
    this.errorMessage.textContent = '';
  }

  enableSubmitButton(): void {
    this.submitButton.disabled = false;
  }

  disableSubmitButton(): void {
    this.submitButton.disabled = true;
  }

  render(): HTMLElement {
    return this.form;
  }

  protected emitInputEvent(key: keyof TFormOrderInfo, value: string): void {
    this.emit('input', {key: key, value: value});
  }

}

export class OrderForm extends Form implements IOrderForm {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected address: HTMLFormElement;

  constructor(element: HTMLElement, orderInfo: IOrderInfo) {
    super(element);

    this.buttonCard = this.form.querySelector('#card');
    this.buttonCash = this.form.querySelector('#cash');
    this.address = this.form.querySelector('#address');

    this.updateButtonSelection(orderInfo.payment);
    this.address.value = orderInfo.address;

    this.buttonCard.addEventListener('click', () => {
      this.emitInputEvent('payment', PaymentMethod.Online);
    })

    this.buttonCash.addEventListener('click', () => {
      this.emitInputEvent('payment', PaymentMethod.UponReceipt);
    })

    this.address.addEventListener('input', () => {
      this.emitInputEvent('address', this.address.value);
    })
  }

  updateButtonSelection(paymentMethod: PaymentMethod): void {
    if (paymentMethod === PaymentMethod.Online) {
      this.buttonCard.classList.add('button_alt-active');
      this.buttonCash.classList.remove('button_alt-active');
    }
    if (paymentMethod === PaymentMethod.UponReceipt) {
      this.buttonCash.classList.add('button_alt-active');
      this.buttonCard.classList.remove('button_alt-active');
    }
  }

}

export class ContactsForm extends Form implements IForm {
  protected email: HTMLFormElement;
  protected phone: HTMLFormElement;

  constructor(element: HTMLElement, orderInfo: IOrderInfo) {
    super(element);
    
    this.email = this.form.querySelector('#email');
    this.phone = this.form.querySelector('#phone');

    this.email.value = orderInfo.email;
    this.phone.value = orderInfo.phone;

    this.email.addEventListener('input', () => {
      this.emitInputEvent('email', this.email.value);
    })

    this.phone.addEventListener('input', () => {
      this.emitInputEvent('phone', this.phone.value);
    })
  }

}