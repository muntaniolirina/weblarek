import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';


// Интерфейс действий (коллбэки, если понадобятся)
interface ICardActions {
  onClick?: (id: string) => void;
}

export abstract class Card extends Component<IProduct> {
  // Общие элементы для всех карточек
  protected titleElement: HTMLElement;
  protected priceElement: HTMLSpanElement;

  // Ищем общие элементы в конструкторе базового класса
  // ensureElement выбросит ошибку, если элемент не найден
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // инициализируем конструктор базового класса

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
  }

  // Сеттер для названия
  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  // Сеттер для цены — обрабатывает null ("Бесценно")
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