import { Component, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [HeaderComponent, ReviewsComponent, MatButtonModule, CommonModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {

  numb = signal(0);

  isScrollEnabled = true;

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

  displayedImgs : string[] = [];

  ImageIndex = 4;

  ngOnInit(): void {
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
