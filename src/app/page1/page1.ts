import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ServiceApi1 } from '../service-api1';
import { Product, ProductsInterface } from '../products-interface';

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [NgFor, NgIf,],
  templateUrl: './page1.html',
  styleUrls: ['./page1.scss'],
})
export class Page1 implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';

  constructor(private onlineShopService: ServiceApi1) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.onlineShopService.getProducts().subscribe({
      next: (data: ProductsInterface) => {
        this.products = data.products;
        this.loading = false;
        console.log('=== API Response ===', data);
      },
      error: (error: unknown) => {
        console.error('API load failed', error);
        this.errorMessage = 'Unable to load products. Refresh the page or try again later.';
        this.loading = false;
      },
    });
  }
}

