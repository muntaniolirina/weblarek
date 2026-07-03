import { IBuyer } from "../../types/index";

// Покупатель
// хранение, частичное обновление и валидацию данных покупателя перед оформлением заказа

export class Buyer {
  // сразу задаем изначальное состояние
  private data: IBuyer = {
    payment: '',
    address: '',
    phone: '',
    email: '',
  }

  // частичное обновление данных покупателя
  // Partial - встроенный тип - все поля опционные
  setData(partialData: Partial<IBuyer>) : void {
    Object.assign(this.data, partialData);
  }

  getData() : IBuyer {
    return this.data;
  }

  clear() : void {
    this.data = {
      payment: '',
      address: '',
      phone: '',
      email: '',
    }
  }

  validate() : Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const { payment, address, phone, email } = this.data;  // деструктурируем

    // проверка payment - выбран тип оплаты (поле не пустое)
    if( !payment || payment.trim() === '' ) {
      errors.payment = 'Выберите тип оплаты';
    }
    // проверка адреса - не пустое поле
    if( !address || address.trim() === '') {
      errors.address = 'Укажите адрес';
    }
    // проверка телефона - не пустое поле
    if( !phone || phone.trim() === '') {
      errors.phone = 'Укажите номер телефона';
    }
    // проверка email - не пустое поле
    if( !email || email.trim() === '') {
      errors.email = 'Введите email';
    }

    // Если ошибок нет, вернётся пустой объект.
    return errors;
  }
}