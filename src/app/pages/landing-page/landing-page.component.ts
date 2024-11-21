import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../components/header/header.component";
import { ProductCardComponent } from "../../components/products/product-card/product-card.component";
import { ProductFrameComponent } from "../../components/products/product-frame/product-frame.component";
import { ProductStore } from "../../store/product.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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

  protected readonly productsStore = inject(ProductStore);
  Weather = 1;
  searchedProduct = ''; // I NEED TO MANUALLY TRIGGER CHANGE DETECTION !!!!!!!!!!!
  foundProducts = signal<string[]>([]);

  productsSection!: HTMLUListElement;

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
      const products = this.productsStore.products();
      if (products) {
        this.confirmProductsScroll();
      }
    });
  }

  ngOnInit(): void {
    this.productsStore.FetchAllProducts();
  }

  ngAfterViewInit(): void {
    const video = document.getElementById('landing-video') as HTMLVideoElement;
    video.playbackRate = 0.5;
       
    this.productsSection = document.getElementById('productsSection') as HTMLUListElement;
  }

  private confirmProductsScroll() {
    const scrollContainer = document.querySelector('.product-cards__container') as HTMLElement;
    const products = this.productsStore.products();

    // If we have only few products the user wont be able to scroll the page over them, instead the browser will try
    // to scroll horizentally between the products, so we stop the horizental scroll then
    if (products && products.length > 5) {
      scrollContainer!.addEventListener('wheel', this.handleWheelEvent);
    } else {
      scrollContainer!.removeEventListener('wheel', this.handleWheelEvent); // Return back normal scroll behavior
    }
  }


  // I NEED TO SELECT STORE SINCE I WILL BE DISPATCHING FROM THE HEADER THE KEYUP EVENT
  onSearchProduct(event: KeyboardEvent) {
    this.foundProducts.set([]);
    const searchedProductName = event.target as HTMLInputElement;

    // if (searchedProductName.value.length > 0) {
    //   this.foundProducts.set(
    //     this.products().filter(product => product.includes(searchedProductName.value))
    //   );
    // }
  }

  fetchCategoryProducts(category: string) {
    this.productsStore.FetchCategoryProducts(category);
  }

  selectProduct(productName: any) {
    this.searchedProduct = productName;
    this.foundProducts.set([]);
    // DISPATCH HERE
  }

  scrollToProducts() {
    this.productsSection.scrollIntoView({ behavior: 'smooth' });

  }

}

