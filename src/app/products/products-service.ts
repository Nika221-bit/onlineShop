import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsInterface } from './products.interface';

type ProductsResponse = ProductsInterface;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private base_url = 'https://api.everrest.educata.dev/shop/products/all';
  readonly pageSize = 10;

  constructor(private http: HttpClient) {}

  getProducts(pageIndex: number): Observable<ProductsResponse> {
    const url = `${this.base_url}?page_index=${pageIndex}&page_size=${this.pageSize}`;
    return this.http.get<ProductsResponse>(url);
  }
}