import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ServiceApi1 } from '../service-api1';
import { Product, ProductsInterface } from '../products-interface';

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [NgFor],
  templateUrl: './page1.html',
  styleUrl: './page1.sass',
})
export class Page1 implements OnInit {
  products: Product[] = [];

  constructor(private onlineShopService: ServiceApi1) {}

  ngOnInit(): void {
    this.onlineShopService.getProducts().subscribe((data: ProductsInterface) => {
      console.log(data);
      this.products = data.products;
    });
  }
}

