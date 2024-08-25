import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { UserService } from './user-service.service';
import { map } from 'rxjs';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  return inject(UserService).isUserAuthenticated$.pipe(
    map((isAuthenticated) =>
      isAuthenticated
        ? true
        : createUrlTreeFromSnapshot(next, ['/', 'home', 'login'])
    )
  );
};
