import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { ProductRatingComponent } from '../product-rating/product-rating.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/Product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'div[appProductFrame]',
  standalone: true,
  imports: [ProductRatingComponent, CommonModule, RouterLink],
  templateUrl: './product-frame.component.html',
  styleUrl: './product-frame.component.scss',
  host: {
    '(click)': 'triggerHover()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFrameComponent {

  product = input.required<Product>({ alias: 'appProductFrame' });
  triggeredCaption = signal(false);

  triggerHover() {
    this.triggeredCaption.update(state => !state);
  }
}
