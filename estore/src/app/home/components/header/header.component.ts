import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import {
  faSearch,
  faUserCircle,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { CategoriesStoreItem } from '../../services/category/categories.storeItem';
import { SearchKeyWord } from '../../types/searchKeyword.type';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CartStoreItem } from '../../services/cart/cart.storeItem';
import { UserService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  faSearch = faSearch;
  faUserCircle = faUserCircle;
  faShoppingCart = faShoppingCart;
  subscription: Subscription = new Subscription();

  displaySearch: boolean = true;
  isUserAuthenticated: boolean = false;
  userName: string = '';

  @Output() searchClicked: EventEmitter<SearchKeyWord> =
    new EventEmitter<SearchKeyWord>();

  constructor(
    public categoryStore: CategoriesStoreItem,
    private router: Router,
    public cartStore: CartStoreItem,
    public userService: UserService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(
        (event) =>
          (this.displaySearch =
            (event as NavigationEnd).url === '/home/products' ? true : false)
      );

    this.subscription.add(
      this.userService.isUserAuthenticated$.subscribe((result) => {
        this.isUserAuthenticated = result;
      })
    );

    this.subscription.add(
      this.userService.loggedInUser$.subscribe((result) => {
        this.userName = result.firstName;
      })
    );
  }

  onClickSearch(keyword: string, categoryId: string): void {
    this.searchClicked.emit({
      categoryId: parseInt(categoryId),
      keyword: keyword,
    });
  }

  navigateToCart(): void {
    this.router.navigate(['home/cart']);
  }

  pastOrders(): void {
    this.router.navigate(['home/pastorders']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['home/products'])
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
