import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

/**
 * Каталог товаров
 * Хранение и управление коллекцией товаров каталога,
 * состояние выбранного товара для модального окна.
 * Уведомляет Презентер через события при изменении данных
 */
export class Products {
  /** Массив всех товаров каталога, по умолчанию пустой */
  private items: IProduct[] = [];

  /** Выбранный товар для отображения в модальном окне, по умолчанию null */
  private selectedItem: IProduct | null = null;

  /**
   * @param events - брокер событий для уведомления Презентера
   */
  constructor(protected events: IEvents) {}

  /**
   * Сохраняет массив товаров каталога.
   * Эмитит событие products:changed, чтобы Презентер обновил отображение каталога на странице
   * 
   * @param items - массив товаров, полученный с сервера
   */
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('products:changed', { items: this.items });
  }

  /**
   * Возвращает весь массив товаров каталога
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Ищет товар по id
   * 
   * @param id - уникальный идентификатор товара
   * @returns товар с указанным id или undefined, если товар не найден
   */
  getItemById(id: string): IProduct | undefined {
    return this.items.find(product => product.id === id);
  }

  /**
   * Устанавливает выбранный товар (для отображения в модальном окне детального просмотра).
   * Эмитит событие product:selected, чтобы Презентер открыл модалку с этим товаром
   * 
   * @param item - выбранный товар или null (если выбор сброшен)
   */
  setSelectedItem(item: IProduct | null): void {
    this.selectedItem = item;
    this.events.emit('product:selected', { item: this.selectedItem });
  }

  /**
   * Возвращает текущий выбранный товар или null
   */
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}