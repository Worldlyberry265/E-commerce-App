import { Component } from '@angular/core';
import { ReviewsComponent } from '../reviews/reviews.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'div[appProductFrame]',
  standalone: true,
  imports: [ReviewsComponent, CommonModule],
  templateUrl: './product-frame.component.html',
  styleUrl: './product-frame.component.scss',
  host: {
    '(click)':'triggerHover()'
  }
})
export class ProductFrameComponent {

  triggeredCaption = false;


  triggerHover() {
    this.triggeredCaption = !this.triggeredCaption;
    console.log("TRIGGERED BUTTON");
    
  }
}
