import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { createTestProduct, Product } from '../../../models/Product';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { By } from '@angular/platform-browser';
// import { RouterTestingModule } from '@angular/router/testing';


describe('ProductCardComponent', () => {
  let router: Router;
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let componentRef: ComponentRef<ProductCardComponent>;


  const mockProduct: Product = createTestProduct({ id: 1, title: 'Test Product', price: 100 });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterModule.forRoot([])], // Include required modules
      providers: [
        { provide: ActivatedRoute, useValue: {} }, // Mock ActivatedRoute
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('appProductCard', mockProduct); // Set input
  });

  it('should create the component and get input product', () => {
    expect(component).toBeTruthy();
    expect(component.product()).toBe(mockProduct);
  });


  it('should navigate to the correct route when clicked', () => {

    // Trigger the click event on the anchor element
    const anchorElement: HTMLAnchorElement = fixture.debugElement.query(By.css('.product-card__wrapper')).nativeElement;
    fixture.detectChanges(); // Apply any changes to the DOM
    const href = anchorElement.getAttribute('href');
    const target = anchorElement.getAttribute('target');

    (expect(href)).toEqual('/product/' + mockProduct.id);
    (expect(target)).toEqual('_blank');
  });


});
