export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// тип Tpayment - допустимые способы оплаты. Union тип
export type TPayment = 'card' | 'cash' | '';

// Товар - интерфейс IProduct - описывает стурктуру одного товара
export interface IProduct {
  id: string; // Уникальный идентификатор (нужен для поиска)
  description: string; // Описание товара
  image: string; // Ссылка на изображение (обязательно для отображения)
  title: string; // Название товара (обязательно для карточки)
  category: string; // Категория товара
  price: number | null; // Цена: может отсутствовать (null)
}

// Покупатель - интерфейс IBuyer - описывает данные покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}