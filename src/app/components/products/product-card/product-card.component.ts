import { AfterViewInit, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ProductNavComponent } from '../product-nav/product-nav.component';

@Component({
  selector: 'li[appProductCard]',
  standalone: true,
  imports: [ReviewsComponent, ProductNavComponent, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements AfterViewInit{

  Id = input.required<number>({alias: 'appProductCard'});


  ngAfterViewInit(): void {
    const heart = document.getElementById(`heart-svg-${this.Id()}`);
    const cart = document.getElementById(`cart-svg-${this.Id()}`);

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
