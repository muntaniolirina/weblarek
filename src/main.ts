import './scss/styles.scss';

import { TPayment } from './types/index';

import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { apiProducts } from './utils/data';

import { ApiService } from './components/services/ApiService';
import { IApi } from './types/index';
import { IProductsResponse } from './types/index';
import { API_URL } from './utils/constants';
import { ApiPostMethods } from './types/index';

//--- ТЕСТИРОВАНИЕ ---

console.log('=== Проверка моделей данных (с apiProducts) ===');

// --- Тестирование Products ---
console.log('📦 ТЕСТ Products');
const productsModel = new Products();  // создаем экземпляр Products

console.log('1. Пустая модель:', productsModel.getItems()); 

productsModel.setItems(apiProducts.items);  // сохраняем массив поступивших данных
console.log('2. После setItems:', productsModel.getItems().length, 'товаров'); // Должно совпадать с apiProducts.items.length

const firstProduct = productsModel.getItemById(apiProducts.items[0].id);
console.log('3. Товар по ID:', firstProduct?.title); // Должен вывести название первого товара

productsModel.setSelectedItem(firstProduct ?? null);
console.log('4. Выбранный товар:', productsModel.getSelectedItem()?.title);

productsModel.setSelectedItem(null);
console.log('5. После сброса selectedItem:', productsModel.getSelectedItem()); // Должно быть null

console.log(''); // пустая строка для разделения в консоли


// --- Тестирование Cart ---
console.log('🛒 ТЕСТ Cart');
const cart = new Cart(); // создаем экземпляр Cart

cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[0]); // Попытка добавить дубль

console.log('1. Количество товаров (дубль не должен добавиться):', cart.getCount()); // Должно быть 2
console.log('2. Товары в корзине:', cart.getItems().map(product => product.title)); // перебираем товары в корзине и получаем их title

console.log('3. Стоимость каждого товара', cart.getItems().map(product => product.price)); // узнаем цену кажого товара (для наглядности)

console.log('4. Сумма корзины:', cart.getTotalPrice()); // Сумма товаров

console.log('5. Есть ли товар с id:', apiProducts.items[2].id, '- в корзине? Ответ:', cart.hasItem(apiProducts.items[2].id)); // false

cart.removeItem(apiProducts.items[0].id); // удаляем товар из корзины
console.log('6. После удаления товара ID 0, count:', cart.getCount()); // Должно быть 1

cart.clear(); // очищаем корзину
console.log('7. После clear, count:', cart.getCount()); // Должно быть 0

console.log('');  // пустая строка для разделения в консоли


// --- Тестирование Buyer ---
console.log('🚀 ТЕСТ Buyer');
const buyer = new Buyer(); // создаем экземпляр Buyer

const initialData = buyer.getData(); // исходный объект
console.log('1. Дефолтные значения:', initialData);
if (initialData.payment === '' && initialData.address === '' &&
    initialData.phone === '' && initialData.email === '') {
  console.log('✅ Дефолт верный');
} else {
  console.error('❌ Дефолт не совпадает');
}

// Частичное обновление из данных, которые могли бы прийти из формы
buyer.setData({
  email: 'hello@example.com',
  phone: '+79990000000',
});
const afterSet = buyer.getData();  // получаем обновленный объект
console.log('2. После setData:', afterSet);
if (afterSet.email === 'hello@example.com' && afterSet.phone === '+79990000000' &&
    afterSet.address === '' && afterSet.payment === '') {
  console.log('✅ setData корректно обновил переданные поля и не тронул остальные');
} else {
  console.error('❌ setData сработал некорректно: поля не обновились или изменились лишние');
}

const errorsPartial = buyer.validate();
console.log('3. Ошибки валидации (частично заполнено):', errorsPartial);
if (errorsPartial.payment && errorsPartial.address) {
  console.log('✅ Валидация ловит пустые обязательные поля');
} else {
  console.error('❌ Валидация не отработала');
}

//Проверка на полное заполнение и корректности payment
console.log('4. Полное заполнение и проверка валидации');
buyer.setData({
  payment: 'cash',
  address: 'Москва, ул. Пушкина, д. 1',
});

const errorsAllFilled = buyer.validate();
const currentPayment = buyer.getData().payment;
const validOptions : TPayment[] = ['card', 'cash'];

// Сначала смотрим, что вернула валидация
if (Object.keys(errorsAllFilled).length > 0) {
  // Случай 1: валидация нашла ошибки
  console.error('❌ Валидация НЕ пройдена: найдены ошибки по полям:', errorsAllFilled);
} else if (!validOptions.includes(currentPayment as TPayment)) {
  // Случай 2: ошибок нет, но payment какой-то «левый»
  console.error(`❌ Валидация НЕ пройдена: payment = "${currentPayment}" — недопустимое значение. Разрешены: ${validOptions.join(', ')}`);
} else {
  // Случай 3: всё ок
  console.log(`✅ Валидация ПРОЙДЕНА: ошибок нет, payment = "${currentPayment}" корректен`);
}

buyer.clear();
const clearedData = buyer.getData();
console.log('5. Данные после clear:', clearedData);
if (clearedData.payment === '' && clearedData.address === '' &&
    clearedData.phone === '' && clearedData.email === '') {
  console.log('✅ clear() сбросил все поля');
} else {
  console.error('❌ clear() не сработал');
}

console.log('🎉 Ура! Все тесты пройдены!');


// --- ЗАПРОСЫ ---

//Реализуем интерфейс IApi
const realApiClient : IApi = {
  async get<T>(uri: string): Promise<T> {

    const url = `${API_URL}${uri}`;
    const response = await fetch(url);

    if(!response.ok) {
      throw new Error(`Ошибка сети: ${response.status}`);
    }

    return (await response.json()) as T;
  },
  // эти параметры (_uri: string, _data: object, _method?: ApiPostMethods)сейчас не используются, но они нужен по сигнатуре интерфейса. Поэтому символ _
  async post<T extends object>(_uri: string, _data: object, _method?: ApiPostMethods): Promise<T> {
    throw new Error('Метод post еще не используется. Но требуется интерфейсом')
  },
};

// создаем сервис
const apiService = new ApiService(realApiClient);

// создаем экземпляр каталога
const catalog = new Products();  // Уже создавали ранее в тестах строка 22
console.log('🚀 Начинаем загрузку каталога товаров...');

// делаем запрос через ApiService
apiService.getProducts()
  .then( (response: IProductsResponse) => {
    catalog.setItems(response.items) // сохраняем товары в модель каталога через метод setItems
    
    console.log('📦 Каталог сохранён в модели Products:', catalog.getItems()); 
  })
  .catch( (error) => {
    console.error('Не удалось получить товары:', error);
  })
