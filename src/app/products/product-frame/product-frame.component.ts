import { Component, input } from '@angular/core';
import { ReviewsComponent } from '../reviews/reviews.component';
import { CommonModule } from '@angular/common';
import { ProductNavComponent } from '../product-nav/product-nav.component';

@Component({
  selector: 'div[appProductFrame]',
  standalone: true,
  imports: [ReviewsComponent, CommonModule,ProductNavComponent],
  templateUrl: './product-frame.component.html',
  styleUrl: './product-frame.component.scss',
  host: {
    '(click)':'triggerHover()'
  }
})
export class ProductFrameComponent {

  // Id = input.required<number>({alias: 'appProductFrame'});
  triggeredCaption = false;


  triggerHover() {
    this.triggeredCaption = !this.triggeredCaption;
    console.log("TRIGGERED BUTTON");
    
  }
}
