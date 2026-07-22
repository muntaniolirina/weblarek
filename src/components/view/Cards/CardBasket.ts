import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { Card } from './Card';
import { ensureElement , setElementData} from '../../../utils/utils';

export class CardBasket extends Card {
  protected indexElement: HTMLSpanElement; // .basket__item-index
  protected deleteButton: HTMLButtonElement;  // .basket__item-delete

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events); // инициализация базового класса

    // ищем специфические элементы
    this.indexElement = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement >('.basket__item-delete', this.container);

    // Слушатель вешается ОДИН раз в конструкторе
    this.deleteButton.addEventListener('click', () => {
      // Читаем id с data-атрибута контейнера (устанавливается в render())
      const id = this.container.dataset.productId;
      this.events.emit('basket:remove', {id});
    });
  }

  // устанавливаем порядковый номер товара в корзине
  set index(value: number) {
    if(this.indexElement) {
      this.indexElement.textContent = String(value);
    }
  }

  // render() — только заполняет данные и возвращает контейнер
  render(data: Partial<IProduct>): HTMLElement  {
  // Заполняем данные через сеттеры с проверками
    if (data.title) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;

    setElementData(this.container, { productId: data.id });

    return this.container;
  }
}