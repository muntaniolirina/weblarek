import './scss/styles.scss';

import { TPayment } from './types/index';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { ApiService } from './components/services/ApiService';
import { IProductsResponse } from './types/index';
import { API_URL } from './utils/constants';

import { IEvents } from './components/base/Events';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Success } from './components/view/Success';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Cards/Card';
import { CardCatalog } from './components/view/Cards/CardCatalog';
import { CardPreview } from './components/view/Cards/CardPreview';
import { CardBasket } from './components/view/Cards/CardBasket';
import { OrderForm } from './components/view/Forms/OrderForm';
import { ContactsForm } from './components/view/Forms/ContactsForm';

import { cloneTemplate } from './utils/utils';

//--- ТЕСТИРОВАНИЕ ---

// console.log('=== Проверка моделей данных (с apiProducts) ===');

// // --- Тестирование Products ---
// console.log('📦 ТЕСТ Products');
// const productsModel = new Products();  // создаем экземпляр Products

// console.log('1. Пустая модель:', productsModel.getItems()); 

// productsModel.setItems(apiProducts.items);  // сохраняем массив поступивших данных
// console.log('2. После setItems:', productsModel.getItems().length, 'товаров'); // Должно совпадать с apiProducts.items.length

// const firstProduct = productsModel.getItemById(apiProducts.items[0].id);
// console.log('3. Товар по ID:', firstProduct?.title); // Должен вывести название первого товара

// productsModel.setSelectedItem(firstProduct ?? null);
// console.log('4. Выбранный товар:', productsModel.getSelectedItem()?.title);

// productsModel.setSelectedItem(null);
// console.log('5. После сброса selectedItem:', productsModel.getSelectedItem()); // Должно быть null

// console.log(''); // пустая строка для разделения в консоли


// // --- Тестирование Cart ---
// console.log('🛒 ТЕСТ Cart');
// const cart = new Cart(); // создаем экземпляр Cart

// cart.addItem(apiProducts.items[0]);
// cart.addItem(apiProducts.items[1]);
// cart.addItem(apiProducts.items[0]); // Попытка добавить дубль

// console.log('1. Количество товаров (дубль не должен добавиться):', cart.getCount()); // Должно быть 2
// console.log('2. Товары в корзине:', cart.getItems().map(product => product.title)); // перебираем товары в корзине и получаем их title

// console.log('3. Стоимость каждого товара', cart.getItems().map(product => product.price)); // узнаем цену кажого товара (для наглядности)

// console.log('4. Сумма корзины:', cart.getTotalPrice()); // Сумма товаров

// console.log('5. Есть ли товар с id:', apiProducts.items[2].id, '- в корзине? Ответ:', cart.hasItem(apiProducts.items[2].id)); // false

// cart.removeItem(apiProducts.items[0].id); // удаляем товар из корзины
// console.log('6. После удаления товара ID 0, count:', cart.getCount()); // Должно быть 1

// cart.clear(); // очищаем корзину
// console.log('7. После clear, count:', cart.getCount()); // Должно быть 0

// console.log('');  // пустая строка для разделения в консоли


// // --- Тестирование Buyer ---
// console.log('🚀 ТЕСТ Buyer');
// const buyer = new Buyer(); // создаем экземпляр Buyer

// const initialData = buyer.getData(); // исходный объект
// console.log('1. Дефолтные значения:', initialData);
// if (initialData.payment === '' && initialData.address === '' &&
//     initialData.phone === '' && initialData.email === '') {
//   console.log('✅ Дефолт верный');
// } else {
//   console.error('❌ Дефолт не совпадает');
// }

// // Частичное обновление из данных, которые могли бы прийти из формы
// buyer.setData({
//   email: 'hello@example.com',
//   phone: '+79990000000',
// });
// const afterSet = buyer.getData();  // получаем обновленный объект
// console.log('2. После setData:', afterSet);
// if (afterSet.email === 'hello@example.com' && afterSet.phone === '+79990000000' &&
//     afterSet.address === '' && afterSet.payment === '') {
//   console.log('✅ setData корректно обновил переданные поля и не тронул остальные');
// } else {
//   console.error('❌ setData сработал некорректно: поля не обновились или изменились лишние');
// }

// const errorsPartial = buyer.validate();
// console.log('3. Ошибки валидации (частично заполнено):', errorsPartial);
// if (errorsPartial.payment && errorsPartial.address) {
//   console.log('✅ Валидация ловит пустые обязательные поля');
// } else {
//   console.error('❌ Валидация не отработала');
// }

// //Проверка на полное заполнение и корректности payment
// console.log('4. Полное заполнение и проверка валидации');
// buyer.setData({
//   payment: 'cash',
//   address: 'Москва, ул. Пушкина, д. 1',
// });

// const errorsAllFilled = buyer.validate();
// const currentPayment = buyer.getData().payment;
// const validOptions : TPayment[] = ['card', 'cash'];

// // Сначала смотрим, что вернула валидация
// if (Object.keys(errorsAllFilled).length > 0) {
//   // Случай 1: валидация нашла ошибки
//   console.error('❌ Валидация НЕ пройдена: найдены ошибки по полям:', errorsAllFilled);
// } else if (!validOptions.includes(currentPayment as TPayment)) {
//   // Случай 2: ошибок нет, но payment какой-то «левый»
//   console.error(`❌ Валидация НЕ пройдена: payment = "${currentPayment}" — недопустимое значение. Разрешены: ${validOptions.join(', ')}`);
// } else {
//   // Случай 3: всё ок
//   console.log(`✅ Валидация ПРОЙДЕНА: ошибок нет, payment = "${currentPayment}" корректен`);
// }

// buyer.clear();
// const clearedData = buyer.getData();
// console.log('5. Данные после clear:', clearedData);
// if (clearedData.payment === '' && clearedData.address === '' &&
//     clearedData.phone === '' && clearedData.email === '') {
//   console.log('✅ clear() сбросил все поля');
// } else {
//   console.error('❌ clear() не сработал');
// }

// console.log('🎉 Ура! Все тесты пройдены!');


// // --- ЗАПРОСЫ ---

// // создаем экземпляр клиента
// const api = new Api(API_URL);

// // создаем сервис
// const apiService = new ApiService(api);

// console.log('🚀 Начинаем загрузку каталога товаров...');

// // делаем запрос через ApiService
// apiService.getProducts()
//   .then( (response: IProductsResponse) => {
//     productsModel.setItems(response.items) // сохраняем товары в модель каталога через метод setItems
    
//     console.log('📦 Каталог сохранён в модели Products:', productsModel.getItems()); 
//   })
//   .catch( (error) => {
//     console.error('Не удалось получить товары:', error);
//   })

// --- ТЕСТИРОВАНИЕ VIEW ---

// // --- Тестирование Header ---
// console.log('🧪 ТЕСТ Header');

// // функция тестировщик
// function testHeader() {
//   const headerContainer = document.querySelector<HTMLElement>('.header')!; // оператор ! говорит я уверена что значение не null
//   const header = new Header(headerContainer, {
//     on: () => {},
//     emit: (event: string) => console.log(`🔔 Событие ${event} отправлено`),
//     trigger: () => () => {} 
//   } as IEvents); // явно приводим к IEvents; инициализируем Header
//   header.counter = 3; // установим тестовое количество товаров

//   console.log('Header отображается:', headerContainer);

//   return header;
// }
// testHeader();


// // --- Тестирование Gallery ---
// console.log('🧪 ТЕСТ Gallery');

// // функция тестировщик
// function testGallery() {
//   const galleryContainer = document.querySelector<HTMLElement>('.gallery')!;
//   const gallery = new Gallery(galleryContainer);

//   // Создадим тестовые карточки
//   const card1 = document.createElement('div');
//   card1.textContent = 'Товар 1';
//   card1.style.border = '2px double red';
  
//   const card2 = document.createElement('div');
//   card2.textContent = 'Товар 2';
//   card2.style.border = '2px dotted blue';

//   gallery.catalog = [card1, card2]; // сеттер set catalog

//   console.log('✅ Gallery отображает карточки', galleryContainer.innerHTML);
//   return gallery;
// }
// testGallery();


// // --- Тестирование Success ---
// console.log('🧪 ТЕСТ Success');

// // функция тестировщик
// function testSuccess() {
//   const successContainer = cloneTemplate<HTMLElement>('#success');
//   const success = new Success(successContainer, {
//     on: () => {},
//     emit: (event: string) => console.log(`🔔 Событие ${event} отправлено`),
//     trigger: () => () => {}
//   } as IEvents); // явно приводим к IEvents; инициализируем Success
//   success.total = 3000; // установим тестовую сумму

//   document.body.appendChild(success.render());
//   console.log('✅ Success отображается');
  
//   return success;
// }
// testSuccess();


// --- ТЕСТИРОВАНИЕ КАРТОЧЕК ---

// --- ТЕСТЫ КАРТОЧЕК (консоль) ---

console.log('🧪 ТЕСТ CardCatalog');
function testCardCatalog() {
  const product = apiProducts.items[0];
  const template = cloneTemplate<HTMLElement>('#card-catalog');
  
  const card = new CardCatalog(template, {
    on: () => {},
    emit: (event: string, data?: any) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  } as IEvents);

  card.render(product);
  console.log('✅ CardCatalog:', product.title);
  
  template.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  console.log('   → событие product:open отправлено');
}

console.log('🧪 ТЕСТ CardPreview');
function testCardPreview() {
  const productWithPrice = apiProducts.items[0];
  const productNoPrice = apiProducts.items[2];

  const tmpl1 = cloneTemplate<HTMLElement>('#card-preview');
  const card1 = new CardPreview(tmpl1, {
    on: () => {},
    emit: (event: string, data?: any) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  } as IEvents);
  card1.render(productWithPrice);
  console.log('✅ CardPreview (с ценой):', productWithPrice.title);

  tmpl1.querySelector('.card__button')
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  console.log('   → событие product:add-to-cart отправлено');

  card1.updateButtonState(true, productWithPrice.price);
  tmpl1.querySelector('.card__button')
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  console.log('   → событие product:remove-from-cart отправлено');

  const tmpl2 = cloneTemplate<HTMLElement>('#card-preview');
  const card2 = new CardPreview(tmpl2, {
    on: () => {},
    emit: (event: string, data?: any) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  } as IEvents);
  card2.render(productNoPrice);
  console.log('✅ CardPreview (без цены):', productNoPrice.title);

  card2.updateButtonState(false, null);
  const btnText = tmpl2.querySelector('.card__button')?.textContent;
  console.assert(btnText === 'Недоступно', `❌ Ожидалось "Недоступно", получено "${btnText}"`);
  console.log('   → кнопка показывает "Недоступно"');
}

console.log('🧪 ТЕСТ CardBasket');
function testCardBasket() {
  const product = apiProducts.items[0];
  const template = cloneTemplate<HTMLElement>('#card-basket');
  
  const card = new CardBasket(template, {
    on: () => {},
    emit: (event: string, data?: any) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  } as IEvents);

  card.index = 1;
  card.render(product);
  console.log('✅ CardBasket:', product.title, '- номер', template.querySelector('.basket__item-index')?.textContent);

  template.querySelector('.basket__item-delete')
    ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  console.log('   → событие basket:remove отправлено');
}

testCardCatalog();
testCardPreview();
testCardBasket();
console.log('🎉 Тесты карточек пройдены!');



// --- ТЕСТ MODAL ---

console.log('🧪 ТЕСТ Modal');
function testModal() {
  const modalContainer = document.querySelector<HTMLElement>('.modal')!;
  
  const modal = new Modal(modalContainer, {
    on: () => {},
    emit: (event: string) => console.log(`🔔 ${event}`),
    trigger: () => () => {}
  } as IEvents);

  // Тест setContent + open
  const testDiv = document.createElement('div');
  testDiv.textContent = 'Тестовый контент';
  modal.setContent(testDiv);

  const isOpen = modalContainer.classList.contains('modal_active');
  console.assert(isOpen, '❌ Modal не открылся после setContent');
  console.log('✅ Modal открылся через setContent');

  // Тест close
  modal.close();
  const isClosed = !modalContainer.classList.contains('modal_active');
  console.assert(isClosed, '❌ Modal не закрылся');
  console.log('✅ Modal закрылся через close');

  // Тест render с data
  const testDiv2 = document.createElement('div');
  testDiv2.textContent = 'Контент через render';
  modal.render({ content: testDiv2 });

  const isOpenAfterRender = modalContainer.classList.contains('modal_active');
  console.assert(isOpenAfterRender, '❌ Modal не открылся после render');
  console.log('✅ Modal открылся через render');

  // Закрываем для чистоты
  modal.close();
  console.log('✅ Modal: все тесты пройдены');
}

testModal();

// --- ДЕМОНСТРАЦИЯ В БРАУЗЕРЕ ---

console.log('👀 Отображаем карточки на странице...');

const catalogTmpl = cloneTemplate<HTMLElement>('#card-catalog');
const catalogCard = new CardCatalog(catalogTmpl, {
  on: () => {},
  emit: (event, data) => console.log(`🔔 ${event}`, data),
  trigger: () => () => {}
} as IEvents);
catalogCard.render(apiProducts.items[0]);
document.querySelector('.gallery')?.appendChild(catalogTmpl);

const previewTmpl = cloneTemplate<HTMLElement>('#card-preview');
const previewCard = new CardPreview(previewTmpl, {
  on: () => {},
  emit: (event, data) => console.log(`🔔 ${event}`, data),
  trigger: () => () => {}
} as IEvents);
previewCard.render(apiProducts.items[0]);
document.querySelector('.gallery')?.appendChild(previewTmpl);

const previewNoPriceTmpl = cloneTemplate<HTMLElement>('#card-preview');
const previewNoPriceCard = new CardPreview(previewNoPriceTmpl, {
  on: () => {},
  emit: (event, data) => console.log(`🔔 ${event}`, data),
  trigger: () => () => {}
} as IEvents);
previewNoPriceCard.render(apiProducts.items[2]);
document.querySelector('.gallery')?.appendChild(previewNoPriceTmpl);

const basketTmpl = cloneTemplate<HTMLElement>('#basket');
const basketList = basketTmpl.querySelector('.basket__list')!;

apiProducts.items.slice(0, 3).forEach((product, i) => {
  const cardTmpl = cloneTemplate<HTMLElement>('#card-basket');
  const card = new CardBasket(cardTmpl, {
    on: () => {},
    emit: (event, data) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  } as IEvents);
  card.index = i + 1;
  card.render(product);
  basketList.appendChild(cardTmpl);
});

const totalPrice = apiProducts.items
  .slice(0, 3)
  .reduce((sum, p) => sum + (p.price ?? 0), 0);
const priceEl = basketTmpl.querySelector('.basket__price');
if (priceEl) priceEl.textContent = `${totalPrice} синапсов`;

document.querySelector('.gallery')?.after(basketTmpl);
console.log('✅ Карточки отображены на странице');

// --- ДЕМО МОДАЛКИ ---

const modalContainer = document.querySelector<HTMLElement>('.modal')!;
const modal = new Modal(modalContainer, {
  on: () => {},
  emit: (event: string) => console.log(`🔔 ${event}`),
  trigger: () => () => {}
} as IEvents);

// Берём уже созданную карточку превью и открываем в модалке
const previewDemo = cloneTemplate<HTMLElement>('#card-preview');
const previewCardDemo = new CardPreview(previewDemo, {
  on: () => {},
  emit: (event, data) => console.log(`🔔 ${event}`, data),
  trigger: () => () => {}
} as IEvents);
previewCardDemo.render(apiProducts.items[0]);

modal.setContent(previewDemo);
console.log('👀 Модалка открыта с карточкой превью');

// --- ТЕСТ BASKET ---

console.log('🧪 ТЕСТ Basket');

function testBasket() {
  const basketTmpl = cloneTemplate<HTMLElement>('#basket');
  
  const basket = new Basket(basketTmpl, {
    on: () => {},
    emit: (event: string) => console.log(`🔔 ${event}`),
    trigger: () => () => {}
  } as IEvents);

  // Создаём карточки для корзины
  const cards: HTMLElement[] = [];
  apiProducts.items.slice(0, 3).forEach((product, i) => {
    const cardTmpl = cloneTemplate<HTMLElement>('#card-basket');
    const card = new CardBasket(cardTmpl, {
      on: () => {},
      emit: (event, data) => console.log(`🔔 ${event}`, data),
      trigger: () => () => {}
    } as IEvents);
    card.index = i + 1;
    card.render(product);
    cards.push(cardTmpl);
  });

  // Устанавливаем товары
  basket.items = cards;
  console.log('✅ Basket: товары добавлены');

  // Устанавливаем сумму
  const total = apiProducts.items.slice(0, 3).reduce((sum, p) => sum + (p.price ?? 0), 0);
  basket.totalCost = total;
  console.log('✅ Basket: сумма', total);

  // Проверяем кнопку
  basket.setCheckoutEnabled(true);
  console.assert(!basketTmpl.querySelector('.basket__button')?.hasAttribute('disabled'), '❌ Кнопка должна быть активна');
  console.log('✅ Basket: кнопка активна');

  basket.setCheckoutEnabled(false);
  console.assert(basketTmpl.querySelector('.basket__button')?.hasAttribute('disabled'), '❌ Кнопка должна быть неактивна');
  console.log('✅ Basket: кнопка неактивна');

  // Пустая корзина
  basket.items = [];
  basket.totalCost = 0;
  basket.setCheckoutEnabled(false);
  console.log('✅ Basket: пустая корзина (CSS покажет "Корзина пуста")');

  console.log('✅ Basket: все тесты пройдены');

  // --- ДЕМО корзины в модалке --- закомнтить чтобы пооверить пустую корзину
  // Возвращаем товары обратно для демонстрации
  basket.items = cards;
  basket.totalCost = total;
  basket.setCheckoutEnabled(true);

  const modalContainer = document.querySelector<HTMLElement>('.modal')!;
  const modal = new Modal(modalContainer, {
    on: () => {},
    emit: (event: string) => console.log(`🔔 ${event}`),
    trigger: () => () => {}
  } as IEvents);

  modal.setContent(basketTmpl);
  console.log('👀 Корзина открыта в модалке');

  //  // --- ДЕМО пустой корзины в модалке --- закоментить
  // // Оставляем корзину пустой для визуальной проверки
  // const modalContainer = document.querySelector<HTMLElement>('.modal')!;
  // const modal = new Modal(modalContainer, {
  //   on: () => {},
  //   emit: (event: string) => console.log(`🔔 ${event}`),
  //   trigger: () => () => {}
  // } as IEvents);

  // modal.setContent(basketTmpl);
  // console.log('👀 Пустая корзина открыта в модалке');
}

testBasket();



// --- ТЕСТ OrderForm ---

console.log('🧪 ТЕСТ OrderForm');

function testOrderForm() {
  const orderTmpl = cloneTemplate<HTMLFormElement>('#order');
  orderTmpl.name = 'order'; // важно для событий

  const events: IEvents = {
    on: () => {},
    emit: (event: string, data?: any) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  };

  const orderForm = new OrderForm(orderTmpl, events);

  // Тест переключения оплаты
  console.log('1. Переключаем оплату на card');
  orderForm.payment = 'card';
  const cardBtn = orderTmpl.querySelector('[name="card"]');
  console.assert(cardBtn?.classList.contains('button_alt-active'), '❌ Кнопка card не активна');
  console.log('   ✅ Кнопка card активна');

  console.log('2. Переключаем оплату на cash');
  orderForm.payment = 'cash';
  const cashBtn = orderTmpl.querySelector('[name="cash"]');
  console.assert(cashBtn?.classList.contains('button_alt-active'), '❌ Кнопка cash не активна');
  console.assert(!cardBtn?.classList.contains('button_alt-active'), '❌ Кнопка card осталась активной');
  console.log('   ✅ Кнопка cash активна, card неактивна');

  // Тест ошибок
  console.log('3. Устанавливаем ошибку');
  orderForm.valid = false;
  orderForm.error = 'Заполните адрес';
  const errorEl = orderTmpl.querySelector('.form__errors');
  console.assert(errorEl?.textContent?.includes('Заполните адрес'), '❌ Ошибка не отобразилась');
  console.log('   ✅ Ошибка отображается');

  // Тест состояния кнопки
  console.log('4. Блокируем кнопку');
  const submitBtn = orderTmpl.querySelector<HTMLButtonElement>('.button[type="submit"]')!;
  console.assert(submitBtn.disabled === true, '❌ Кнопка не заблокирована');
  console.log('   ✅ Кнопка заблокирована');

  console.log('5. Разблокируем кнопку');
  orderForm.valid = true;
  console.assert(submitBtn.disabled === false, '❌ Кнопка не разблокирована');
  console.log('   ✅ Кнопка разблокирована');

  // Тест клика по кнопке оплаты
  console.log('6. Симулируем клик по cash');
  cashBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  console.log('   ✅ Событие order:payment:change отправлено');

  console.log('✅ OrderForm: все тесты пройдены');
}

testOrderForm();


// --- ТЕСТ ContactsForm ---

console.log('🧪 ТЕСТ ContactsForm');

function testContactsForm() {
  const contactsTmpl = cloneTemplate<HTMLFormElement>('#contacts');
  contactsTmpl.name = 'contacts'; // важно для событий

  const events: IEvents = {
    on: () => {},
    emit: (event: string, data?: any) => console.log(`🔔 ${event}`, data),
    trigger: () => () => {}
  };

  const contactsForm = new ContactsForm(contactsTmpl, events);

  // Тест ошибок
  console.log('1. Устанавливаем ошибку');
  contactsForm.valid = false;
  contactsForm.error = 'Введите email';
  const errorEl = contactsTmpl.querySelector('.form__errors');
  console.assert(errorEl?.textContent?.includes('Введите email'), '❌ Ошибка не отобразилась');
  console.log('   ✅ Ошибка отображается');

  // Тест состояния кнопки
  console.log('2. Блокируем кнопку');
  const submitBtn = contactsTmpl.querySelector<HTMLButtonElement>('.button[type="submit"]')!;
  console.assert(submitBtn.disabled === true, '❌ Кнопка не заблокирована');
  console.log('   ✅ Кнопка заблокирована');

  console.log('3. Разблокируем кнопку');
  contactsForm.valid = true;
  console.assert(submitBtn.disabled === false, '❌ Кнопка не разблокирована');
  console.log('   ✅ Кнопка разблокирована');

  // Тест ввода в поля
  console.log('4. Симулируем ввод в email');
  const emailInput = contactsTmpl.querySelector<HTMLInputElement>('[name="email"]')!;
  emailInput.value = 'test@test.com';
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('   ✅ Событие contacts:change отправлено');

  console.log('5. Симулируем сабмит');
  submitBtn.click(); // или contactsTmpl.dispatchEvent(new Event('submit'))
  console.log('   ✅ Событие contacts:submit отправлено');

  console.log('✅ ContactsForm: все тесты пройдены');
}

testContactsForm();


// --- ДЕМО ФОРМ В МОДАЛКЕ ---

console.log('👀 Отображаем формы в модалке...');

// OrderForm
const orderDemo = cloneTemplate<HTMLFormElement>('#order');
orderDemo.name = 'order';
const orderFormDemo = new OrderForm(orderDemo, {
  on: () => {},
  emit: (event, data) => console.log(`🔔 ${event}`, data),
  trigger: () => () => {}
} as IEvents);

// ContactsForm
const contactsDemo = cloneTemplate<HTMLFormElement>('#contacts');
contactsDemo.name = 'contacts';
const contactsFormDemo = new ContactsForm(contactsDemo, {
  on: () => {},
  emit: (event, data) => console.log(`🔔 ${event}`, data),
  trigger: () => () => {}
} as IEvents);

// Открываем сначала OrderForm
modal.setContent(orderDemo);
console.log('👀 Модалка с OrderForm');

// Через 3 секунды переключаем на ContactsForm (для демонстрации)
setTimeout(() => {
  modal.setContent(contactsDemo);
  console.log('👀 Модалка с ContactsForm');
}, 3000);