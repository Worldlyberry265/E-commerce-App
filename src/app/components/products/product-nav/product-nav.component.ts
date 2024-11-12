import { AfterViewInit, Component, input } from '@angular/core';

@Component({
  selector: 'nav[appProductNav]',
  standalone: true,
  imports: [],
  templateUrl: './product-nav.component.html',
  styleUrl: './product-nav.component.scss'
})
export class ProductNavComponent implements AfterViewInit {

  Id = input.required<string>({alias: 'appProductNav'});

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
