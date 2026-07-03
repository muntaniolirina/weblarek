import './scss/styles.scss';

// ТЕСТИРОВАНИЕ

import { IProduct, IBuyer, TPayment } from './types/index';
import { Products } from './components/models/Products';
import { Cart } from './components//models/Cart';
import { Buyer } from './components/models/Buyer';


const testProduct: IProduct = {
  id: '123',
  title: 'Футболка "TypeScript"',
  description: 'Мягкая, удобная, с принтом',
  image: 'https://example.com/tshirt.png',
  category: 'Одежда',
  price: 1500,
};

const testBuyer: IBuyer = {
  payment: 'card',
  email: 'user@example.com',
  phone: '+79990000000',
  address: 'Москва, ул. Пушкина, д. Колотушкина',
};

console.log('✅ Интерфейсы работают! Товар:', testProduct.title);
console.log('✅ Покупатель:', testBuyer.email);


// --- Тестирование Products ---
const productsModel = new Products();

// 1. Сначала проверим пустой массив
console.log('📦 Пустая корзина товаров:', productsModel.getItems());

// 2. Теперь положим туда товары из тестовых данных
import { apiProducts } from './utils/data';
productsModel.setItems(apiProducts.items);

// 3. Проверим, что они сохранились
console.log('✅ Товары загружены:', productsModel.getItems().length, 'товаров');

// 4. Проверим поиск по ID
const firstProduct = productsModel.getItemById(apiProducts.items[0].id);
console.log('🔍 Товар по ID:', firstProduct?.title);

// 5. Проверим работу с выбранным товаром
productsModel.setSelectedItem(firstProduct ?? null);
console.log('👀 Выбран товар:', productsModel.getSelectedItem()?.title);

productsModel.setSelectedItem(null);
console.log('❌ После сброса selectedItem:', productsModel.getSelectedItem());


// --- Тест Cart ---

const cart = new Cart();

console.log('🛒 Пустая корзина, count:', cart.getCount()); // 0

// Добавляем товары
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[0]); // Попытка добавить дубль

console.log('Добавили товары в корзину. Корзина:', cart);
console.log('✅ Дубль не добавлен, count:', cart.getCount()); // Должно быть 2
console.log('📦 Товары в корзине:', cart.getItems().map(p => p.title));

// Проверка суммы
console.log('💰 Сумма:', cart.getTotalPrice()); // Сумма двух товаров

// Удаляем один товар
cart.removeItem(apiProducts.items[0].id);
console.log('✅ Товар удалён, count:', cart.getCount()); // Должно быть 1
console.log('❌ Товар 0 больше не в корзине:', !cart.hasItem(apiProducts.items[0].id)); // true

// Очищаем корзину
cart.clear();
console.log('🗑️ Корзина очищена, count:', cart.getCount()); // 0
console.log('🧺 Пустой массив:', cart.getItems().length === 0); // true




// ТЕст Buyer

console.log('🚀 Запускаем полный тест класса Buyer\n');

const buyer = new Buyer();

// --- Тест 1: Проверяем дефолтное состояние сразу после new ---
console.log('🧪 Тест 1: Дефолтные значения');
const initialData = buyer.getData();
console.log('Данные:', initialData);

if (initialData.payment === '' && initialData.address === '' &&
    initialData.phone === '' && initialData.email === '') {
  console.log('✅ Дефолт верный: все поля пустые, payment = ""\n');
} else {
  console.error('❌ Ошибка: дефолтные значения не совпадают с ожидаемыми\n');
}

// --- Тест 2: Частичное обновление (setData) ---
console.log('🧪 Тест 2: setData (частичное обновление)');
buyer.setData({
  email: 'test@example.com',
  phone: '+79990000000',
});

const afterSet = buyer.getData();
console.log('После setData:', afterSet);

// Проверяем, что обновились только email и phone, а остальные остались пустыми
if (afterSet.email === 'test@example.com' && afterSet.phone === '+79990000000' &&
    afterSet.address === '' && afterSet.payment === '') {
  console.log('✅ setData работает: обновил только переданные поля\n');
} else {
  console.error('❌ Ошибка: setData изменил лишние поля или не обновил нужные\n');
}

// --- Тест 3: Валидация на частично заполненных данных ---
console.log('🧪 Тест 3: validate (частично заполненные данные)');
const errorsPartial = buyer.validate();
console.log('Ошибки валидации:', errorsPartial);

// Ожидаем ошибки по payment и address (они пустые), email и phone — ок
const hasPaymentError = !!errorsPartial.payment;
const hasAddressError = !!errorsPartial.address;
const noEmailPhoneError = !errorsPartial.email && !errorsPartial.phone;

if (hasPaymentError && hasAddressError && noEmailPhoneError) {
  console.log('✅ Валидация ловит пустые обязательные поля (payment, address)\n');
} else {
  console.error('❌ Валидация не отработала как ожидалось\n');
}

// --- Тест 4: Заполняем всё и проверяем, что ошибок нет ---
console.log('🧪 Тест 4: validate (все поля заполнены)');
buyer.setData({
  payment: 'cash',
  address: 'Москва, ул. Пушкина, д. 1',
});

const errorsAllFilled = buyer.validate();
console.log('Ошибки после полного заполнения:', errorsAllFilled);

if (Object.keys(errorsAllFilled).length === 0) {
  console.log('✅ Валидация пройдена: ошибок нет\n');
} else {
  console.error('❌ Есть лишние ошибки валидации\n');
}

// --- Тест 5: Сброс (clear) ---
console.log('🧪 Тест 5: clear (сброс данных)');
buyer.clear();
const clearedData = buyer.getData();
console.log('После clear:', clearedData);

if (clearedData.payment === '' && clearedData.address === '' &&
    clearedData.phone === '' && clearedData.email === '') {
  console.log('✅ clear работает: все поля сброшены в начальное состояние\n');
} else {
  console.error('❌ clear не сбросил все поля\n');
}

// --- Тест 6: Валидация сразу после сброса ---
console.log('🧪 Тест 6: validate сразу после clear');
const errorsAfterClear = buyer.validate();
console.log('Ошибки после clear:', errorsAfterClear);

if (errorsAfterClear.payment && errorsAfterClear.address &&
    errorsAfterClear.phone && errorsAfterClear.email) {
  console.log('✅ После clear валидация снова требует заполнить все поля\n');
} else {
  console.error('❌ После clear валидация не требует заполнения полей\n');
}

console.log('🎉 Все тесты завершены!');