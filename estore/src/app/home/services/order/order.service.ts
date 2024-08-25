import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartStoreItem } from '../cart/cart.storeItem';
import { UserService } from '../user/user-service.service';
import { DeliveryAddress } from '../../types/cart.type';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import {
  Order,
  OrderItem,
  PastOrder,
  PastOrderProduct,
} from '../../types/order.type';

@Injectable()
export class OrderService {
  domain = environment.domain;

  constructor(
    private httpClient: HttpClient,
    private cartStore: CartStoreItem,
    private userService: UserService
  ) {}

  saveOrder(
    deliveryAddress: DeliveryAddress,
    userEmail: string
  ): Observable<any> {
    const url: string = `${this.domain}/orders/add`;
    const orderDetails: OrderItem[] = [];
    this.cartStore.cart.products.forEach((product) => {
      const orderItem: OrderItem = {
        productId: product.product.id,
        price: product.product.price,
        qty: product.quantity,
        amount: product.amount,
      };
      orderDetails.push(orderItem);
    });

    const order: Order = {
      userName: deliveryAddress.userName,
      address: deliveryAddress.address,
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      pin: deliveryAddress.pin,
      total: this.cartStore.cart.totalAmount,
      userEmail: userEmail,
      orderDetails: orderDetails,
    };
    return this.httpClient.post(url, order, {
      headers: { authorization: this.userService.token },
    });
  }

  getOrders(userEmail: string): Observable<PastOrder[]> {
    const url = `${this.domain}/orders/allorders?userEmail=${userEmail}`;
    return this.httpClient.get<PastOrder[]>(url, {
      headers: { authorization: this.userService.token },
    });
  }

  getOrderProducts(orderId: number): Observable<PastOrderProduct[]> {
    const url = `${this.domain}/orders/orderproducts?orderId=${orderId}`;
    return this.httpClient.get<PastOrderProduct[]>(url, {
      headers: { authorization: this.userService.token },
    });
  }
}
