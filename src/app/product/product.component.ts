import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.models';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  keyword: string = '';
  sortOrder: string = 'asc'; // Default to ascending order
  selectedBrand: string = ''; // Brand selected by the user
  availableBrands: string[] = []; // List of all brands from the results

  constructor(private productService: ProductService) { }

  ngOnInit(): void { }

  search(): void {
    if (this.keyword) {
      this.productService.getProducts(this.keyword).subscribe(
        (data: Product[]) => {
          this.products = data;
          this.filteredProducts = [...this.products]; // Initialize filtered products
          this.updateAvailableBrands(); // Extract unique brands
          this.applyFiltersAndSort(); // Apply sorting and filtering after receiving data
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
    }
  }

  applyFiltersAndSort(): void {
    // Filter first
    this.filteredProducts = this.selectedBrand
      ? this.products.filter((product) => product.brand === this.selectedBrand)
      : [...this.products];

    // Then sort
    this.filteredProducts.sort((a, b) => {
      return this.sortOrder === 'asc'
        ? a.rating - b.rating
        : b.rating - a.rating;
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSort();
  }

  updateAvailableBrands(): void {
    this.availableBrands = Array.from(
      new Set(this.products.map((product) => product.brand))
    );
  }

  onBrandChange(): void {
    this.applyFiltersAndSort();
  }

}
