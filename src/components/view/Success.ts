import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  private descriptionElement: HTMLParagraphElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // ищем элементы в переданном контейнере
    this.descriptionElement = ensureElement<HTMLParagraphElement>('.order-success__description', container); // описание
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container); // кнопка

    // вешаем обработчики событий. Слушатель вешается 1 раз в конструкторе
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }
  
  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}

