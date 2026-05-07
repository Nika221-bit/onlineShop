import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ServiceApi1 } from '../service-api1';
import { Product, ProductsInterface } from '../products-interface';

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [NgFor,],
  templateUrl: './page1.html',
  styleUrl: './page1.sass',
})
export class Page1 implements OnInit {
  products: Product[] = [];

  constructor(private onlineShopService: ServiceApi1) {}

  ngOnInit(): void {
    this.onlineShopService.getProducts().subscribe((data: ProductsInterface) => {
      console.log('=== API Response ===' );
      console.log(`Total Products: ${data.total}`);
      console.log(`Page: ${data.page}`);
      console.log(`Limit: ${data.limit}`);
      console.log(`Retrieved: ${data.products.length} products`);
      console.log('Products:', data.products);
      
      data.products.forEach((product, index) => {
        console.log(`[${index + 1}] ${product.title}`, product);
      });
      
      this.products = data.products;
      console.log('=== Rendering Complete ===');
    });
  }
}

