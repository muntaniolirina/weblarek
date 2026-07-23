import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

/** Состояние формы: валидна / невалидна + текст ошибки */
interface IFormState {
  valid: boolean;
  error: string;
}

/**
 * Базовый абстрактный класс формы.
 * Обрабатывает сабмит и ввод в поля, генерируя события вида `{formName}:submit` и `{formName}:change`.
 * Конкретные формы (OrderForm, ContactsForm) наследуются от него и добавляют свою логику.
 */
export abstract class Form extends Component<IFormState> {
  protected submitButton: HTMLButtonElement; // кнопка отправки формы
  protected errorContainer: HTMLElement; // контейнер для отображения
  private formName: string;  // имя формы (order / contacts)

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container); // инициализация базового класса

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', container);
    this.formName = container.name;

    // Слушатель отправки формы — предотвращает перезагрузку страницы, генерирует `order:submit` или `contacts:submit`
    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(`${this.formName}:submit`); // либо order:submit, либо contacts:submit
    });

    // Слушатель ввода в поля — передаёт имя поля и значение через событие
    container.addEventListener('input', (e) => {
      if(e.target instanceof HTMLInputElement) {
        this.onInputChange(e.target.name, e.target.value);
      }
    });
  }
  /** Генерирует событие изменения поля формы. Переопределяется в наследниках при необходимости */
  protected onInputChange(field: string, value: string): void {
    this.events.emit(`${this.formName}:change`, { field, value });
  }

  /** Блокирует / разблокирует кнопку отправки */
  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  /** Устанавливает текст ошибки */
  set error(value: string) {
    this.errorContainer.textContent = value;
  }

  /** Сбрасывает все поля формы к исходному состоянию */
  reset(): void {
    const formElement = this.container as HTMLFormElement;
    formElement.reset(); // стандартный метод HTMLFormElement — очищает все инпуты
  }

  /**
   * Заполняет состояние формы (валидность и ошибки) и возвращает DOM-элемент формы.
   * Используется Презентером для обновления UI после валидации.
   */
  render(state: IFormState): HTMLFormElement {
    const {valid, error} = state;
    if(valid !== undefined) this.valid = valid;
    if(error !== undefined) this.error = error;
    return this.container as HTMLFormElement;
  }
}