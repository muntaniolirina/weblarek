import { Component } from '../base/Component';

/** Данные для галереи: массив DOM-элементов карточек товаров */
interface IGalleryData {
  items: HTMLElement[]; // готовые DOM-элементы карточек
}

/**
 * Галерея товаров на главной странице.
 * Отображает карточки товаров в виде сетки.
 * Простая обёртка над контейнером .gallery — заменяет содержимое при обновлении каталога.
 */
export class Gallery extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Контейнер галереи и есть элемент, куда вставляются карточки
    this.catalogElement = this.container;
  }
  /** Заменяет содержимое галереи на новый набор карточек */
  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items); 
    // replaceChildren очищает все дочерние элементы внутри; (...items) — spread разворачивает массив в отдельные аргументы
  }
}