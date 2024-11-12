import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AddDecimalPipe } from './add-decimal-pipe/add-decimal.pipe';

@Component({
  selector: 'div[appReview], figcaption[appReview]',
  standalone: true,
  imports: [AddDecimalPipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewsComponent {

  stars = input.required<number>();
  reviewsCount = input.required<number>();
  RemainingStarCount = 0;

  get starsCount(): number[] {
    this.RemainingStarCount = this.stars() - Math.floor(this.stars());
    return Array(Math.floor(this.stars()));
    
  }

}
