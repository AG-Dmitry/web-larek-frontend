import { IOrderInfoData, PaymentMethod, TFormOrderInfo } from "../types";
import { EventEmitter } from "../components/base/events";

export class OrderInfoData extends EventEmitter implements IOrderInfoData{
  protected payment: PaymentMethod | null;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor() {
    super();
    
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  getData(): TFormOrderInfo {
    return this as TFormOrderInfo;
  }

  setData(key: keyof TFormOrderInfo, value: string): void {
    if (key === 'payment') {
      this.payment = value as PaymentMethod;
    } else {
      this[key] = value;
    }
    this.emit('changed');
  }

  validateOrder(): boolean {
    if (this.payment && this.address.length) return true;
  }

  validateAll(): boolean {
    if (this.validateOrder() && this.phone.length && this.email.length) return true;
  }

}