import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/** Данные для отображения корзины: массив DOM-элементов товаров и общая стоимость */
interface IBasketData {
  items: HTMLElement[]; // готовые DOM-элементы CardBasket
  totalCost: number;
}

/**
 * Компонент корзины.
 * Отображает список выбранных товаров, общую стоимость и кнопку оформления заказа.
 */
export class Basket extends Component<IBasketData> {
  private listElement: HTMLUListElement;    // контейнер со списком товаров
  private priceElement: HTMLSpanElement;    // элемент с общей стоимостью
  private checkoutButton: HTMLButtonElement; // кнопка "Оформить"

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // инициализируем конструктор базового класса

    this.listElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.basket__price', this.container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // Клик по кнопке "Оформить" генерирует событие basket:order
    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('basket:order');
    })
  }

  /** Устанавливает список DOM-элементов товаров в корзине */
  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items); // Если items пустой — CSS сам добавит ::before с "Корзина пуста"
  }

  /** Устанавливает общую стоимость товаров */
  set totalCost(cost: number) {
    this.priceElement.textContent = `${cost} синапсов`;
  }

  /** Включает / отключает кнопку оформления */
  setCheckoutEnabled(enabled: boolean) {
    this.checkoutButton.disabled = !enabled;
  }
} 
