import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from './products-service';
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
  loading = false;
  errorMessage = '';

  // Filter properties
  searchTitle = '';
  searchBrand = '';
  searchCategory = '';

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data.products.map((product, index) => ({
          ...product,
          id: product.id || index + 1 // Assign ID if missing
        }));
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesTitle = this.searchTitle === '' || product.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesBrand = this.searchBrand === '' || product.brand.toLowerCase().includes(this.searchBrand.toLowerCase());
      const matchesCategory = this.searchCategory === '' || product.category.toLowerCase().includes(this.searchCategory.toLowerCase());
      return matchesTitle && matchesBrand && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.searchBrand = '';
    this.searchCategory = '';
    this.applyFilters();
  }
}
