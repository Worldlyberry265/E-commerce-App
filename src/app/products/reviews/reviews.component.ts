import { Component, input } from '@angular/core';
import { AddDecimalPipe } from '../reviews/add-decimal-pipe/add-decimal.pipe';

@Component({
  selector: 'div[appReview]',
  standalone: true,
  imports: [AddDecimalPipe],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {

  stars = input.required<number>({ alias: 'appReview' });
  RemainingStarCount = 0;

  get starsCount(): number[] {
    this.RemainingStarCount = this.stars() - Math.floor(this.stars());
    console.log(`Remianing stars: ${this.RemainingStarCount}`);
    console.log(`Remianing stars: ${Math.floor(this.stars())}`);
    console.log(`Remianing stars: ${this.stars}`);
    return Array(Math.floor(this.stars()));
    
  }

}
