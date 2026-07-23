import { IBuyer, BuyerValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

/**
 * Покупатель
 * Хранение, частичное обновление и валидация данных покупателя перед оформлением заказа
 * Уведомляет Презентер через события при любом изменении данных
 */
export class Buyer {
  /** Хранилище данных покупателя, по умолчанию все поля пустые */
  private data: IBuyer = {
    payment: '',
    address: '',
    phone: '',
    email: '',
  }

  /**
   * @param events - брокер событий для уведомления Презентера
   */
  constructor(protected events: IEvents) {}

  /**
   * Частичное обновление данных покупателя.
   * Пример: setData({ address: 'Москва' }) обновит только адрес, остальные поля не тронет
   * После сохранения эмитит событие buyer:changed с указанием изменённого поля и его значения
   * 
   * @param partialData - объект с одним полем IBuyer, например { address: 'Москва' } или { phone: '123' }
   */
  setData(partialData: Partial<IBuyer>): void {
    // Object.assign копирует все свойства из partialData в this.data
    // Например: было { payment: '', address: '', phone: '', email: '' }
    // Вызываем setData({ address: 'Москва' })
    // Стало: { payment: '', address: 'Москва', phone: '', email: '' }
    Object.assign(this.data, partialData);

    // Object.keys(partialData) возвращает массив ключей объекта
    // Например: для { address: 'Москва' } вернёт ['address']
    // [0] — берём первый (и единственный) элемент массива — строку 'address'
    // as keyof IBuyer — указание TypeScript, что это точно одно из полей IBuyer
    const changedField = Object.keys(partialData)[0] as keyof IBuyer;

    // Object.values(partialData) возвращает массив значений объекта
    // Например: для { address: 'Москва' } вернёт ['Москва']
    // [0] — берём первое значение — 'Москва'
    const changedValue = Object.values(partialData)[0];

    // Уведомляем Презентер: "поле changedField изменилось, теперь оно равно changedValue"
    this.events.emit('buyer:changed', {
      field: changedField,
      value: changedValue
    });
  }

  /**
   * Возвращает полную копию данных покупателя
   */
  getData(): IBuyer {
    return this.data;
  }

  /**
   * Сбрасывает все данные покупателя в начальное состояние (все поля пустые).
   * Используется после успешной отправки заказа.
   * Эмитит buyer:changed, чтобы Презентер обновил формы
   */
  clear(): void {
    this.data = {
      payment: '',
      address: '',
      phone: '',
      email: '',
    };
    // Уведомляем Презентер, что данные очищены
    // field и value передаём просто для соблюдения формата события
    this.events.emit('buyer:changed', {
      field: 'payment' as keyof IBuyer,
      value: ''
    });
  }

  /**
   * Валидирует данные покупателя.
   * Проверяет, что все поля непустые (с учётом trim — пробелы считаются пустотой).
   * Эмитит formErrors:change с объектом ошибок.
   * 
   * @returns объект с ошибками. Если ошибок нет — возвращается пустой объект {}
   */
  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    const { payment, address, phone, email } = this.data;

    // Проверка: выбран ли способ оплаты
    if (!payment?.trim()) {
      errors.payment = 'Выберите тип оплаты';
    }

    // Проверка: введён ли адрес
    if (!address?.trim()) {
      errors.address = 'Укажите адрес';
    }

    // Проверка: введён ли телефон
    if (!phone?.trim()) {
      errors.phone = 'Укажите номер телефона';
    }

    // Проверка: введён ли email
    if (!email?.trim()) {
      errors.email = 'Введите email';
    }

    // Уведомляем Презентер об ошибках валидации
    // Презентер покажет сообщения под соответствующими полями формы
    this.events.emit('formErrors:change', {
      errors,
      formName: 'order'     // TODO: в Презентере уточнить имя формы ('order' или 'contacts')
    });

    return errors;
  }
}