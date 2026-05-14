import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from './products-service';
import { BasketService } from '../basket/basket-service';
import { Product } from './products.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: string[] = [];
  categories: string[] = [];
  loading = false;
  errorMessage = '';
  currentPage = 1;
  totalPages = 1;

  // Filter properties
  searchTitle = '';
  searchBrand = '';
  searchCategory = '';

  constructor(private productsService: ProductsService, private basketService: BasketService, private router: Router) {}
     
  ngOnInit(): void {
    this.loadPage(1);
  }
 
  loadPage(page: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.productsService.getProducts(page).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalPages = Math.max(1, Math.ceil(response.total / this.productsService.pageSize));
        this.currentPage = page;
        this.buildFilterOptions();
        this.applyFilters();
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.errorMessage = error?.message || 'Unable to load products.';
        this.loading = false;
      },
    });
  }
 
  private buildFilterOptions(): void {
    const brands = new Set<string>();
    const categories = new Set<string>();

    for (const product of this.products) {
      if (product.brand) {
        brands.add(String(product.brand));
      }
      if (product.category?.name) {
        categories.add(product.category.name);
      }
    }

    this.brands = Array.from(brands).sort();
    this.categories = Array.from(categories).sort();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesTitle =
        !this.searchTitle ||
        product.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesBrand = !this.searchBrand || product.brand === this.searchBrand;
      const matchesCategory =
        !this.searchCategory || product.category?.name === this.searchCategory;
      return matchesTitle && matchesBrand && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.searchBrand = '';
    this.searchCategory = '';
    this.applyFilters();
  }

  get pages(): number[] {
    const delta = 2;
    const range: number[] = [];
    const left = Math.max(1, this.currentPage - delta);
    const right = Math.min(this.totalPages, this.currentPage + delta);
    for (let i = left; i <= right; i++) range.push(i);
    return range;
  }
 
  addToCart(product: Product): void {
    this.basketService.addToCart(product);
    this.router.navigate(['/basket']);
  }
}