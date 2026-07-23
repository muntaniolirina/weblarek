import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

/**
 * Корзина
 * Управление списком товаров в корзине, подсчет количества и общей стоимости.
 * Уведомляет Презентер через события при любом изменении состава корзины
 */
export class Cart {
  /** Массив товаров в корзине, по умолчанию пустой */
  private items: IProduct[] = [];

  /**
   * @param events - брокер событий для уведомления Презентера
   */
  constructor(protected events: IEvents) {}

  /**
   * Возвращает массив товаров в корзине
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Добавляет товар в корзину, если его там ещё нет.
   * После добавления эмитит событие cart:changed, чтобы Презентер обновил интерфейс
   * (счётчик на иконке корзины, список в корзине, общую сумму)
   * 
   * @param item - товар для добавления
   */
  addItem(item: IProduct): void {
    // Проверяем: если товара с таким id ещё нет в корзине — добавляем
    if (!this.hasItem(item.id)) {
      this.items.push(item);
      this.emitChange(); // уведомляем об изменении состава корзины
    }
  }

  /**
   * Удаляет товар из корзины по его id.
   * После удаления эмитит событие cart:changed
   * 
   * @param id - уникальный идентификатор товара для удаления
   */
  removeItem(id: string): void {
    // filter оставляет только те товары, у которых id не совпадает с переданным
    this.items = this.items.filter(product => product.id !== id);
    this.emitChange(); // уведомляем об изменении состава корзины
  }

  /**
   * Очищает корзину (удаляет все товары).
   * Используется после успешной отправки заказа.
   * Эмитит событие cart:changed
   */
  clear(): void {
    this.items = [];
    this.emitChange(); // уведомляем об изменении состава корзины
  }

  /**
   * Вычисляет общую стоимость всех товаров в корзине.
   * Если у товара нет цены (price = null), он считается как 0
   * 
   * @returns общая сумма всех товаров в корзине
   */
  getTotalPrice(): number {
    // reduce — проходит по каждому товару и накапливает сумму
    return this.items.reduce((total, product) => {
      // Если price = null, используем 0 (через ?? — оператор нулевого слияния)
      const priceToAdd = product.price ?? 0;
      return total + priceToAdd;
    }, 0); // начальное значение суммы — 0
  }

  /**
   * Возвращает количество товаров в корзине
   */
  getCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет, есть ли товар с указанным id в корзине
   * 
   * @param id - уникальный идентификатор товара
   * @returns true — товар есть в корзине, false — товара нет
   */
  hasItem(id: string): boolean {
    // some() возвращает true, если хотя бы один товар подходит под условие
    return this.items.some(product => product.id === id);
  }

  /**
   * Приватный вспомогательный метод.
   * Собирает актуальные данные о корзине и эмитит событие cart:changed.
   * Вызывается из addItem, removeItem и clear, чтобы не дублировать код.
   * 
   * Передаёт Презентеру три параметра:
   * - items — массив товаров (для отображения списка)
   * - total — общая сумма (для отображения цены)
   * - count — количество товаров (для счётчика на иконке корзины)
   */
  private emitChange(): void {
    this.events.emit('cart:changed', {
      items: this.items,
      total: this.getTotalPrice(),
      count: this.getCount()
    });
  }
}