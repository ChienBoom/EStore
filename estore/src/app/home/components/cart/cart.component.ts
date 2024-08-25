import { Component, OnDestroy, OnInit } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartStoreItem } from '../../services/cart/cart.storeItem';
import { Router } from '@angular/router';
import { CartItem, DeliveryAddress } from '../../types/cart.type';
import { UserService } from '../../services/user/user-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggedInUser } from '../../types/user.type';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  orderForm: FormGroup;
  user: LoggedInUser;
  subscriptions: Subscription = new Subscription();
  alertType: number = 0;
  alertMessage: string = '';
  disableCheckout: boolean = false;

  constructor(
    public cartStore: CartStoreItem,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.user = {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      pin: '',
      email: ''
    };

    this.userService.loggedInUser$.subscribe((loggedUser) => {
      if (loggedUser.firstName) {
        this.user = loggedUser;
      }
    });
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      name: [
        `${this.user.firstName} ${this.user.lastName ? this.user.lastName : ''}`,
        Validators.required,
      ],
      address: [this.user.address, Validators.required],
      city: [this.user.city, Validators.required],
      state: [this.user.state, Validators.required],
      pin: [this.user.pin, Validators.required],
    });
  }

  onSubmit(): void {
    if(this.userService.isUserAuthenticated){
      const deliveryAddress: DeliveryAddress = {
        userName: this.orderForm.get('name')?.value,
        address: this.orderForm.get('address')?.value,
        city: this.orderForm.get('city')?.value,
        state: this.orderForm.get('state')?.value,
        pin: this.orderForm.get('pin')?.value
      };
      this.subscriptions.add(
        this.orderService.saveOrder(deliveryAddress, this.user.email).subscribe(
          {
            next: result => {
              this.cartStore.clearCart();
              this.alertType = 0;
              this.alertMessage = 'Order registered successfully!';
              this.disableCheckout = true;
            },
            error: (error) => {
              this.alertType = 2;
              if(error.error.message === 'Authorization failed!'){
                this.alertMessage = 'Please log in to register your order';
              }else{
                this.alertMessage = error.error.message;
              }
            }
          }
        )
      )
    }
  }

  navigateToHome(): void {
    this.router.navigate(['home/products']);
  }

  updateQuantity(event: any, cartItem: CartItem): void {
    if (event.target.innerText === '+') {
      this.cartStore.addProduct(cartItem.product);
    } else if (event.target.innerText === '-') {
      this.cartStore.decreaseProductQuantity(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartStore.removeProduct(cartItem);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
