import './scss/styles.scss';

import { IOrderRequest, TPayment } from './types/index';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { ApiService } from './components/services/ApiService';
import { IProductsResponse } from './types/index';
import { API_URL } from './utils/constants';

import { IEvents, EventEmitter } from './components/base/Events';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Success } from './components/view/Success';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { CardCatalog } from './components/view/Cards/CardCatalog';
import { CardPreview } from './components/view/Cards/CardPreview';
import { CardBasket } from './components/view/Cards/CardBasket';
import { OrderForm } from './components/view/Forms/OrderForm';
import { ContactsForm } from './components/view/Forms/ContactsForm';

import { cloneTemplate } from './utils/utils';

// --- ИНИЦИАЛИЗАЦИЯ ---

// Брокер событий
const events: IEvents = new EventEmitter();

// Модели данных
const products = new Products(events); // каталог товаров
const cart = new Cart(events);         // корзина
const buyer = new Buyer(events);       // данные покупателя

// Компоненты представления

// Корневые элементы на странице
const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;

// Клонируем шаблоны из index.html
const basketContainer = cloneTemplate<HTMLElement>('#basket');
const successContainer = cloneTemplate<HTMLElement>('#success');
const orderformContainer = cloneTemplate<HTMLFormElement>('#order');
const contactsformContainer = cloneTemplate<HTMLFormElement>('#contacts');

// Создаём компоненты представления
const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketContainer, events);
const success = new Success(successContainer, events);
const orderForm = new OrderForm(orderformContainer, events);
const contactsForm = new ContactsForm(contactsformContainer, events);
// CardCatalog, CardPreview, CardBasket — создаются для каждого товара внутри обработчиков, а не заранее

/**
 * Собирает и обновляет содержимое корзины.
 * Для каждого товара из модели Cart создаёт DOM-элемент CardBasket.
 */
function renderBasketItems(): void {
  const items = cart.getItems(); // получаем массив товаров из модели корзины

  // для каждого товара создаём DOM-элемент карточки корзины
  const cards = items.map( (item, index) => {
    const cardContainer = cloneTemplate<HTMLElement>('#card-basket'); // клонируем шаблон карточки корзины
    const cardBasket = new CardBasket(cardContainer, events); // создаём экземпляр CardBasket, передаём шаблон и брокер событий
    cardBasket.index = index + 1; // устанавливаем порядковый номер товара (нумерация с 1)
    cardBasket.render(item);

    return cardContainer; // возвращаем готовый DOM-элемент
  })

  // передаём массив карточек в корзину — она отобразит их в списке
  basket.items = cards; 
  basket.totalCost = cart.getTotalPrice(); // обновляем общую стоимость
  
  // Активируем кнопку оформления только если есть товары
  const hasItems = cart.getItems().length > 0 ? true : false; 
  basket.setCheckoutEnabled(hasItems); 
}

// --- ПРЕЗЕНТЕР. ОБРАБОТЧИКИ СОБЫТИЙ ---

let isBasketOpen = false; // флаг — открыта ли сейчас корзина

// Обновление каталога товаров на главной
events.on('products:changed', () => {
  const items = products.getItems(); // получаем массив товаров из модели Products

  // для каждого товара создаём DOM-элемент карточки каталога
  const cards = items.map((item) => {
    const cardContainer = cloneTemplate<HTMLElement>('#card-catalog'); // клонируем шаблон карточки каталога
    const cardCatalog = new CardCatalog(cardContainer, events); // создаём экземпляр CardCatalog, передаём шаблон и брокер событий
    cardCatalog.render(item); // заполняем карточку данными товара (название, цена, категория, изображение)

    return cardContainer; // возвращаем готовый DOM-элемент карточки
  });
  
  gallery.catalog = cards; // передаём массив карточек в галерею — она отобразит их на странице
});


let currentPreview: CardPreview | null = null; // ссылка на открытую детальную карточку

// Клик по карточке в каталоге — открывает детальный просмотр
events.on('product:open', (data: {id: string}) => {
  const product = products.getItemById(data.id); // получаем тоар по id
  if(!product) return; // если товара нет, пропускаем

  const cardContainer = cloneTemplate<HTMLElement>('#card-preview'); // клонируем шаблон
  const cardPreview = new CardPreview(cardContainer, events); // создаем экземпляр
  currentPreview = cardPreview;
  cardPreview.render(product); // рендерим карточку

  // Проверяем, есть ли товар уже в корзине, и обновляем кнопку
  const isInCart = cart.hasItem(product.id);
  cardPreview.updateButtonState(isInCart, product.price); 

  modal.setContent(cardContainer); // открываем модалку с карточкой
})


// Изменение корзины — обновляем счётчик в хедере и содержимое, если корзина открыта
events.on('cart:changed', () => {
  const itemsCount = cart.getCount();  // получаем актуальное количество товаров в корзине
  header.counter = itemsCount; // обновляем счётчик в хедере

  if (isBasketOpen) {
    renderBasketItems(); // перерисовываем содержимое корзины
  }
})

// Открытие корзины
events.on('basket:open', () => {
  isBasketOpen = true; // корзина открыта
  renderBasketItems();
  modal.setContent(basketContainer); // открываем модалку с содержимым корзины
})

// Добавление товара в корзину (кнопка "Купить")
events.on('product:add-to-cart', (data: {id: string}) => {
  const product = products.getItemById(data.id); // получаем товар по id
  if(!product) return; // если товар не найден — выходим

  cart.addItem(product); // добавляем товар в корзину (внутри автоматически эмитится cart:changed)
  currentPreview?.updateButtonState(true, product.price); // обновляем кнопку в preview
})

// Удаление товара из корзины (кнопка "Удалить из корзины")
events.on('product:remove-from-cart', (data: {id: string}) => {
  const product = products.getItemById(data.id); // получаем товар по id
  if(!product) return; // если товар не найден — выходим

  cart.removeItem(product.id); // удаляем товар из корзины (внутри автоматически эмитится cart:changed)
  currentPreview?.updateButtonState(false, product.price);  // обновляем кнопку в preview
})

// Удаление товара из корзины (через кнопку в самой корзине)
events.on('basket:remove', (data: {id: string}) => {
  const product = products.getItemById(data.id); // получаем товар по id
  if(!product) return; // если товар не найден — выходим

  cart.removeItem(product.id); // удаляем из корзины
});

// Закрытие модалки — сбрасываем флаг корзины
events.on('modal:close', () => {
  isBasketOpen = false;
});

// Кнопка "Оформить" в корзине — переход к форме заказа
events.on('basket:order', () => {
  isBasketOpen = false; // корзина закрыта
  modal.setContent(orderformContainer);
});

/**
 * Валидирует первую форму оформления (оплата + адрес)
 * Обновляет состояние кнопки "Далее" и отображает ошибки
 */
function validateOrderForm(): void {
  const errors = buyer.validate(['payment', 'address']); // проверяем только payment и address
  orderForm.valid = Object.keys(errors).length === 0; // // кнопка активна, если нет ошибок
  orderForm.error = Object.values(errors).join(', '); // показываем ошибки в форме
}

// Выбор способа оплаты
events.on('order:payment:change', (data: {target: string}) => {
  orderForm.payment = data.target; // подсвечиваем выбранную кнопку
  buyer.setData({ payment: data.target as TPayment}); // сохраняем способ оплаты в модель
  validateOrderForm(); // проверяем валидность формы
});

// Ввод адреса в первой форме
events.on('order:change', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value }); // сохраняем значение поля в модель
  validateOrderForm(); // проверяем валидность формы
});

// Нажатие "Далее" — переход ко второй форме
events.on('order:submit', () => {
  const errors = buyer.validate(['payment', 'address']);

  if (Object.keys(errors).length > 0) {
    orderForm.error = Object.values(errors).join(', '); // показываем ошибки
  } else {
    modal.setContent(contactsformContainer); // открываем форму контактов
  }
});

/**
 * Валидирует вторую форму оформления (телефон + email)
 * Обновляет состояние кнопки "Оплатить" и отображает ошибки
 */
function validateContactsForm(): void {
  const errors = buyer.validate(['phone', 'email']); // проверяем только phone и email
  contactsForm.valid = Object.keys(errors).length === 0; // активируем кнопку, если ошибок нет
  contactsForm.error = Object.values(errors).join(', '); // показываем ошибки в форме
}

// Ввод телефона или email во второй форме
events.on('contacts:change', (data: {field: string, value: string}) => {
  buyer.setData({ [data.field]: data.value }); // сохраняем значение поля в модель
  validateContactsForm(); // проверяем валидность формы
});

// Нажатие "Оплатить" — отправка заказа на сервер
events.on('contacts:submit', async () => {
  const errors = buyer.validate(['email', 'phone']);

  if (Object.keys(errors).length > 0) {
    contactsForm.error = Object.values(errors).join(', '); // показываем ошибки
    return;
 }
  // собираем данные для отправки на сервер
  const order: IOrderRequest = {
    ...buyer.getData(),
    total: cart.getTotalPrice(),
    items: cart.getItems().map((item) => {
      return item.id;
    })
  };

  try {
    await apiService.sendOrder(order);
    // console.log('Отправленные данные:', order); //  смотрим, что уходит
    // console.log('Ответ сервера:', response); //  что вернул сервер
    
    success.total = order.total; // передаём сумму в окно успеха

    cart.clear(); // очищаем корзину
    buyer.clear(); // очищаем данные покупателя

    modal.setContent(successContainer); // показываем окно успеха
  } catch (error) {
      console.error('Ошибка при оформлении заказа', error);
      contactsForm.error = 'Не удалось оформить заказ. Попробуйте снова.'; // текст добавила от себя
  }
});

// Закрытие окна успешной оплаты — сбрасываем формы
events.on('success:close', () => {
  modal.close();
  orderForm.reset();    // очищаем поля первой формы
  contactsForm.reset(); // очищаем поля второй формы
})

// --- API ---

const api = new Api(API_URL);
const apiService = new ApiService(api);

// --- ЗАГРУЗКА КАТАЛОГА ПРИ СТАРТЕ ---

apiService.getProducts()
  .then((response: IProductsResponse) => {
    products.setItems(response.items); // сохраняем товары в модель
  })
  .catch((error) => {
    console.error('Не удалось получить товары:', error);
  });

