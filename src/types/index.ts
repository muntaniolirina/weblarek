// Допустимые HTTP-методы для POST-запросов
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/** 
* Контракт для HTTP-клиента
* Описывает, как мы взаимодействуем с сетью: методы get и post,которые возвращают промисы с типизированными данными.
*/ 
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Допустимые способы оплаты. Union тип
export type TPayment = 'card' | 'cash'; // убрала ''

// Интерфейс для ошибок валидации
export interface BuyerValidationErrors extends Partial<Record<keyof IBuyer, string>> {}

/** 
* ТОВАР (Структура одного товара)
* Используется и в UI (карточки товаров), и в ответах сервера.
*/
export interface IProduct {
  id: string; // Уникальный идентификатор (нужен для поиска)
  description: string; // Описание товара
  image: string; // Ссылка на изображение (обязательно для отображения)
  title: string; // Название товара (обязательно для карточки)
  category: string; // Категория товара
  price: number | null; // Цена: может отсутствовать (null)
}

/**
* ПОКУПАТЕЛЬ (Данные покупателя для оформления заказа)
* Используется для валидации и заполнения формы.
*/
export interface IBuyer {
  payment: TPayment | ''; //пуста ястрока допускается на уровне поля
  email: string;
  phone: string;
  address: string;
}

// -- Типы для API (строго по POstman) --

/**
 * Ответ сервера на запрос списка товаров (GET /product/).
 * Содержит общее количество и массив товаров.
 */
export interface IProductsResponse {
  total: number;   // общая сумма/кол-во (из Json)
  items: IProduct[];  // массив товаров
}

/**
 * Тело запроса для отправки заказа (POST /order/).
 * Формат строго соответствует тому, что ожидает сервер (из Postman).
 * items — это массив ID (строк), а не объектов товаров.
 */
export interface IOrderRequest extends IBuyer {
  total: number;         // общая сумма заказа
  items: string[];        // массив ID товаров, как в Postman
}

/**
 * Ответ сервера после успешного создания заказа.
 * Содержит ID созданного заказа и подтверждённую сумму.
 */
export interface IOrderResponse {
  id: string;    // Id заказа
  total: number;    // подтвержденная сумма
}