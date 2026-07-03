import { IProduct } from "../../types/index";

// Корзина
// управление списком товаров в корзине, подсчет количества и общей стоимости

export class Cart {
  private items: IProduct[] = []; // массив товаров в корзине, по умолчанию пустой

  getItems() : IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) : void {
   // если товара нет в массиве товаров корзины - добавляем - если ест, ничего не делаем
    if( !this.hasItem(item.id) ) {
      this.items.push(item);
    }
  }

  removeItem(id : string) : void {
    const otherItems = this.items.filter( (product) => product.id !== id); // фильтруем товары которые не совпадают с переданным id -> получаем новый массив
    this.items = otherItems; // переприсваиваем значение корзины
  }

  clear() : void {
    this.items = [];
  }

  getTotalPrice() : number {
    return this.items.reduce( (totalPrice, product) => {
      const priceToAdd = product.price ?? 0; // защита от null: если цены нет - считаем как 0
      return totalPrice + priceToAdd;  // возвращаем новую сумму
    }, 0)  // начальное значение суммы - 0
  }

  getCount() : number {
    return this.items.length;
  }

  hasItem(id: string) : boolean {
    return this.items.some( (product) => product.id === id)  // some() вернет true если хотя бы один товар с таким id есть в корзине
  }
}