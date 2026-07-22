import { ensureAllElements } from '../../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../../base/Events';

export class OrderForm extends Form {
  private paymentButtons: HTMLButtonElement[] = []; //массив ссылок на кнопки выбора способа оплаты (`.button_alt`)

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    // слушатели на кнопки оплаты
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () =>
        this.events.emit('order:payment:change', {target: btn.name}))
    })
  }

  set payment(method: string) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === method);
    });
  }
}