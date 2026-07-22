import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { Card } from './Card';
import { ensureElement , setElementData} from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';

export class CardPreview extends Card {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLParagraphElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events); // инициализация базового класса

    // ищем специфичные поля для карточки
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    // Слушатель вешается ОДИН раз в конструкторе
     // При клике на кнопку читаем id и состояние из dataset (устанавливаются в render())
    this.cardButton.addEventListener('click', () => {
      const id = this.container.dataset.productId;
      const buttonState = this.container.dataset.isInCart === 'true'; // состояние хранится только на DOM

      if(buttonState) {
        this.events.emit('product:remove-from-cart', {id});
      } else {
        this.events.emit('product:add-to-cart', {id});
      }
    })
  }

  // устанавливаем изображение
  set image(url: string) {
    if(this.imageElement) {
      this.setImage(this.imageElement, url, 'Изображение товара');
    }
  }

  // устанавливаем категорию
  set category(value: string) {
    if(this.categoryElement) {
      this.categoryElement.textContent = value;

      const modifier = categoryMap[value as keyof typeof categoryMap];
      // typeof CategoryMap получает тип самого объекта (value: string)
      // keyof typeof categoryMap получает тип ключей, в виде массива строк объекта (union объединение)
      // value as keyof typeof categoryMap преобразовывает value в тип ключа объекта
      // categoryMap[...] - по этому ключу берется соотв значение (css класс)
      if (modifier) {
        this.categoryElement.className = `card__category ${modifier}`;
      }
    }
  }

  // устанавливаем описание
  set description(value: string) {
    if(this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

   /**
   * Обновляет состояние кнопки.
   * Состояние (в корзине / не в корзине) сохраняется в dataset,
   * а не в поле класса — данные хранятся только в Модели.
   */
  updateButtonState(isInCart: boolean, price: number | null) : void {
    // Сохраняем состояние на DOM-элементе (для обработчика в конструкторе)
    this.container.dataset.isInCart = String(isInCart);

    if(!this.cardButton) return; //если кнопка не найдена, то выходим

    if(price === null) {
      this.cardButton.textContent = 'Недоступно';
      this.cardButton.disabled = true;
    } else if (isInCart) {
      this.cardButton.textContent = 'Удалить из корзины';
      this.cardButton.disabled = false;
    } else {
      this.cardButton.textContent = 'Купить'; // в макете Купить, а не В Корзину
      this.cardButton.disabled = false;
    }
  }

  // Render (только заполнение, без слушателей)
  render(data: Partial<IProduct>): HTMLElement {
    if (data.title) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;
    if (data.image) this.image = data.image;
    if (data.category) this.category = data.category;
    if (data.description) this.description = data.description;

    // сохраняем id в dataset - обработчик клика прочитает его
    setElementData(this.container, {productId: data.id});

    // начальное состояние кнопки (товар еще не в корзине)
    this.updateButtonState(false, data.price ?? null);

    return this.container;
  }
}
