import { IApi } from '../../types/index';
import {
  IProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from '../../types/index';

export class ApiService {
  constructor(private api: IApi) {}

  /**
   * Получает список товаров с сервера.
   * Делегирует запрос переданной реализации IApi.
   */
  async getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  /**
   * Отправляет заказ на сервер.
   * Передаёт данные в формате, который ожидает сервер (строго по Postman).
   */
  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order);
  }
}
