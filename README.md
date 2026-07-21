# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

---

## Данные

В ходе анализа проекта установлено : в приложении используются две сущности, которые описывают данные - товар и покупатель. Они описаны интерфейсами - как контрактные определения сущностей предметной области, описывающие неизменяемую структуру данных без привязки к логике обработки.

![анализ_проекта](./preview.png)

### Базовые типы

Все типы объявлены в `src/types/index.ts`:

- `IProduct` — описание товара.
- `IBuyer` — данные покупателя.
- `TPayment` — объединение допустимых типов оплаты (`'card' | 'cash'| ''`).
- `IProductsResponse` — ответ сервера со списком товаров.
- `IOrderRequest` / `IOrderResponse` — запрос и ответ заказа.
- `IApi` — интерфейс клиента API с методами `get<T>` и `post<T>`.

### Интерфейсы сущностей

#### Интерфейс IProduct (товар)

Описывает структуру данных товара.

```ts
export interface IProduct {
  id: string; // Уникальный идентификатор (нужен для поиска)
  description: string; // Описание товара
  image: string; // Ссылка на изображение (обязательно для отображения)
  title: string; // Название товара (обязательно для карточки)
  category: string; // Категория товара
  price: number | null; // Цена: может отсутствовать (null)
}
```

Назначение:

- гарантирует, что у каждого товара есть уникальный ID, название и изображение для отображения.
- явно учитывает ситуацию, когда цена еще не установлена (значение null), предотвращая ошибки в расчетах.
- обеспечивает типобезопасность при передаче данных между слоями и при работе с массивами товаров.

#### Интерфейс IBuyer (покупатель)

Описывает структуру данных покупателя для оформления заказа.

```ts
export interface IBuyer {
  payment: TPayment; // способ оплаты: 'card' | 'cash'
  email: string;
  phone: string;
  address: string;
}
```

Назначение:

- фиксирует строгий набор полей, необходимых для формления заказа. (email, address, phone, payment)
- исключает передачу лишних данных ( например password).
- позволяет реализовать валидацию каждого поля и возвращать ошибки по конкретным ключам

### Модели данных

Для учета данных в приложении должны быть три класса, которые разделены между собой по смыслу и зонам ответственности:

- хранение товаров, которые можно купить в приложении. (Каталог товаров)
- хранение товаров, которые пользователь выбрал для покупки. (Корзина)
- данные покупателя, которые тот должен указать при оформлении заказа. (Покупатель)

#### Класс Products (Каталог товаров)

`export class Products {}` - модель каталога товаров. Хранит массив товаров, выбранный товар, предоставляет методы для работы с ними.

Конструктор класса:  
Отсутствует и не принимает параметров.  
Внутренние поля инициализируются при объявлении: `private items` — пустым массивом, `private selectedItem` — значением null.  
Это позволяет создавать экземпляр класса без аргументов и сразу использовать все методы.

Поля класса:  
`private items: IProduct[]` - хранит массив всех товаров.  
`private selectedItem: IProduct | null` - хранит товар, выбранный для подробного отображения (по умолчанию null; значение null - значит модальное окно закрыто).

Методы класса:  
`setItems(items: IProduct[]) : void` - сохранение массива товаров полученного в параметрах метода. Принимает массив всех товаров, заменяет текущее содержимое поля `items`.  
`getItems(): IProduct[]` - возвращает текущий массив товаров из модели для отрисовки каталога.  
`getItemById(id: string): IProduct | undefined` - получение одного товара по его идентификатору (id). Принимает строку с идентификатором товара. Возвращает объект `IProduct` или undefined - если товар не найден.  
`setSelectedItem(item: IProduct | null) : void` - сохранение товара для подробного отображения. Устанавливает товар в состояние "выбранного" для открытия модального окна. Принимает объект типа `IProduct`. Если передан null - модальное окно считается закрытым.  
`getSelectedItem() : IProduct | null` - получение товара для подробного отображения. Возвращает выбранный товар или null - если ничего не выбрано.

#### Класс Cart (Корзина)

`export class Cart {}` - модель корзины. Хранит товары, считает сумму, защищает от дублей.

Конструктор класса:  
Отсутствует, и не принимает параметров. Корзина изначально пуста, поэтому поле `items` инициализируется пустым массивом при объявлении. Конструктор не нужен: экземпляр создаётся простым вызовом `new Cart()`.

Поля класса:  
`private items : IProduct[]` - хранит массив товаров, которые находятся в корзине.

Методы класса:  
`getItems() : IProduct[]` - получение массива товаров, которые находятся в корзине.  
`addItem(item: IProduct) : void` - добавление товара в массив корзины. Принимает в качестве параметра - объект товара. Предотвращает дублирование по id. Проверяет наличие товара по id, если товара нет - добавляет его.  
`removeItem(id : string) : void` - удаление товара из корзины. Принимает в качестве параметра строку с идентификатором товара.  
`clear() : void` - полностью очищает корзину (используется после успешного оформления заказа).  
`getTotalPrice() : number` - получение стоимости всех товаров в корзине. Возвращает число (сумма цен). Корректно обрабатывает товары с `price: null`, считая их стоимость как 0.  
`getCount() : number` - получение количества товаров в корзине (для счетчика на иконке корзины). Возвращает целое число.  
`hasItem(id: string) : boolean` - проверка наличия товара в корзине по его id. Принимает в качестве параметра строку с идентификатором товара. Возвращает true - если товар есть, false - если нет.

#### Класс Buyer (Покупатель)

`export class Buyer {}` - модель покупателя. Хранит данные, частично обновляет их, валидирует.

Конструктор класса:  
Отсутствует и не принимает параметров. Начальное состояние объекта `data` задаётся при объявлении поля. Значение по умолчанию для способа оплаты — пустая строка (`payment: ''`), чтобы соответствовать состоянию UI, где кнопки выбора оплаты изначально неактивны. Остальные поля инициализируются пустыми строками. Сброс до этого состояния реализован отдельным методом `clear()`.

Поля класса:  
`private data: IBuyer` - объект с текущими данными покупателя. По умолчанию: `{payment: '', address: '', phone: '', email: ''}`

Методы класса:  
`setData(partialData: Partial<IBuyer>) : void` - сохранение данных в модели. Обновляет только переданные поля, не затрагивая остальные. Параметры: `partialData` - объект, содержащий любое подмножество полей `IBuyer`. Использует `Object.assign` для частичного обновления `data`.  
`getData() : IBuyer` - получение всех данных покупателя. Возвращает полный объект данных покупателя в строгом формате `IBuyer`.  
`clear() : void` - очистка данных покупателя. Сбрасывает все даннные покупателя в начальное состояние (используется после успешной отправки заказа).  
` validate() : Partial<Record<keyof IBuyer, string>>` - выполняет валидацию полей (поле валидно если не пустое). Метод создает и возвращает объект с ошибками вида `{payment: 'Не выбран тип оплаты', email: 'Укажите email'}`, где ключи - названия полей IBuyer. Проверяет каждое поле на непустоту и формирует сообщения об ошибках по ключам интерфейса `IBuyer`. Возвращает пустой объект {} - если все поля валидны и ошибок нет.

---

### Слой коммуникации

#### Класс ApiService

`export class ApiService {}` - представитель коммуникационного слоя: отвечает за сетевые запросы к серверу (получение товаров, отправка заказов). Использует принцип композиции: не создаёт HTTP‑клиент внутри себя, а принимает через конструктор объект, соответствующий интерфейсу `IApi`. Это позволяет подменять реализацию (например, на мок для тестов).

Конструктор класса:  
`constructor(api: IApi)` - принимает объект, реализующий интерфейс `IApi`.

Поля класса:  
`private api:  IApi` - хранит переданный экземпляр клиента, через который выполняются все сетевые запросы.

Методы класса:  
`async getProducts(): Promise<IProductsResponse>` - выполняет GET-запрос на энпоинт /product/ с помощью метода `get` переданного api. Возвращает ответ от сервера в формате IProductsResponse (объект с массивом товаров).  
`async sendOrder(order: IOrderRequest): Promise<IOrderResponse>` - отправляет POST-запрос на эндпоинт /order/ с помощью метода `post` переданного api. Передает объект заказа в формате IOrderRequest и возвращает ответ в формате IOrderResponse.

---

## Слой представления (View)

Все View‑компоненты используют HTML‑шаблоны (`<template id="...">`) и наследуются от базового класса `Component<T>`. Каждый класс представления отвечает за свой блок разметки, в ответ на любое действие пользователя генерирует событие, которое будет обработано презентером.

```text
Component<T> (базовый класс)
│
├─ Header - шапка сайта
├─ Gallery - витрина товаров
├─ Modal - модальное окно (самостоятельный, БЕЗ наследников!)
├─ Basket - корзина
├─ Success - экран успеха
│
├─ Card (abstract) - базовый класс для карточек товара
│  ├─ CardCatalog - карточка в каталоге
│  ├─ CardPreview - карточка в модальном окне (детально)
│  └─ CardBasket - строка товара в корзине
│
└─ Form (abstract) - базовый класс для форм
   ├─ OrderForm - форма оплаты и адреса
   └─ ContactsForm - форма с email и телефоном
```

### Класс Header

`class Header extends Component<IHeader>`

- Компонент шапки сайта. Отвечает за отображение логотипа, кнопки корзины и счётчика товаров в корзине. Не содержит логику — только отображение и трансляция событий.

**Интерфейсы:**

```ts
interface IHeader {
  counter: number;
}
```

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой элемент шапки(.header).
- events — экземпляр брокера событий (EventEmitter), через который компонент передаёт события в Презентер.

**Поля класса:**  
`private counterElement: HTMLElement` — ссылка на элемент счётчика товаров в корзине (`.header__basket-counter`). Инициализируется в конструкторе через ensureElement.  
`private basketButton: HTMLButtonElement` — ссылка на кнопку открытия корзины (`.header__basket`). Инициализируется через ensureElement.

**Методы класса:**  
`set counter(value: number): void` - сеттер, обновляет текст счетчика корзины. Принимает число и устанавливает textContent у counterElement.

```ts
set counter(value: number) {
  this.counterElement.textContent = String(value);
}
```

**События, которые генерирует:**  
`basket:open` — при клике на кнопку корзины. Вызывается через this.events.emit('basket:open').

```ts
this.basketButton.addEventListener("click", () => {
  this.events.emit("basket:open");
});
```

### Класс Gallery

`export class Gallery extends Component<IGalleryData>`

- Компонент витрины/каталога товаров. Отображает сетку карточек товаров. Не управляет фильтрацией, сортировкой — только компоновкой карточек в контейнер.

**Интерфейсы:**

```ts
interface IGalleryData {
  items: HTMLElement[]; // готовые DOM-элементы карточек
}
```

**Конструктор класса:**
`constructor(container: HTMLElement)`

- container: HTMLElement — корневой элемент блока галереи (.gallery), в который будут вставляться карточки.

**Поля класса:**  
`protected catalogElement: HTMLElement` — ссылка на элемент, в который будут вставляться карточки. В текущей реализации это сам контейнер, переданный в конструктор.

**Методы класса:**  
`set catalog (items: HTMLElement[]): void` - сеттер, очищает контейнер и вставляет переданный массив готовых карточек.

```ts
set catalog(items: HTMLElement[]) {
  this.catalogElement.replaceChildren(...items);
}
```

НЕ генерирует событий (события генерируют вложенные в неё CardCatalog)

### Класс Modal

`export class Modal extends Component<IModalData>`

- Компонент модального окна. Управляет видимостью окна (класс `modal_active`), подменой контента в .`modal__content`, закрытием по кнопке и клику вне модалки. НЕ содержит логику отображения контента — это самостоятельные компоненты (CardPreview, Basket, OrderForm, Success и т.д.).

**Интерфейсы:**

```ts
interface IModalData {
  content?: HTMLElement; // контент для вставки
}
```

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой элемент модального окна (.modal).
- events — брокер событий для передачи действий

**Поля класса:**  
`private readonly modalContainer: HTMLElement` - ссылка на корневой блок .modal.  
`private readonly closeButton: HTMLButtonElement` - cсылка на кнопку закрытия (`.modal__close`).  
`private readonly contentArea: HTMLElement` — область для вставки контента (`.modal__content`).  
`private isOpen: boolean = false` - внутренний флаг состояния окна. Используется для защиты от повторных вызовов open() / close(). Если окно уже открыто, повторный open() ничего не делает; аналогично с close().

**Методы класса:**  
`open(): void {}` — делает модальное окно видимым (добавляет класс `modal_active`). Перед этим проверяет isOpen: если true, метод завершается без изменений. После успешного показа устанавливает isOpen = true.

```ts
open(): void {
  if (this.isOpen) return;
  this.modalContainer.classList.add('modal_active');
  this.isOpen = true;
}
```

`close(): void {}` — скрывает модальное окно (убирает класс `modal_active`). Проверяет isOpen: если false, метод завершается. После скрытия устанавливает isOpen = false.

```ts
close(): void {
  if (!this.isOpen) return;
  this.modalContainer.classList.remove('modal_active');
  this.isOpen = false;
}
```

`setContent(element: HTMLElement): void {}` — очищает контент, вставляет переданный элемент и открывает окно.

```ts
setContent(element: HTMLElement): void {
  this.contentArea.replaceChildren(element);
  this.open();
}
```

**События, которые генерирует:**  
`modal:close` — при клике на `.modal__close` или клике вне модалки.

```ts
// В конструкторе:
this.closeButton.addEventListener("click", () => {
  this.close();
  this.events.emit("modal:close");
});

this.modalContainer.addEventListener("click", (e) => {
  if (e.target === this.modalContainer) {
    this.close();
    this.events.emit("modal:close");
  }
});
```

### Класс Basket

`export class Basket extends Component<IBasketData>`

- Компонент представления корзины. Отображает список товаров, итоговую сумму и кнопку оформления. Управляет отключением кнопки при пустой корзине. Не содержит логику удаления товаров — события обработает Презентер.

**Интерфейсы:**

```ts
interface IBasketData {
  items: HTMLElement[]; // готовые DOM-элементы CardBasket
  totalCost: number;
}
```

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой элемент, куда будет вставлен шаблон корзины (`.basket`).
- events — брокер событий.

**Поля класса:**  
`private listElement: HTMLUListElement` — ссылка на список `.basket__list`, в который будут вставляться карточки CardBasket.  
`private priceElement: HTMLSpanElement` — элемент для отображения итоговой суммы. `.basket__price`  
`private checkoutButton: HTMLButtonElement` — ссылка на кнопку `.basket__button`

**Методы класса:**  
`set items(items: HTMLElement[]): void` — заменяет содержимое списка товаров

```ts
set items(items: HTMLElement[]) {
  this.listElement.replaceChildren(...items);
}
```

`set totalCost(cost: number): void` — обновляет отображение итоговой суммы

```ts
set totalCost(cost: number) {
  this.priceElement.textContent = `${cost} синапсов`;
}
```

`setCheckoutEnabled(enabled: boolean): void` — включает/отключает кнопку оформления

```ts
setCheckoutEnabled(enabled: boolean): void {
  this.checkoutButton.disabled = !enabled;
}
```

**События, которые генерирует:**  
`checkout:open` — при клике на кнопку "Оформить"

```ts
// В конструкторе:
this.checkoutButton.addEventListener("click", () => {
  this.events.emit("checkout:open");
});
```

События удаления товаров (basket:remove) генерирует вложенный в неё компонент CardBasket, а не сам Basket.

### Класс Success

`export class Success extends Component<ISuccessData>`

- Компонент экрана успешного оформления заказа. Отображает сообщение о создании заказа и сумму списания. Генерирует событие при нажатии кнопки "За новыми покупками!".

**Интерфейсы:**

```ts
interface ISuccessData {
  total: number;
}
```

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container - корневой элемент (создаётся из шаблона #success)
- events - брокер событий (EventEmitter), через который компонент сообщает Презентеру о действиях пользователя.

**Поля класса:**  
`private descriptionElement: HTMLParagraphElement` — элемент для отображения суммы (`.order-success__description`).  
`private closeButton: HTMLButtonElement` — кнопка «За новыми покупками!» (`.order-success__close`).

**Методы класса:**  
`set total(value: number): void` — обновляет отображение суммы.

```ts
set total(value: number) {
  this.descriptionElement.textContent = `Списано ${value} синапсов`;
}
```

**События, которые генерирует:**  
`success:close` — при клике на кнопку "За новыми покупками!".

```ts
// В конструкторе:
this.closeButton.addEventListener("click", () => {
  this.events.emit("success:close");
});
```

---

### Класс Card (абстрактный)

`export abstract class Card extends Component<IProduct>`

- Базовый класс для всех вариантов отображения товара (карточка в каталоге, детальная карточка, строка в корзине). Содержит общую логику поиска элементов (название, цена) и сеттеры для них.

**Интерфейсы:**

```ts
interface ICardActions {
  onClick?: (id: string) => void;
}
```

**Конструктор класса:**  
`protected constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой DOM‑элемент карточки.
- events — брокер событий для трансляции действий пользователя.

**Поля класса:**  
`protected titleElement?: HTMLElement`- ссылка на элемент названия товара(`.card__title`).  
`protected priceElement?: HTMLSpanElement` - ссылка на элемент цены (`.card__price`).

**Методы класса:**  
`set title(title: string): void` - сеттер для установки названия товара. Обновляет textContent у titleElement, если он найден.

```ts
set title(value: string): void {
  if (this.titleElement) {
    this.titleElement.textContent = value;
  }
}
```

`set price(value: number | null): void` - сеттер для установки цены товара. Корректно обрабатывает случай null (Отображает "Бесценно"). Если значение есть, форматирует числовое значение и добавляет валюту "синапсов"(${value} синапсов).

```ts
set price(value: number | null): void {
  if (this.priceElement) {
    if (value === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}
```

`abstract render(data: unknown): HTMLElement` — обязательный метод для каждого наследника. Отвечает за полную отрисовку компонента (клонирование шаблона, поиск элементов, заполнение, навешивание слушателей, возврат this.container).

### Класс CardCatalog

`export class CardCatalog extends Card<IProduct>`

- Компонент карточки товара в каталоге (сетка товаров). Отвечает за отображение товара в компактном виде: название, цена, категория, изображение. Генерирует событие при клике на карточку. Общая логика наследуется от Card.

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой DOM‑элемент, в который будет помещена карточка.
- events — брокер событий

**Поля класса:**  
`private imageElement?: HTMLImageElement` - ссылка на элемент изображения товара (`.card__image`).  
`private categoryElement?: HTMLElement` - ссылка на элемент для отображения категории товара (`.card__category`).

**Методы класса:**  
`set category(category: string): void` - устанавливает текстовое содержимое элемента категории.

```ts
set category(value: string): void {
  if (this.categoryElement) {
    this.categoryElement.textContent = value;
    // Применить модификатор из categoryMap (константа из utils/constants.ts)
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.className = `card__category ${modifier}`;
    }
  }
}
```

`set image(url: string): void`- устанавливает изображение, используя утилитарный метод setImage

```ts
set image(url: string): void {
  if (this.imageElement) {
    this.setImage(this.imageElement, url, 'Изображение товара');
  }
}
```

`render(data: Partial<IProduct>): HTMLElement` — отрисовывает карточку

- Клонирует шаблон #card-catalog.
- Переинициализирует все DOM‑элементы (в том числе общие) в новом контейнере.
- Заполняет данные через сеттеры: this.title, this.price, this.category, this.image.
- Сохраняет ID для последующего использования setElementData(this.container, { productId: data.id }); (метод из utils.ts)
- Вешает обработчик клика по карточке: эмитит событие product:open с { id }.
- Возвращает this.container.

```ts
render(data: Partial<IProduct>): HTMLElement {
  // Клонируем шаблон #card-catalog
  this.container = cloneTemplate<HTMLElement>('#card-catalog');

  // Переинициализируем все элементы в новом контейнере
  this.titleElement = ensureElement<HTMLElement>(
    '.card__title',
    this.container
  );
  this.priceElement = ensureElement<HTMLSpanElement>(
    '.card__price',
    this.container
  );
  this.imageElement = ensureElement<HTMLImageElement>(
    '.card__image',
    this.container
  );
  this.categoryElement = ensureElement<HTMLElement>(
    '.card__category',
    this.container
  );

  // Заполняем данные через сеттеры
  if (data.title) this.title = data.title;
  if (data.price !== undefined) this.price = data.price;
  if (data.image) this.image = data.image;
  if (data.category) this.category = data.category;

  // Сохраняем ID для последующего использования
  setElementData(this.container, { productId: data.id });

  // Навешиваем обработчик клика
  this.container.addEventListener('click', () => {
    this.events.emit('product:open', { id: data.id });
  });

  return this.container;
}
```

**События, которые генерирует:**  
`product:open` — при клике по карточке. В payload передаётся { id: string }. Сигнал Презентеру открыть модальное окно с детальным просмотром.

### Класс CardPreview

`export class CardPreview extends Card<IProduct>`

- Детальная карточка товара в модальном окне. Отображает полную информацию: изображение, название, цена, категория, описание. Содержит кнопку действия ("В корзину" или "Удалить из корзины"). Кнопка отключена, если цена = null.

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой DOM‑элемент карточки.
- events — брокер событий

Внутри конструктора:

- вызов super(container, events) — базовая инициализация.
- через ensureElement ищутся специфичные элементы в пределах this.container:  
  `.card__image` → this.imageElement.  
  `.card__category` → this.categoryElement.  
  `.card__text` → this.descriptionElement.  
  `.card__button` → this.cardButton.

**Поля класса:**  
`protected imageElement?: HTMLImageElement` — ссылка на элемент изображения `.card__image`.  
`protected categoryElement?: HTMLElement` - ссылка на элемент для отображения категории товара (`.card__category`).  
`protected descriptionElement?: HTMLParagraphElement` - ссылка на элемент описания товара (`.card__text`).  
`protected cardButton?: HTMLButtonElement` - ссылка на кнопку действия (`.card__button`).  
`private isInCart = false` - UI‑флаг, отражающий, находится ли товар в корзине (только для отображения текста кнопки, не для хранения бизнес‑состояния).

**Методы класса:**  
`set image(url: string): void` - устанавливает изображение, используя утилитарный метод setImage.

```ts
set image(url: string): void {
  if (this.imageElement) {
    this.setImage(this.imageElement, url, 'Изображение товара');
  }
}
```

`set category(category: string)` - устанавливает текстовое содержимое элемента категории.

```ts
set category(value: string): void {
  if (this.categoryElement) {
    this.categoryElement.textContent = value;
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.className = `card__category ${modifier}`;
    }
  }
}
```

`set description(value: string)` - устанавливает текстовое содержимое описания товара.

```ts
set description(value: string): void {
  if (this.descriptionElement) {
    this.descriptionElement.textContent = value;
  }
}
```

`updateButtonState(isInCart: boolean, price: number | null): void` - обновляет текст кнопки добавления товара в корзину в зависимости от состояния товара.

```ts
updateButtonState(isInCart: boolean, price: number | null): void {
  this.isInCart = isInCart;

  if (!this.cardButton) return;

  if (price === null) {
    // Товар без цены
    this.cardButton.textContent = 'Недоступно';
    this.cardButton.disabled = true;
  } else if (isInCart) {
    // Товар в корзине
    this.cardButton.textContent = 'Удалить из корзины';
    this.cardButton.disabled = false;
  } else {
    // Товар можно добавить
    this.cardButton.textContent = 'В корзину';
    this.cardButton.disabled = false;
  }
}
```

`render(data: Partial<IProduct>): HTMLElement` — отрисовывает детальную карточку

- Клонирует шаблон #card-preview.
- Переинициализирует DOM‑элементы.
- Заполняет общие и специфичные данные через сеттеры.
- Вызывает this.updateButtonState(false, data.price ?? null);
- Сохраняет ID setElementData(this.container, { productId: data.id });
- Вешает клик на кнопку.
- Возвращает this.container.

```ts
render(data: Partial<IProduct>): HTMLElement {
  // Клонируем шаблон #card-preview
  this.container = cloneTemplate<HTMLElement>('#card-preview');

  // Переинициализируем элементы
  this.titleElement = ensureElement<HTMLElement>(
    '.card__title',
    this.container
  );
  this.priceElement = ensureElement<HTMLSpanElement>(
    '.card__price',
    this.container
  );
  this.imageElement = ensureElement<HTMLImageElement>(
    '.card__image',
    this.container
  );
  this.categoryElement = ensureElement<HTMLElement>(
    '.card__category',
    this.container);
  this.descriptionElement = ensureElement<HTMLParagraphElement>(
    '.card__text',
    this.container);
  this.cardButton = ensureElement<HTMLButtonElement>(
    '.card__button',
    this.container);

  // Заполняем данные
  if (data.title) this.title = data.title;
  if (data.price !== undefined) this.price = data.price;
  if (data.image) this.image = data.image;
  if (data.category) this.category = data.category;
  if (data.description) this.description = data.description;

  // Инициальное состояние кнопки (Презентер обновит это позже)
  this.updateButtonState(false, data.price ?? null);

  // Сохраняем ID
  setElementData(this.container, { productId: data.id });

  // Навешиваем обработчик клика на кнопку
  this.cardButton?.addEventListener('click', () => {
    if (this.isInCart) {
      this.events.emit('product:remove-from-cart', { id: data.id });
    } else {
      this.events.emit('product:add-to-cart', { id: data.id });
    }
  });

  return this.container;
}
```

**События, которые генерирует:**  
`product:add-to-cart` — при клике на "В корзину". Payload: { id: string }  
`product:remove-from-cart` — при клике на "Удалить из корзины". Payload: { id: string }

### Класс CardBasket

`export class CardBasket extends Card<IProduct>`

- Строка товара в корзине (элемент списка). Отображает порядковый номер, название, цену и кнопку удаления. Нумерация пересчитывается при каждой отрисовке.

**Интерфейсы:**

```ts
interface ICardBasketData {
  product: IProduct;
  index: number;
}
```

**Конструктор класса:**  
`constructor(container: HTMLElement, protected events: IEvents)`

- container — корневой элемент строки.
- events — брокер событий.

Внутри конструктора:

- вызов super(container, events).
- через утилиту ensureElement ищутся элементы (характерные для корзины) в пределах this.container:
  `.basket__item-index` → сохраняется в this.indexElement.
  `.basket__item-delete` → сохраняется в this.deleteButton.

**Поля класса:**  
`protected indexElement?: HTMLSpanElement` - ссылка на элемент порядкового номера товара в корзине (`.basket__item-index`).  
`private deleteButton?: HTMLButtonElement` - ссылка на кнопку удаления товара из корзины (`.basket__item-delete`).

**Методы класса:**  
`set index(index: number): void` - устанавливает порядковый номер товара в корзине (в `.basket__item-index`)

```ts
set index(value: number): void {
  if (this.indexElement) {
    this.indexElement.textContent = String(value);
  }
}
```

`render(item: ICardBasketData): HTMLElement` — отрисовывает строку в корзине

- Клонирует шаблон #card-basket.
- Переинициализирует все DOM‑элементы (общие и специфичные).
- Заполняет заголовок и цену через сеттеры родителя: this.title = item.product.title, this.price = item.product.price.
- Устанавливает порядковый номер: this.index = item.index.
- Сохраняет ID товара setElementData(this.container, { productId: item.product.id });
- Вешает клик на кнопку удаления: эмитит событие basket:remove с { id: item.product.id }.
- Возвращает this.container.

```ts
render(item: ICardBasketData): HTMLElement {
  // Клонируем шаблон #card-basket
  this.container = cloneTemplate<HTMLElement>('#card-basket');

  // Переинициализируем элементы
  this.titleElement = ensureElement<HTMLElement>(
    '.card__title',
    this.container
  );
  this.priceElement = ensureElement<HTMLSpanElement>(
    '.card__price',
    this.container
  );
  this.indexElement = ensureElement<HTMLSpanElement>(
    '.basket__item-index',
    this.container
  );
  this.deleteButton = ensureElement<HTMLButtonElement>(
    '.basket__item-delete',
    this.container
  );

  // Заполняем данные
  this.title = item.product.title;
  this.price = item.product.price;
  this.index = item.index;

  // Сохраняем ID товара
  setElementData(this.container, { productId: item.product.id });

  // Навешиваем обработчик удаления
  this.deleteButton?.addEventListener('click', () => {
    this.events.emit('basket:remove', { id: item.product.id });
  });

  return this.container;
}
```

**События, которые генерирует:**  
`basket:remove` — при клике на кнопку удаления. В payload передаётся { id: string }. Сигнал Презентеру удалить товар из корзины.

### Класс Form (абстрактный)

`export abstract class Form extends Component<IFormState>`

- Базовый класс для всех форм. Отвечает за общую логику отображения элементов формы (кнопки отправки, блока ошибок) и их состояния, а также за перехват базовых событий потока ввода и отправки. Не содержит бизнес-логики и валидации (делегируется Презентеру и Модели).

**Интерфейсы:**

```ts
interface IFormState {
  valid: boolean;
  errors: string[];
}
```

**Конструктор класса:**  
`constructor(container: HTMLFormElement, protected events: IEvents)`

- container: элемент формы <form>.
- events: брокер событий

**Поля класса:**  
`protected submitButton?: HTMLButtonElement` -  ссылка на кнопку отправки ([type="submit"]).  
`protected errorContainer?: HTMLElement` - контейнер для отображения ошибок (`.form__errors`).

**Методы класса:**  
`protected onInputChange(field: keyof T, value: string): void` - метод-хелпер для генерации события изменения поля формы.  
`set valid(value: boolean): void` - сеттер, включает или отключает кнопку отправки формы.  
`set errors(value: string): void` - сеттер для отображения текста ошибок в контейнере errorsContainer.  
`render(state: Partial<T> & IFormState): HTMLFormElement` - в базовой реализации находит внутри this.container кнопку [type="submit"] (сохраняет в this.submitButton) и контейнер `.form__errors` (сохраняет в this.errorContainer). Затем возвращает this.container. Наследники могут вызывать super.render() и дополнять логику.

**События, которые генерирует:**  
 В конструкторе вешаются глобальные слушатели на форму (используя делегирование):

`${this.container.name}:change` — при вводе в любые поля input. Передает payload { field: имя_инпута, value: значение }.  
`${this.container.name}:submit` — при отправке формы (блокирует стандартную отправку e.preventDefault()).

### Класс OrderForm

`export class OrderForm extends Form<IOrderForm>`

- Форма первого шага оформления заказа. Отвечает за отображение кнопок выбора способа оплаты и поля ввода адреса доставки.

**Интерфейсы:**

```ts
interface IOrderForm {
  address: string;
}
```

**Конструктор класса:**  
`constructor(container: HTMLFormElement, protected events: IEvents)`  
Внутри конструктора вызывает super(container, events).

**Поля класса:**  
`private paymentButtons: HTMLButtonElement[] = []` — массив ссылок на кнопки выбора способа оплаты (`.button_alt`).

**Методы класса:**  
`set payment(method: string): void` — сеттер, визуально отмечает выбранную кнопку оплаты (добавляет класс `button_alt-active`).

**События, которые генерирует:**  
`order:payment:change` — при клике на кнопку оплаты. Payload: { target: 'card' | 'cash' }.  
Наследует от Form: order:change, order:submit.

### Класс ContactsForm

`export class ContactsForm extends Form<IContactsForm>`

- Форма второго шага оформления заказа. Содержит поля email и телефона. Функционал полностью наследуется от базового класса Form.

**Интерфейсы:**

```ts
interface IContactsForm {
  email: string;
  phone: string;
}
```

**Конструктор класса:**  
`constructor(container: HTMLFormElement, events: IEvents)`  
Внутри конструктора вызывает super(container, events). Базовый класс автоматически ищет все <input> внутри формы и вешает слушатели на события ввода.

**Поля класса:**  
отсутствуют (используются поля и инструментарий родительского класса).

**Методы класса:**  
отсутствуют (не требуется переопределение, вся логика наследуется от Form).

**События, которые генерирует:**  
Наследуются от Form: `contacts:change` — при вводе данных в поля email или phone. `contacts:submit` — при нажатии кнопки "Оплатить".

---

### События приложения

Взаимодействие между слоями Model, View и Presenter осуществляется через брокер событий (EventEmitter). Каждое действие пользователя или изменение данных генерирует событие с определенным именем и payload'ом. Презентер подписывается на эти события и обрабатывает их, вызывая методы моделей и представлений.

**События от Представлений (View)**  
`basket:open`  
Генерируется: Header — клик по иконке корзины в шапке  
Payload: —

`product:open`  
Генерируется: CardCatalog — клик по карточке товара в каталоге  
Payload: { id: string }

`product:add-to-cart`
Генерируется: CardPreview — клик по кнопке "В корзину"
Payload: { id: string }

`product:remove-from-cart`  
Генерируется: CardPreview — клик по кнопке "Удалить из корзины"  
Payload: { id: string }

`basket:remove`  
Генерируется: CardBasket — клик по кнопке удаления в строке корзины  
Payload: { id: string }

`checkout:open`  
Генерируется: Basket — клик по кнопке "Оформить"  
Payload: —

`success:close`  
Генерируется: Success — клик по кнопке "За новыми покупками!"  
Payload: —

`modal:close`  
Генерируется: Modal — клик по крестику или по оверлею  
Payload: —

`order:change`  
Генерируется: Form (OrderForm) — ввод данных в поле адреса  
Payload: { field: 'address', value: string }

`order:submit`  
Генерируется: Form (OrderForm) — отправка формы (кнопка "Далее")  
Payload: —

`order:payment:change`  
Генерируется: OrderForm — клик по кнопке выбора способа оплаты  
Payload: { target: 'card' | 'cash' }

`contacts:change`  
Генерируется: Form (ContactsForm) — ввод данных в поля email или phone  
Payload: { field: 'email' | 'phone', value: string }

`contacts:submit`  
Генерируется: Form (ContactsForm) — отправка формы (кнопка "Оплатить")  
Payload: —

**События от Моделей данных (Model)**  
`products:changed`  
Генерируется: Products — обновлен каталог товаров (загружен с сервера)  
Payload: { items: IProduct[] }

`product:selected`  
Генерируется: Products — выбран товар для детального просмотра  
Payload: { item: IProduct | null }

`cart:changed`  
Генерируется: Cart — изменено содержимое корзины (добавление/удаление/очистка)  
Payload: { items: IProduct[], total: number, count: number }

`buyer:changed`
Генерируется: Buyer — обновлены данные покупателя (из формы)  
Payload: { field: keyof IBuyer, value: string }

`formErrors:change`  
Генерируется: Buyer — изменены ошибки валидации формы  
Payload: { errors: Partial<Record<keyof IBuyer, string>>, formName: 'order' | 'contacts' }

**События для управления модальными окнами**  
Презентер использует следующие события для управления интерфейсом (обрабатываются внутри Презентера, не генерируются компонентами):

`product:open` — Открыть модальное окно с детальным просмотром товара. Действие Презентера: получает товар из Products, создает CardPreview, вставляет в Modal и открывает.

`basket:open` — Открыть модальное окно корзины. Действие Презентера: получает товары из Cart, создает CardBasket для каждого, вставляет в Basket, затем в Modal и открывает.

`checkout:open` — Открыть форму заказа (первый шаг). Действие Презентера: создает OrderForm, вставляет в Modal и открывает.

`order:submit` — Перейти ко второму шагу оформления. Действие Презентера: создает ContactsForm, вставляет в Modal и открывает.

`contacts:submit` — Отправить заказ на сервер. Действие Презентера: собирает все данные из Buyer, формирует IOrderRequest, отправляет через ApiService, показывает Success.

`modal:close` / `success:close` — Закрыть модальное окно. Действие Презентера: закрывает модальное окно.
