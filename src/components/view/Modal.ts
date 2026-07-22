import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModalData {
  content?: HTMLElement; // контент для вставки
}

export class Modal extends Component<IModalData> {
  private closeButton: HTMLButtonElement;
  private contentArea: HTMLElement;
  private isOpen: boolean = false;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // инициализация базового класса

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentArea = ensureElement<HTMLElement>('.modal__content', this.container);

    // вешаем слушателя, 1 раз в конструкторе
    this.closeButton.addEventListener('click', (e) => {
      if(e.target === this.closeButton) {
        this.close();
        this.events.emit('modal:close');
      }
    })
    this.container.addEventListener('click', (e) => {
      if(e.target === this.container) {
        this.close();
        this.events.emit('modal:close');
      }
    })
  }

  open(): void {
    if(this.isOpen) return;
    this.container.classList.add('modal_active');
    this.isOpen = true;
  }

  close(): void {
    if(!this.isOpen) return;
    this.container.classList.remove('modal_active');
    this.isOpen = false;
  }

  setContent(element: HTMLElement): void {
    this.contentArea.replaceChildren(element);
    this.open();
  }

  render(data?: IModalData): HTMLElement {
    const copy = data ? { ...data } : {};
    if (copy.content) {
      this.setContent(copy.content);
    }
    return this.container;
  }
}