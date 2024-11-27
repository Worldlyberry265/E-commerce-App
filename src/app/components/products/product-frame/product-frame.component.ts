import { Component } from '@angular/core';
import { ProductRatingComponent } from '../product-rating/product-rating.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'div[appProductFrame]',
  standalone: true,
  imports: [ProductRatingComponent, CommonModule],
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
  }
}
