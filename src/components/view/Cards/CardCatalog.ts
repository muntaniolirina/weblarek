import { IEvents } from '../../base/Events';
import { IProduct } from '../../../types';
import { Card } from './Card';
import { ensureElement , setElementData} from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';

export class CardCatalog extends Card {
  protected imageElement: HTMLImageElement; // .card__image
  protected categoryElement: HTMLElement;  // .card__category

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events); // инициализация базового класса

    // поиск специфичных полей для карточки каталога
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    // Слушатель вешается ОДИН раз в конструкторе
    this.container.addEventListener('click', () => {
      // Читаем id с data-атрибута контейнера (устанавливается в render())
      const id = this.container.dataset.productId;
      this.events.emit('product:open', {id});
    });
  }

  // устанавливаем изображение
  set image(url: string) {
    if(this.imageElement) {
      this.setImage(this.imageElement, url, 'Изображение товара'); // setImage наследуется от Component
    };
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

  // render() — только заполняет данные и возвращает контейнер
  render(data: Partial<IProduct>): HTMLElement {
    if (data.title) this.title = data.title;
    if (data.price !== undefined) this.price = data.price;
    if (data.image) this.image = data.image;
    if (data.category) this.category = data.category;

    // Сохраняем ID на контейнере — обработчик в конструкторе прочитает его при клике
    setElementData(this.container, { productId: data.id });

    return this.container;
  }
}