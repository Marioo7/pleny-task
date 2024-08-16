// categories.component.ts

import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CategoryItem {
  id: number;
  title: string;
  count: number;
  selected: boolean;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: CategoryItem[] = [];
  allCategories: { slug: string; name: string; url: string }[] = []; // Handle objects with slug, name, and url
  totalProductsCount: number = 0; // To store the total number of products

  constructor(private products: ProductsService) {}

  ngOnInit(): void {
    this.loadTotalProductsCount();
    this.products.getAllCategories().subscribe((categories) => {
      console.log('Categories:', categories); // Log to verify category data
      this.allCategories = categories;
      this.loadCategoryCounts();
    });
  }

  loadTotalProductsCount(): void {
    this.products.getAllsProducts().subscribe((products) => {
      this.totalProductsCount = products.total;
      this.loadCategoryCounts();
    });
  }

  loadCategoryCounts(): void {
    const categoryObservables = this.allCategories.map((category, index) => {
      const categoryName = category.name; // Extract the name property

      if (typeof categoryName !== 'string' || !categoryName.trim()) {
        console.warn(`Invalid category:`, category);
        return of({
          id: index + 1,
          title: 'Unknown',
          count: 0,
          selected: false,
        });
      }

      return this.products.getCategoryProductCount(categoryName).pipe(
        map((count) => ({
          id: index + 2, // Adjust ID to account for "All" category
          title: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          count,
          selected: false,
        }))
      );
    });

    // Add the "All" category
    const allCategory: Observable<CategoryItem> = of({
      id: 1,
      title: 'All',
      count: this.totalProductsCount,
      selected: false,
    });

    forkJoin([allCategory, ...categoryObservables]).subscribe((categories) => {
      this.categories = categories;
    });
  }
  selectCategory(item: CategoryItem): void {
    this.categories.forEach((cat) => (cat.selected = false));
    item.selected = true;

    if (item.title !== 'All') {
      this.products.setSelectedCategory(item.title); // Load products for the selected category
    } else {
      this.products.setSelectedCategory(''); // Load all products when "All" is selected
    }
  }
}
