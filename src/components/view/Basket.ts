import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Интерфейс данных для корзины
interface IBasketData {
  items: HTMLElement[]; // готовые DOM-элементы CardBasket
  totalCost: number;
}

export class Basket extends Component<IBasketData> {
  private listElement: HTMLUListElement;
  private priceElement: HTMLSpanElement;
  private checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // инициализируем конструктор базового класса

    this.listElement = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.basket__price', this.container);
    this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // устанавливаем обработчики событий 1 раз в конструкторе
    this.checkoutButton.addEventListener('click', () => {
      this.events.emit('basket:order');
    })
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items); // Если items пустой — CSS сам добавит ::before с "Корзина пуста"
  }

  set totalCost(cost: number) {
    this.priceElement.textContent = `${cost} синапсов`;
  }

  setCheckoutEnabled(enabled: boolean) {
    this.checkoutButton.disabled = !enabled;
  }
} 
