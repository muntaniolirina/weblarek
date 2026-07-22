import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';


interface IFormState {
  valid: boolean;
  error: string; // // текст ошибки от Презентера
}

export abstract class Form extends Component<IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorContainer: HTMLElement;
  private formName: string;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container); // инициализация базового класса

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', container);
    this.formName = container.name;

    // установка слушателей, 1 раз в конструкторе
    // слушатель на отправку формы ( не this.container, а просто container, чтобы нужный был тип )
    container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(`${this.formName}:submit`); // либо order:submit, либо contacts:submit
    });

    // слушатель на ввод в поля ( не this.container, а просто container, чтобы нужный был тип )
    container.addEventListener('input', (e) => {
      if(e.target instanceof HTMLInputElement) {
        this.onInputChange(e.target.name, e.target.value);
      }
    });
  }

  protected onInputChange(field: string, value: string): void {
    this.events.emit(`${this.formName}:change`, { field, value });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set error(value: string) {
    this.errorContainer.textContent = value;
  }
  render(state: IFormState): HTMLFormElement {
    const {valid, error} = state;
    if(valid !== undefined) this.valid = valid;
    if(error !== undefined) this.error = error;
    return this.container as HTMLFormElement;
  }
}