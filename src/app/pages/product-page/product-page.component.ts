import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../components/header/header.component';
import { ReviewsComponent } from '../../components/products/reviews/reviews.component';
import { Product } from '../../models/Product';
import { ProductStore } from '../../store/product.store';

const defaultProduct : Product = {
  category: '',
  description: '',
  id: 0,
  image: '',
  price: 0,
  rating: {
    count: 0,
    rate: 0
  },
  title: ''
};

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [HeaderComponent, ReviewsComponent, MatButtonModule, CommonModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  Allimgs = [
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  ];

  SubImgs = [
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  ];

  numb = signal(0);
  product = signal<Product>(defaultProduct);

  isScrollEnabled = true;


  displayedImgs : string[] = [];

  ImageIndex = 4;

  private productStore = inject(ProductStore);

  ngOnInit(): void {

    // T
    this.product.set(this.productStore.selectedProduct() ?? defaultProduct);

    setInterval(() => {
      if(this.isScrollEnabled) {
        this.onNextClick();
      }
    }, 2000);
    this.displayedImgs = [...this.SubImgs];
  }


  onNextClick() {

    if (this.ImageIndex === this.Allimgs.length - 1) {
      this.ImageIndex = 0;
    } else {
      this.ImageIndex++;
    }

    this.SubImgs.pop();
    this.SubImgs.unshift(this.Allimgs[this.ImageIndex]);
    this.displayedImgs = this.SubImgs;

  }

  onCancelScrolling() {
    this.isScrollEnabled = false;
  }

  onEnableScrolling() {
    this.isScrollEnabled = true;
  }

  decrementQuantity() {
    if (this.numb() > 0) {
      this.numb.update(oldVal => --oldVal);
    }
  }

  incrementQuantity() {
    this.numb.update(oldVal => ++oldVal);
  }

}
