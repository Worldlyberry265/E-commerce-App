import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRatingComponent } from './product-rating.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('ProductRatingComponent', () => {
  let component: ProductRatingComponent;
  let componentRef: ComponentRef<ProductRatingComponent>;
  let fixture: ComponentFixture<ProductRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRatingComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    //need to initiate reviewsCount in each component bcz it's a required input
    componentRef.setInput('reviewsCount', 31);

  });

  it('should create the component and have the inputs', () => {
    expect(fixture.componentInstance).toBeTruthy();
    componentRef.setInput('stars', 4);

    expect(component.stars()).toEqual(4);
    expect(component.reviewsCount()).toEqual(31);
  });

  it('should calculate starsCount correctly for integer ratings', () => {
    componentRef.setInput('stars', 4);
    // We dont need here to detect changes since the getter will trigger it

    expect(component.starsCount.length).toEqual(4);
    expect(component.RemainingStarCount).toBe(0);
  });

  it('should calculate starsCount and RemainingStarCount correctly for fractional ratings', () => {
    componentRef.setInput('stars', 4.5);
    // We dont need here to detect changes since the getter will trigger it

    expect(component.starsCount.length).toEqual(4);
    expect(component.RemainingStarCount).toBe(0.5);
  });

  it('should render full stars based on starsCount', () => {
    componentRef.setInput('stars', 4);
    fixture.detectChanges();

    const fullStars = fixture.debugElement.queryAll(By.css('.fa-star.shining-star'));
    expect(fullStars.length).toBe(4);
  });

  it('should render a half star if RemainingStarCount is in range (0.299 to 0.71)', () => {
    componentRef.setInput('stars', 3.5);
    fixture.detectChanges();

    const halfStar = fixture.debugElement.query(By.css('.fa-star-half-stroke.shining-star'));
    expect(halfStar).toBeTruthy();
  });

  it('should render an additional full star if RemainingStarCount is >= 0.75', () => {
    componentRef.setInput('stars', 4.8);
    fixture.detectChanges();

    const fullStars = fixture.debugElement.queryAll(By.css('.fa-star.shining-star'));
    expect(fullStars.length).toBe(5); // 4 full + 1 additional full
  });

  it('should display the correct rating and reviews count', () => {
    componentRef.setInput('stars', 4);
    componentRef.setInput('reviewsCount', 120);
    fixture.detectChanges();

    const ratingSpan = fixture.debugElement.query(By.css('.stars-count')).nativeElement;
    const reviewsSpan = fixture.debugElement.query(By.css('.rating-count')).nativeElement;

    expect(ratingSpan.textContent.trim()).toBe('4.0');
    expect(reviewsSpan.textContent.trim()).toBe('120 + ratings');
  });
});
