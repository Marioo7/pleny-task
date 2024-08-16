import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductItem } from '../products/products.service';

export interface Cart{
  products:{
    id: number,
    qty: number
  }[],
}
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: BehaviorSubject<Cart>;
  constructor() {
    this.cart = new BehaviorSubject<Cart>({products: []});
   }

   getCart(): BehaviorSubject<Cart>{
    return this.cart;
   }

   addToCart(product: ProductItem): void{
    const exists = this.cart.value.products.findIndex(ele => ele.id === product.id);
    if(exists > -1){
      let cart = this.cart.value;
      let productsList = this.cart.value.products;
      productsList[exists].qty = productsList[exists].qty + 1;
      cart.products = productsList;
      this.cart.next(cart);
      console.log(this.cart.value);

    }else{
      let cart = this.cart.value;
      cart.products.push({id: product.id, qty: 1});
      this.cart.next(cart);
      console.log(this.cart.value);
    }
   }

}
