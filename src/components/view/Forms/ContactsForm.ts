import { Form } from "./Form";
import { IEvents } from "../../base/Events";

/**
 * Форма второго шага оформления заказа — ввод email и телефона.
 * Наследует всю логику базовой формы (сабмит, ввод, валидация, ошибки).
 * Не добавляет новых полей — email и phone обрабатываются через onInputChange из Form.
 */
export class ContactsForm extends Form {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}