import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFrameComponent } from './product-frame.component';

describe('ProductFrameComponent', () => {
  let component: ProductFrameComponent;
  let fixture: ComponentFixture<ProductFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
