import { ensureAllElements } from '../../../utils/utils';
import { Form } from './Form';
import { IEvents } from '../../base/Events';

/**
 * Форма первого шага оформления заказа — выбор способа оплаты и ввод адреса.
 * Наследует базовую форму (сабмит, ввод, ошибки) и добавляет:
 * кнопки выбора способа оплаты с подсветкой активной.
 */
export class OrderForm extends Form {
  private paymentButtons: HTMLButtonElement[] = []; // Кнопки выбора способа оплаты (Онлайн / При получении)

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    // Поиск всех кнопок с классом .button_alt внутри формы
    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    // На каждую кнопку вешается слушатель — генерирует событие order:payment:change с name кнопки
    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () =>
        this.events.emit('order:payment:change', {target: btn.name}))
    })
  }

  /** Подсвечивает выбранный способ оплаты, снимает подсветку с остальных */
  set payment(method: string) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === method);
    });
  }

   /** Сбрасывает форму: очищает поля и убирает подсветку с кнопок оплаты */
  reset(): void {
    super.reset(); // очищаем поля
    this.payment = ''; // сбрасываем подсветку кнопок оплаты
  }
}