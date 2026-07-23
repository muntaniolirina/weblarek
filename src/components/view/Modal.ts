import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

/*
 * Интерфейс данных для Modal.
 * content — готовый HTMLElement, который будет вставлен в модальное окно.
 */
interface IModalData {
  content?: HTMLElement;
}

/**
 * Компонент модального окна.
 * Отвечает только за отображение/скрытие и вставку контента.
 * Не содержит логики принятия решений и не хранит данные.
 */
export class Modal extends Component<IModalData> {
  // Элементы разметки — найдены в конструкторе и сохранены в полях класса
  private closeButton: HTMLButtonElement;   // кнопка закрытия (крестик)
  private contentArea: HTMLElement;         // контейнер для контента (.modal__content)

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Поиск элементов внутри контейнера (выполняется 1 раз в конструкторе)
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentArea = ensureElement<HTMLElement>('.modal__content', this.container);

    // Слушатели устанавливаются 1 раз в конструкторе (требование шага 3)
    
    // Закрытие по клику на крестик
    this.closeButton.addEventListener('click', () => {
      this.close();
      this.events.emit('modal:close');
    });

    // Закрытие по клику на оверлей (фон вокруг модалки)
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
        this.events.emit('modal:close');
      }
    });
  }

  /**
   * Открыть модальное окно.
   * Использует модификатор 'modal_active' (описан в задании).
   * Не хранит состояние — открытость определяется наличием класса на DOM-элементе.
   */
  open(): void {
    this.container.classList.add('modal_active');
  }

  /**
   * Закрыть модальное окно.
   * Удаляет модификатор и очищает контент.
   */
  close(): void {
    this.container.classList.remove('modal_active');
    this.contentArea.innerHTML = ''; // очищаем контент при закрытии
  }

  /**
   * Установить новый контент в модальное окно и открыть его.
   * @param element — готовый DOM-элемент для вставки
   */
  setContent(element: HTMLElement): void {
    this.contentArea.replaceChildren(element);
    this.open();
  }

  /**
   * render() — заполняет данные и возвращает корневой DOM-элемент.
   * Поддерживает интерфейс Component<IModalData>.
   */
  render(data?: IModalData): HTMLElement {
    const copy = data ? { ...data } : {};
    if (copy.content) {
      this.setContent(copy.content);
    }
    return this.container;
  }
}
