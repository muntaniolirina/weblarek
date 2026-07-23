import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/** Интерфейс данных для окна успешного заказа: списанная сумма */
interface ISuccessData {
  total: number;
}

/**
 * Окно успешного оформления заказа.
 * Отображает сообщение о списании синапсов и кнопку закрытия.
 * При клике на кнопку генерирует событие 'success:close'.
 */
export class Success extends Component<ISuccessData> {
  private descriptionElement: HTMLParagraphElement; // текст с суммой списания
  private closeButton: HTMLButtonElement; // кнопка закрытия

  /**
   * @param container - корневой DOM-элемент окна
   * @param events - брокер событий для коммуникации с Presenter'ом
   */
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLParagraphElement>('.order-success__description', this.container); // описание
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container); // кнопка

    // Клик по кнопке закрытия генерирует событие success:close
    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }
  
  /** Устанавливает текст с суммой списанных синапсов */
  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}

