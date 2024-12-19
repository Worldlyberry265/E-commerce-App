import { TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { ProductStore } from '../../store/product.store';
import { WeatherStore } from '../../store/weather.store';
import { ComponentFixture } from '@angular/core/testing';
import { HttpClientService } from '../../services/http.client';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { createTestProduct } from '../../models/Product';


describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let mockProductStore: InstanceType<typeof ProductStore>;
  let mockWeatherStore: InstanceType<typeof WeatherStore>;

  let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;


  beforeEach(() => {

    httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: HttpClientService, useValue: httpClientServiceMock },
      ],
    }).compileComponents();

    mockProductStore = TestBed.inject(ProductStore);
    mockWeatherStore = TestBed.inject(WeatherStore);

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor effects', () => {
    it('should set the mainWeatherCode and the weatherType, and run GetFramedProducts ', () => {
      spyOn(mockWeatherStore, 'weatherCodes').and.returnValue([1, 1, 30, 70, 85, 3, 2,]);
      spyOn(mockWeatherStore, 'GetFramedProducts');

      // Timeout to give some time for the effect to execute
      setTimeout(() => {
        expect(component.mainWeatherCode()).toEqual(80);
        expect(component.weatherType()).toEqual('thunders');
        expect(mockWeatherStore.GetFramedProducts).toHaveBeenCalledWith({ menProducId: 3, womenProductId: 15 })
      }, 1000);
    });

    it('should confirm if it should allow the user to scroll horizontally or vertically', () => {
      spyOn(mockProductStore, 'searchedProducts').and.returnValue(null);
      spyOn(mockProductStore, 'products').and.returnValue([createTestProduct({ id: 1 })]); // [] of length 1

      // Timeout to give some time for the effect to execute
      setTimeout(() => {
        const scrollContainer = fixture.debugElement.query(By.css('.product-cards__container')).nativeElement as HTMLElement;
        expect(scrollContainer.removeEventListener).toHaveBeenCalled();
      }, 1000);
    });
  });

  describe('ngOnInit', () => {
    it('should fetch products if not already fetched', () => {
      spyOn(mockProductStore, 'FetchAllProducts');
      spyOn(mockProductStore, 'products').and.returnValue(null);

      component.ngOnInit();

      expect(mockProductStore.FetchAllProducts).toHaveBeenCalled();
    });

    it('should fetch weather codes if not already fetched', () => {
      spyOn(mockWeatherStore, 'GetWeatherCodes');
      spyOn(mockWeatherStore, 'weatherCodes').and.returnValue([]);

      component.ngOnInit();

      expect(mockWeatherStore.GetWeatherCodes).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should set video playback rate and productsSection element', () => {
      const video = fixture.nativeElement.querySelector('#landing-video') as HTMLVideoElement;
      const productsSection = fixture.nativeElement.querySelector('#productsSection') as HTMLUListElement;

      component.ngAfterViewInit();

      expect(video.playbackRate).toBe(0.5);
      expect(component.productsSection).toBe(productsSection);
    });
  });

  describe('onSearchProduct', () => {
    it('should search for products with valid input string', () => {
      const event = { target: { value: 'slim shirt' } } as unknown as Event;
      spyOn(mockProductStore, 'SearchForProducts');

      component.onSearchProduct(event);

      expect(component.searchedProductInfo()).toEqual('slim shirt');
      expect(mockProductStore.SearchForProducts).toHaveBeenCalledWith('slim shirt');
    });

    it('should search for product with valid input id', () => {
      const event = { target: { value: '1' } } as unknown as Event;
      spyOn(mockProductStore, 'SearchForProducts');

      component.onSearchProduct(event);

      expect(component.searchedProductInfo()).toEqual('1');
      expect(mockProductStore.SearchForProducts).toHaveBeenCalledWith(1);
    });

    it('should not search for products with invalid input', () => {
      const event = { target: { value: '---' } } as unknown as Event;
      spyOn(mockProductStore, 'SearchForProducts');

      component.onSearchProduct(event);

      expect(component.searchedProductInfo()).toBeNull();
      expect(mockProductStore.SearchForProducts).not.toHaveBeenCalled();
    });
  });

  describe('onFetchCategoryProducts', () => {
    it('should fetch category products and reset searchedProductInfo', () => {

      spyOn(mockProductStore, 'FetchCategoryProducts');
      spyOn(mockProductStore, 'selectedCategory').and.returnValue('');

      component.onFetchCategoryProducts('electronics', 2);

      expect(component.searchedProductInfo()).toBeNull();
      expect(mockProductStore.FetchCategoryProducts).toHaveBeenCalledWith('electronics');
    });

    it('Upon clicking the 2nd time on the same category, it should fetch all products and reset searchedProductInfo', () => {
      const categoryElement: HTMLDivElement = fixture.nativeElement.querySelector('#Category-2') as HTMLDivElement;

      spyOn(mockProductStore, 'FetchAllProducts');
      spyOn(mockProductStore, 'selectedCategory').and.returnValue('electronics');
      spyOn(categoryElement.classList, 'remove');

      component.onFetchCategoryProducts('electronics', 2);

      expect(component.searchedProductInfo()).toBeNull();
      expect(categoryElement.classList.remove).toHaveBeenCalledWith('categories__item-selected');
      expect(mockProductStore.FetchAllProducts).toHaveBeenCalled();
    });

  });

  describe('onFetchAndScrollCategoryProducts', () => {
    it('should scroll to products section and fetch category products', () => {
      spyOn(component, 'onFetchCategoryProducts');
      spyOn(component.productsSection, 'scrollIntoView');

      component.onFetchAndScrollToCategoryProducts('electronics', 1);

      expect(component.productsSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      expect(component.onFetchCategoryProducts).toHaveBeenCalledWith('electronics', 1);

    });
  });

  describe('scrollToProducts', () => {
    it('should scroll to products section and update searchedProductInfo', () => {
      spyOn(component.productsSection, 'scrollIntoView');

      component.scrollToProducts('slim shirt');

      expect(component.searchedProductInfo()).toBe('slim shirt');
      expect(component.productsSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    });
  });
});
