import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFrameComponent } from './product-frame.component';
import { ProductRatingComponent } from '../product-rating/product-rating.component';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { Product } from '../../../models/Product';
import { ComponentRef } from '@angular/core';

// Mock Product data
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A great product!',
  image: 'test-image.jpg',
  price: 100,
  category: 'Men\'s Clothing',
  quantity: 0,
  rating: {
    rate: 4.5,
    count: 150
  },
};

describe('ProductFrameComponent', () => {
  let component: ProductFrameComponent;
  let componentRef: ComponentRef<ProductFrameComponent>;
  let fixture: ComponentFixture<ProductFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFrameComponent, ProductRatingComponent, CommonModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFrameComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('appProductFrame', mockProduct);
    fixture.detectChanges();
  });

  it('should create and get input product', () => {
    expect(component).toBeTruthy();
    expect(component.product()).toEqual(mockProduct);
  });

  it('should toggle triggeredCaption when triggerHover is called', () => {
    const initialState = component.triggeredCaption();
    component.triggerHover();
    expect(component.triggeredCaption()).toBe(!initialState);
  });

  it('should update the image class when triggeredCaption is toggled', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('img')!;

    // Initial class check
    expect(image.classList).not.toContain('product-frame__img-active');

    // Trigger hover to toggle caption visibility
    component.triggerHover();
    fixture.detectChanges();
    expect(image.classList).toContain('product-frame__img-active');

    // to check if it will remove the class at the 2nd click
    component.triggerHover();
    fixture.detectChanges();
    expect(image.classList).not.toContain('product-frame__img-active');

  });
});
