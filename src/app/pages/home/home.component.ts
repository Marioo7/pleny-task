import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Cart, CartService } from 'src/app/services/cart/cart.service';
import {
  ProductItem,
  ProductsService,
} from 'src/app/services/products/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  category: string = '';
  allProducts: ProductItem[] = [];
  productsByCategory: ProductItem[] = [];
  productsBySearch: ProductItem[] = [];
  page: number = 1;
  total: number = 100;
  cart: Cart = { products: [] };

  constructor(
    private products: ProductsService,
    private cartServ: CartService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartServ.getCart().subscribe((value) => {
      this.cart = value;
    });
    this.products.getSelectedCategory().subscribe((category) => {
      this.category = category;
      if (category === '') {
        this.products.setAllProducts(this.page);
      }
    });

    this.products.getAllProducts().subscribe((value) => {
      this.allProducts = value;
    });

    this.products.getProductsByCategory().subscribe((value) => {
      this.productsByCategory = value;
    });

    this.products.getProductsBySearch().subscribe((value) => {
      this.productsBySearch = value;
    });
  }

  changePage(page: number) {
    this.page = page;
    this.products.setAllProducts(page);
    this.scrollBackToTop();
  }

  scrollBackToTop(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  sortAllProductsByRating() {
    this.products.sortProductsByRating().subscribe((sortedProducts) => {
      this.allProducts = sortedProducts;
      this.productsByCategory = sortedProducts;
      this.productsBySearch = sortedProducts;
    });
  }
}
