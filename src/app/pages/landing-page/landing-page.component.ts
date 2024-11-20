import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../components/header/header.component";
import { ProductCardComponent } from "../../components/products/product-card/product-card.component";
import { ProductFrameComponent } from "../../components/products/product-frame/product-frame.component";
import { ProductStore } from "../../store/products.store";

;


@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, ProductCardComponent, ProductFrameComponent, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  protected readonly productsStore = inject(ProductStore);
  Weather = 1;

  products = signal(["abc", "Asddddddddddd", "sdddddddddd"]);
  searchedProduct = ''; // I NEED TO MANUALLY TRIGGER CHANGE DETECTION !!!!!!!!!!!
  foundProducts = signal<string[]>([]);



  ngOnInit(): void {
      this.productsStore.FetchAllProducts();
  }

  ngAfterViewInit(): void {
    const video = document.getElementById('landing-video') as HTMLVideoElement;
    video.playbackRate = 0.5;


    // Use this bcz if we have only 1 product the user wont be able to scroll
    // if(this.products().length > 7) {
    const scrollContainer = document.querySelector('.product-cards__container') as HTMLElement;
    scrollContainer!.addEventListener('wheel', (event) => {
      event.preventDefault(); // Prevent the default vertical scroll
      scrollContainer!.scrollLeft += event.deltaY * 10; // Scroll horizontally
    });
    // }

  }
  // I NEED TO SELECT STORE SINCE I WILL BE DISPATCHING FROM THE HEADER THE KEYUP EVENT
  onSearchProduct(event: KeyboardEvent) {
    this.foundProducts.set([]);
    const searchedProductName = event.target as HTMLInputElement;

    if (searchedProductName.value.length > 0) {
      this.foundProducts.set(
        this.products().filter(product => product.includes(searchedProductName.value))
      );
    }
  }



  selectProduct(productName: any) {
    this.searchedProduct = productName;
    this.foundProducts.set([]);
    // DISPATCH HERE
  }

}

