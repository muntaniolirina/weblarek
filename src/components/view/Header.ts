import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/** Интерфейс данных, которые Header может принимать через render() / сеттеры */
interface IHeaderData {
  counter: number; // количество товаров в корзине
}

/**
 * Шапка страницы.
 * Отображает счётчик товаров в корзине и кнопку открытия корзины.
 * При клике на кнопку корзины генерирует событие 'basket:open'.
 */
export class Header extends Component<IHeaderData> {
  private counterElement: HTMLElement; // элемент со счётчиком
  private basketButton: HTMLButtonElement; // кнопка корзины

  /**
   * @param container - корневой DOM-элемент шапки
   * @param events - брокер событий для коммуникации с Presenter'ом
   */
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    // Клик по кнопке корзины генерирует событие basket:open
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  /** Обновляет значение счётчика товаров в корзине */
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}