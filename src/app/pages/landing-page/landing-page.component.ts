import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../components/header/header.component";
import { ProductCardComponent } from "../../components/products/product-card/product-card.component";
import { ProductFrameComponent } from "../../components/products/product-frame/product-frame.component";
import { ProductStore } from "../../store/product.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Product } from "../../models/Product";

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
  Weather = 1;
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
      const products = this.productStore.products();
      const searchedProducts = this.productStore.searchedProducts();

      // We display the searchedForProducts if there is any, else we display the normal products
      if (searchedProducts) {
        this.displayedProducts.set(searchedProducts);
      } else if (this.searchedProductInfo() != null) {
        this.displayedProducts.set(null);
      } else {
        this.displayedProducts.set(products);
      }
      // To check if we should scroll normally or horizentally each time the products update.
      this.confirmProductsScroll();
    }, { allowSignalWrites: true }); // to allow updating signals in effects
  }

  ngOnInit(): void {
    this.productStore.FetchAllProducts();
  }

  ngAfterViewInit(): void {
    const video = document.getElementById('landing-video') as HTMLVideoElement;
    video.playbackRate = 0.5;

    this.productsSection = document.getElementById('productsSection') as HTMLUListElement;
  }

  // To confirm if we scroll through the products horizontally, or normally/vertically
  private confirmProductsScroll() {
    const scrollContainer = document.querySelector('.product-cards__container') as HTMLElement;
    const products = this.displayedProducts();

    // If we have only few products the user wont be able to scroll the page over them, instead the browser will try
    // to scroll horizentally between the products, so we stop the horizental scroll then
    if (products && products.length > 5) {
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

  fetchCategoryProducts(category: string, categoryId: number) {
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
    this.fetchCategoryProducts(category, categoryId);
  }

  scrollToProducts(productName: string) {
    // To stop displaying the searched products
    this.searchedProductInfo.set(productName === '' ? null : productName);
    this.productsSection.scrollIntoView({ behavior: 'smooth' });
  }

}

