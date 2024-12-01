import { AfterViewInit, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductRatingComponent } from '../../components/products/product-rating/product-rating.component';
import { Product } from '../../models/Product';
import { ProductStore } from '../../store/product.store';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UserItemsStore } from '../../store/user-items.store';


@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [HeaderComponent, ProductRatingComponent, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  Allimgs = [
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  ];

  SubImgs = [
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  ];

  numb = signal(0);
  product = signal<Product | null>(null);

  isScrollEnabled = true;

  itemSaved = signal(false);
  itemAdded = signal(false);



  displayedImgs: string[] = [];

  ImageIndex = 4;

  protected productStore = inject(ProductStore);
  private userItemsStore = inject(UserItemsStore);

  constructor() {
    effect(() => {
      if (this.product()?.quantity === undefined) {
        // we only want to fetch the product the once the component initialize, not everytime product updates
        this.product.set(this.productStore.selectedProduct() ?? null);
      }

      if (this.product() != null) {
        if (this.userItemsStore.IsItemInCart(this.product()!.id)) {
          this.itemAdded.set(true);
        } else {
          this.itemAdded.set(false);
        }

        if (this.userItemsStore.IsItemSaved(this.product()!.id)) {
          this.itemSaved.set(true);
        } else {
          this.itemSaved.set(false);
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.isScrollEnabled) {
        this.onNextClick();
      }
    }, 2000);
    this.displayedImgs = [...this.SubImgs];
  }


  onNextClick() {

    if (this.ImageIndex === this.Allimgs.length - 1) {
      this.ImageIndex = 0;
    } else {
      this.ImageIndex++;
    }

    this.SubImgs.pop();
    this.SubImgs.unshift(this.Allimgs[this.ImageIndex]);
    this.displayedImgs = this.SubImgs;

  }

  onCancelScrolling() {
    this.isScrollEnabled = false;
  }

  onEnableScrolling() {
    this.isScrollEnabled = true;
  }

  onAlterCart() {
    if (this.itemAdded()) {
      this.userItemsStore.RemoveItemFromCart(this.product()!);
      this.itemAdded.update(state => !state);
    } else {
      this.userItemsStore.AddItemToCart(this.product()!);
      this.itemAdded.update(state => !state);
    }
  }

  onAlterSavedItems() {
    if (this.itemSaved()) {
      this.userItemsStore.RemoveSavedItem(this.product()!);
      this.itemSaved.update(state => !state);
    } else {
      this.userItemsStore.SaveItem(this.product()!);
      this.itemSaved.update(state => !state);
    }
  }

  decrementQuantity() {
    if (this.product()!.quantity > 1) {
      this.product.update(state => ({
        ...state,
        quantity: --state!.quantity  // The 1st decncrement the quantity will be undefined
      }) as Product);
    }
  }

  incrementQuantity() {
    this.product.update(state => ({
      ...state,
      quantity: state!.quantity === undefined ? 2 : ++state!.quantity  // The 1st increment the quantity will be undefined
    }) as Product);
  }


}
