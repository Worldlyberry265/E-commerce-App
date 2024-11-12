import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewcomponentComponent } from './preview-component.component';

describe('PreviewcomponentComponent', () => {
  let component: PreviewcomponentComponent;
  let fixture: ComponentFixture<PreviewcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
