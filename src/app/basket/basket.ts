import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketService } from './basket-service';
import { Product } from '../products/products.interface';

@Component({
  selector: 'app-basket',
  imports: [CommonModule],
  templateUrl: './basket.html',
  styleUrls: ['./basket.scss'],
})
export class Basket implements OnInit {
  cartItems: Array<{ product: Product; quantity: number }> = [];

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeFromCart(productId: string): void {
    this.basketService.removeFromCart(productId);
  }

  changeQuantity(productId: string, delta: number): void {
    this.basketService.changeQuantity(productId, delta);
  }

  get cartTotal(): number {
    return this.basketService.getCartTotal();
  }

  get cartCount(): number {
    return this.basketService.getCartCount();
  }

  clearCart(): void {
    this.basketService.clearCart();
  }
}
