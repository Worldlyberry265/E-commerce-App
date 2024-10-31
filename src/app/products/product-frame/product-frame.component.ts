import { Component } from '@angular/core';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'div[appProductFrame]',
  standalone: true,
  imports: [ReviewsComponent],
  templateUrl: './product-frame.component.html',
  styleUrl: './product-frame.component.scss'
})
export class ProductFrameComponent {

}
