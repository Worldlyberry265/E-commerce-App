import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AddDecimalPipe } from './add-decimal-pipe/add-decimal.pipe';

@Component({
  selector: 'div[appReview], figcaption[appReview]',
  standalone: true,
  imports: [AddDecimalPipe],
  templateUrl: './product-rating.component.html',
  styleUrl: './product-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductRatingComponent {

  stars = input.required<number>();
  reviewsCount = input.required<number>();
  RemainingStarCount = 0;

  get starsCount(): number[] {
    this.RemainingStarCount = this.stars() - Math.floor(this.stars());
    return Array(Math.floor(this.stars()));
    
  }

}
