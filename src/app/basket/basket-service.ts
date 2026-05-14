import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/products.interface';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private cartItems = new BehaviorSubject<Array<{ product: Product; quantity: number }>>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(product: Product): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.product._id === product._id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ product, quantity: 1 });
    }
    this.cartItems.next([...currentItems]);
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems.value.filter(item => item.product._id !== productId);
    this.cartItems.next(currentItems);
  }

  changeQuantity(productId: string, delta: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(i => i.product._id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItems.next([...currentItems]);
      }
    }
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.product.price.current * item.quantity, 0);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}