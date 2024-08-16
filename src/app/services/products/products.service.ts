import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// an interface for returned data
export interface Products {
  limit: number;
  products: ProductItem[];
  skip: number;
  total: number;
}
export interface Category {
  slug: string;
  name: string;
  url: string;
}
// an interface for products only
export interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private categoreis: BehaviorSubject<string[]>;
  private headerOptions;
  private selectedCategory: BehaviorSubject<string>;
  private products: BehaviorSubject<ProductItem[]>;
  private productsByCategory: BehaviorSubject<ProductItem[]>;
  private productsBySearch: BehaviorSubject<ProductItem[]>;
  constructor(private httpClient: HttpClient) {
    this.categoreis = new BehaviorSubject<string[]>([]);
    this.headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.selectedCategory = new BehaviorSubject<string>('');
    this.products = new BehaviorSubject<ProductItem[]>([]);
    this.productsByCategory = new BehaviorSubject<ProductItem[]>([]);
    this.productsBySearch = new BehaviorSubject<ProductItem[]>([]);
  }

  // products.service.ts

  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(environment.AllCategories);
  }

  getSelectedCategory(): BehaviorSubject<string> {
    return this.selectedCategory;
  }
  setSelectedCategory(category: string): void {
    this.selectedCategory.next(category);
    if (category !== '') {
      // Fetch products by the selected category
      this.httpClient
        .get<Products>(`${environment.ProductsByCategoryApi}${category}`)
        .subscribe((value) => {
          this.productsByCategory.next(value.products);
        });
    } else {
      // Load all products
      this.productsByCategory.next([]);
      this.setAllProducts(1);
    }
  }

  sortProductsByRating(): Observable<ProductItem[]> {
    return this.httpClient
      .get<Products>(`${environment.ProductsSortApi}?sortBy=rating&order=desc`)
      .pipe(map((response) => response.products));
  }
  getCategoryProductCount(category: string): Observable<number> {
    return this.httpClient
      .get<Products>(`${environment.ProductsByCategoryApi}${category}`)
      .pipe(map((response) => response.total));
  }

  getAllProducts(): BehaviorSubject<ProductItem[]> {
    return this.products;
  }
  getAllsProductSort(): Observable<Products> {
    return this.httpClient.get<Products>(`${environment.ProductsSortApi}`);
  }
  getAllsProducts(): Observable<Products> {
    return this.httpClient.get<Products>(`${environment.ProductsApi}`);
  }

  setAllProducts(page: number): void {
    let skip = (page - 1) * 9;
    this.httpClient
      .get<Products>(`${environment.ProductsApi}&skip=${skip}`)
      .subscribe((value) => {
        this.products.next(value.products);
      });
  }
  private setProductsByCategory(): void {
    this.httpClient
      .get<Products>(
        `${environment.ProductsByCategoryApi}${this.selectedCategory.value}`
      )
      .subscribe((value) => {
        this.productsByCategory.next(value.products);
      });
  }
  getProductsByCategory(): BehaviorSubject<ProductItem[]> {
    return this.productsByCategory;
  }
  getProductsBySearch(): BehaviorSubject<ProductItem[]> {
    return this.productsBySearch;
  }

  setProductsBySearch(keyword: string): void {
    if (keyword !== '') {
      this.httpClient
        .get<Products>(`${environment.ProductsBySearchApi}${keyword}`)
        .subscribe((value) => {
          this.productsBySearch.next(value.products);
        });
    } else {
      this.productsBySearch.next([]);
    }
  }
}
