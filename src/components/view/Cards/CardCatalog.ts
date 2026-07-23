import { CDN_URL } from '../../../utils/constants';
import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { Card } from './Card';
import { ensureElement , setElementData} from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';

/**
 * Карточка товара для отображения в каталоге на главной странице.
 * Наследует базовую карточку (название, цена) и добавляет:
 * изображение, категорию с CSS-классом для цвета, клик для открытия превью.
 */
export class CardCatalog extends Card {
  protected imageElement: HTMLImageElement; // Элемент изображения товара
  protected categoryElement: HTMLElement;  // Элемент категории товара (софт-скил, хард-скил и тд)

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events); // инициализация базового класса

    // поиск специфичных для карточки каталога элементов
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    /**
     * Слушатель клика на всю карточку.
     * Читает id товара из data-атрибута контейнера и генерирует событие product:open.
     */
    this.container.addEventListener('click', () => {
      // Читаем id с data-атрибута контейнера (устанавливается в render())
      const id = this.container.dataset.productId;
      this.events.emit('product:open', {id});
    });
  }

  /** Устанавливает изображение товара (склеивает CDN_URL + путь к файлу) */
  set image(url: string) {
    if(this.imageElement) {
      this.setImage(this.imageElement, CDN_URL + url, 'Изображение товара'); // setImage наследуется от Component
    };
  }

  /**
   * Устанавливает название категории и соответствующий CSS-класс для цвета.
   * Использует categoryMap для преобразования названия категории в модификатор.
   */
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

  /**
   * Заполняет карточку данными товара и возвращает контейнер.
   * Сохраняет id товара в data-атрибут для обработчика клика.
   */
  render(data: Partial<IProduct>): HTMLElement {
    if (data.title) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;
    if (data.image) this.image = data.image;
    if (data.category) this.category = data.category;

    setElementData(this.container, { productId: data.id });

    return this.container;
  }
}