import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { Card } from './Card';
import { ensureElement , setElementData} from '../../../utils/utils';

/**
 * Карточка товара для отображения в корзине.
 * Наследует базовую карточку (название, цена) и добавляет:
 * порядковый номер, кнопку удаления, data-атрибут с id товара.
 */
export class CardBasket extends Card {
  protected indexElement: HTMLSpanElement; // Элемент порядкового номера товара в списке корзины
  protected deleteButton: HTMLButtonElement;  // Кнопка удаления товара из корзины

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events); // инициализация базового класса

    // Поиск специфических для корзины элементов
    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement >('.basket__item-delete', this.container);

    /**
     * Слушатель клика на кнопку удаления.
     * Читает id товара из data-атрибута контейнера (устанавливается в render())
     * и генерирует событие basket:remove.
     */
    this.deleteButton.addEventListener('click', () => {
      // Читаем id с data-атрибута контейнера (устанавливается в render())
      const id = this.container.dataset.productId;
      this.events.emit('basket:remove', {id});
    });
  }

  /** Устанавливает порядковый номер товара в списке корзины */
  set index(value: number) {
    if(this.indexElement) {
      this.indexElement.textContent = String(value);
    }
  }

  /**
   * Заполняет карточку данными товара и возвращает контейнер.
   * Дополнительно сохраняет id товара в data-атрибут контейнера,
   * чтобы кнопка удаления могла его прочитать.
   */
  render(data: Partial<IProduct>): HTMLElement  {
  // Заполняем данные через сеттеры с проверками
    if (data.title) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;

    setElementData(this.container, { productId: data.id });

    return this.container;
  }
}