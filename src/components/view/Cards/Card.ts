import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

/**
 * Базовый класс для всех типов карточек товара (каталог, превью, корзина).
 * Содержит общую логику: поиск элементов названия и цены, сеттеры для них.
 */
export abstract class Card extends Component<IProduct> {
  // Общие элементы для всех карточек
  protected titleElement: HTMLElement; // Элемент отображения названия товара
  protected priceElement: HTMLSpanElement; // Элемент отображения цены товара

  /**
   * В конструкторе один раз находим и сохраняем общие DOM-элементы.
   * ensureElement выбрасывает ошибку, если селектор не найден.
   */
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // инициализируем конструктор базового класса

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
  }

  /** Устанавливает название товара в элемент titleElement */
  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  /**
   * Устанавливает цену товара в элемент priceElement.
   * Если цена отсутствует (null), отображаем "Бесценно".
   */
  set price(value: number | null) {
    if (this.priceElement) {
      if (value === null) {
        this.priceElement.textContent = 'Бесценно';
      } else {
        this.priceElement.textContent = `${value} синапсов`;
      }
    }
  }
}