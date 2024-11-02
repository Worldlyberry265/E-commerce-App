import { AfterViewInit, Component, input } from '@angular/core';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'li[appProductCard]',
  standalone: true,
  imports: [ReviewsComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements AfterViewInit{

  productId = input<number>(0);

  ngAfterViewInit(): void {
    const heart = document.getElementById(`heart-svg-${this.productId()}`);
    const cart = document.getElementById(`cart-svg-${this.productId()}`);

    if (heart) {
      heart.addEventListener('click', function () {
        this.classList.toggle('product-card__nav--item-active-heart'); // Toggle the active class
      });
    }
    if (cart) {
      cart.addEventListener('click', function () {
        this.classList.toggle('product-card__nav--item-active-cart'); // Toggle the active class
      });
    }
    
  }
}
