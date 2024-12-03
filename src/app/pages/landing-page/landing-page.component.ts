import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../components/header/header.component";
import { ProductCardComponent } from "../../components/products/product-card/product-card.component";
import { ProductFrameComponent } from "../../components/products/product-frame/product-frame.component";
import { ProductStore } from "../../store/product.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Product } from "../../models/Product";
import { UserItemsStore } from "../../store/user-items.store";
import { WeatherStore } from "../../store/weather.store";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, ProductCardComponent, ProductFrameComponent, FormsModule, MatProgressSpinnerModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// PLEASE READ THIS!
// I wanted to implement infinite scrolling for the products. However, the fakestoreapi doesn't support such thing, I can limit
// how many products i can fetch, but I can provide an offset.
export class LandingPageComponent implements OnInit, AfterViewInit {

  protected readonly productStore = inject(ProductStore);
  private readonly weatherStore = inject(WeatherStore);

  weather = signal(-1);
  weatherType = signal<('sunny' | 'cloudy' | 'foggy' | 'rainy' | 'snowy' | 'thunders' | '')>('');
  searchedProduct = ''; // I NEED TO MANUALLY TRIGGER CHANGE DETECTION !!!!!!!!!!!

  productsSection!: HTMLUListElement;

  displayedProducts = signal<Product[] | null>(null);
  searchedProductInfo = signal<string | null>(null);
  inputRegex = /^(?!-)(?!.*--)[a-zA-Z0-9\s(),./-]*$/;

  // If handleWheelEvent were defined as a local constant inside confirmProductsScroll, a new function instance 
  // would be created every time confirmProductsScroll is called.
  // For addEventListener and removeEventListener to work correctly, they must reference the exact same function instance.
  // By defining handleWheelEvent as a class property, we ensure that the same function reference is used 
  // across multiple calls to addEventListener and removeEventListener.
  private handleWheelEvent = (event: WheelEvent) => {
    const scrollContainer = document.querySelector('.product-cards__container') as HTMLElement;
    event.preventDefault(); // Prevent the default vertical scroll
    scrollContainer.scrollLeft += event.deltaY * 10; // Scroll horizontally
  };
  constructor() {

    effect(() => {
      if (this.weatherStore.weatherCodes()) {
        const weatherCodes = this.weatherStore.weatherCodes();
        // We start from 2, assuming the delivery needs 2 days, so the user wont be interested in the weather for the next 2 days
        for (let i = 2; i < weatherCodes.length; i++) {
          // Check if the weather has something special like rain,snow,fog, etc.
          if (weatherCodes[i] >= 50) {
            this.weather.set(weatherCodes[i]);
          }
        }
        // else we pick the 4th date as its in the middle of the week and assuming the delivery will take up to 2 days to deliver the product
        if (this.weather() === -1 && weatherCodes.length != 0) {
          // -1 means the for loop didnt change the initial value of the weather
          // weatherCodes.length != 0 to not enter an infinite loop
          this.weather.set(weatherCodes[2]);
        }

        // I'm picking the Ids according to the most suitable option out there, so there is some redundancy bcz there isn't much products 
        // found in fakeStoreApi
        if (this.weather() != -1) {
          if (this.weather() === 0 || this.weather() === 1) {
            this.weatherType.set('sunny');
            this.weatherStore.GetFramedProducts({ menProducId: 2, womenProductId: 20 });
          } else if (this.weather() === 2 || this.weather() === 3) {
            this.weatherType.set('cloudy');
            this.weatherStore.GetFramedProducts({ menProducId: 2, womenProductId: 19 });
          } else if (this.weather() >= 4 && this.weather() <= 47) {
            this.weatherType.set('foggy');
            this.weatherStore.GetFramedProducts({ menProducId: 4, womenProductId: 17 });
          } else if ((this.weather() >= 50 && this.weather() <= 69) || (this.weather() >= 80 && this.weather() <= 82)) {
            this.weatherType.set('rainy');
            this.weatherStore.GetFramedProducts({ menProducId: 4, womenProductId: 16 });
          } else if (this.weather() >= 70 && this.weather() <= 79) {
            this.weatherType.set('snowy');
            this.weatherStore.GetFramedProducts({ menProducId: 3, womenProductId: 15 });
          } else if (this.weather() >= 83 && this.weather() <= 89) {
            this.weatherType.set('thunders');
            this.weatherStore.GetFramedProducts({ menProducId: 3, womenProductId: 15 });
          }


        }
        console.log("from landng");
        console.log(this.weather());


      }

    }, { allowSignalWrites: true });


    effect(() => {
      const products = this.productStore.products();
      const searchedProducts = this.productStore.searchedProducts();

      // To check if we should scroll normally or horizentally each time the products update.
      if (searchedProducts) {
        this.confirmProductsScroll(searchedProducts.length);
      } else if (products && this.searchedProductInfo() === null) {
        this.confirmProductsScroll(products!.length);
      }

    }, { allowSignalWrites: true }); // to allow updating signals in effects
  }

  ngOnInit(): void {
    if (this.productStore.products() === null) {
      this.productStore.FetchAllProducts();
    }

    if (this.weatherStore.weatherCodes().length === 0) {
      this.weatherStore.GetWeatherCodes();
    }
  }

  ngAfterViewInit(): void {
    const video = document.getElementById('landing-video') as HTMLVideoElement;
    video.playbackRate = 0.5;

    this.productsSection = document.getElementById('productsSection') as HTMLUListElement;
  }

  // To confirm if we scroll through the products horizontally, or normally/vertically
  private confirmProductsScroll(productsLength: number) {
    const scrollContainer = document.querySelector('.product-cards__container') as HTMLElement;
    // If we have only few products the user wont be able to scroll the page over them, instead the browser will try
    // to scroll horizentally between the products, so we stop the horizental scroll then
    if (productsLength > 5) {
      scrollContainer!.addEventListener('wheel', this.handleWheelEvent);
    } else {
      scrollContainer!.removeEventListener('wheel', this.handleWheelEvent); // Return back normal scroll behavior
    }
  }


  onSearchProduct(event: Event) {

    const productName = (event.target as HTMLInputElement).value;

    // To not send a request of empty and malicious input 
    if (this.inputRegex.test(productName)) {

      // To stop displaying the searched products and to display nothing when there isn't a product found
      this.searchedProductInfo.set(productName === '' ? null : productName);
      // If its an id then its greater than 0
      if (+productName > 0) { // the ids start from 0
        this.productStore.SearchForProducts(+productName);
        // else it will be a string
      } else {
        this.productStore.SearchForProducts(productName);
      }

    }
  }

  onFetchCategoryProducts(category: string, categoryId: number) {
    // We reset it to null to display the category products after we don't find a searchedProduct
    // If we don't reset the products won't display untill the user deletes the searched Product Info
    this.searchedProductInfo.set(null);
    if (this.productStore.selectedCategory() === category) {
      const categoryElement = document.getElementById(`Category-${categoryId}`) as HTMLDivElement;
      categoryElement.classList.remove('categories__item-selected');
      this.productStore.FetchAllProducts();
    } else {
      this.productStore.FetchCategoryProducts(category);
    }
  }

  onFetchAndScrollCategoryProducts(category: string, categoryId: number) {
    this.productsSection.scrollIntoView({ behavior: 'smooth' });
    this.onFetchCategoryProducts(category, categoryId);
  }

  scrollToProducts(productName: string) {
    // To stop displaying the searched products
    this.searchedProductInfo.set(productName === '' ? null : productName);
    this.productsSection.scrollIntoView({ behavior: 'smooth' });
  }

}

