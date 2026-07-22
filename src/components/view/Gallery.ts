import { Component } from '../base/Component';

// Интерфейс данных для Gallery
interface IGalleryData {
  items: HTMLElement[]; // готовые DOM-элементы карточек
}

export class Gallery extends Component<IGalleryData> {
  // Ссылка на элемент, в который будем вставлять карточки
  // В данной реализации это сам контейнер .gallery
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Контейнер и есть тот элемент, куда вставляем карточки
    this.catalogElement = this.container;
  }
  // Сеттер: очищает контейнер и вставляет новый набор карточек
  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items); 
    // replaceChildrenочищает все дочерние элементы внутри; (...items) — spread разворачивает массив в отдельные аргументы
  }
};