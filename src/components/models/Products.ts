import { IProduct } from "../../types/index";

// Каталог товаров
// хранение и управление коллекцией товаров каталога, состояние выбранного товара для модального окна.

export class Products {
  private items: IProduct[] = [];  // массив всех товаров, по умолчанию пустой
  private selectedItem: IProduct | null = null; // выбранный товар, по умолчанию пустой

  setItems(items: IProduct[]) : void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find( (product) => product.id === id);
  }
    
  setSelectedItem(item: IProduct | null) : void {
    this.selectedItem = item;
  }

  getSelectedItem() : IProduct | null {
    return this.selectedItem;
  }
}