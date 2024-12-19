import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductRatingComponent } from '../product-rating/product-rating.component';
import { ProductNavComponent } from '../product-nav/product-nav.component';
import { Product } from '../../../models/Product';

@Component({
  selector: 'li[appProductCard]',
  standalone: true,
  imports: [ProductRatingComponent, ProductNavComponent, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {

  product = input.required<Product>({ alias: 'appProductCard' });
}
