import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../models/product.models';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-search',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {

  keyword: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchControl = new FormControl(''); // Reactive form control for search input
  sortOrder: string = 'asc'; // Default to ascending order
  selectedBrand: string = ''; // Brand selected by the user
  availableBrands: string[] = []; // List of all brands from the results
  selectedProduct: Product | null = null; // To hold the currently selected product
  showReviews = false; // Track if reviews should be displayed

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait 300ms after the user stops typing
        distinctUntilChanged() // Only trigger when the value changes
      )
      .subscribe((keyword) => {
        this.dynamicSearch(keyword);
      });
  }

  search(): void {
    if (this.keyword) {
      this.productService.searchProducts(this.keyword).subscribe(
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

  dynamicSearch(keyword: string | null): void {
    if (keyword && keyword.trim()) {
      this.productService.searchProducts(keyword).subscribe(
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
    } else {
      // Reset products and filters if the input is empty or null
      this.products = [];
      this.filteredProducts = [];
      this.availableBrands = [];
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

  showProductDetails(product: Product): void {
    this.selectedProduct = product;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  toggleReviews(): void {
    this.showReviews = !this.showReviews; // Toggle reviews display
  }
}
