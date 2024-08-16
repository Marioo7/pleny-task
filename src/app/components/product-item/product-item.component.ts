import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductItem } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() product: ProductItem = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: '',
    category: '',
    thumbnail: '',
    images: ['','']
  }
  constructor(private cart: CartService) { }

  ngOnInit(): void {
  }

  getPriceAfterDis(): string{
    // to calculate the discount and return price after the discount
    const disAmount = this.product.price * (this.product.discountPercentage / 100);
    return (this.product.price - disAmount).toFixed(2)
  }

  // this function trigers the addToCart function to add new item to our cart
  addToCart():void {
    this.cart.addToCart(this.product);
  }
}
