import { Injectable } from '@angular/core';
import { Product } from '../../types/products.type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable()
export class ProductsService {
  domain = environment.domain;

  constructor(private httpClient: HttpClient) { }

  getAllProducts(query?: string): Observable<Product[]>{
    let url: string = `${this.domain}/products`;
    if(query){
      url += '?' + query
    }
    return this.httpClient.get<Product[]>(url);
  }

  getProduct(id: number): Observable<Product[]>{
    const url: string = `${this.domain}/products/` + id;
    return this.httpClient.get<Product[]>(url);
  }
}
