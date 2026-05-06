import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsInterface } from './products-interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi1 {
  private readonly apiUrl = 'https://api.everrest.educata.dev/shop/products/all';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsInterface> {
    return this.http.get<ProductsInterface>(this.apiUrl);
  }
}

