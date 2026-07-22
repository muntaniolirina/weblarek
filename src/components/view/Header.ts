import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Интерфейс данных, которые Header может принимать через render() / сеттеры
interface IHeaderData {
  counter: number; // количество товаров в корзине
}

export class Header extends Component<IHeaderData> {
  // Ссылки на DOM-элементы внутри контейнера Header
  private counterElement: HTMLElement; // элемент со счётчиком
  private basketButton: HTMLButtonElement; // кнопка корзины

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // передаём контейнер в базовый компонент

    // Ищем элементы ТОЛЬКО внутри переданного контейнера (this.container)
    // ensureElement выбросит ошибку, если элемент не найден
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    // Один раз вешаем слушатель на кнопку корзины
    // При клике генерируем событие 'basket:open' — его будет слушать Presenter
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // Сеттер для обновления счётчика товаров в корзине
  // Presenter будет вызывать: header.counter = 5;
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}