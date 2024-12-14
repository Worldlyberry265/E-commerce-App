import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductRatingComponent } from '../../components/products/product-rating/product-rating.component';
import { Product } from '../../models/Product';
import { ProductStore } from '../../store/product.store';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UserItemsStore } from '../../store/user-items.store';
import { AuthStore } from '../../store/auth.store';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponent } from '../../components/preview/preview.component';
import { RouterLink } from '@angular/router';

type relatedProduct = {
  id: number,
  img: string,
  price: number
};

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [HeaderComponent, ProductRatingComponent, MatButtonModule, CommonModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageComponent implements OnInit {

  Allimgs = signal<relatedProduct[]>([]);
  displayedProducts = signal<relatedProduct[]>([]);

  numb = signal(0);
  product = signal<Product | null>(null);

  isScrollEnabled = signal(true);

  isItemSaved = signal(false);
  isItemAdded = signal(false);

  ImageIndex = signal(4);

  protected productStore = inject(ProductStore);
  protected authStore = inject(AuthStore);
  private userItemsStore = inject(UserItemsStore);

  private changeRef = inject(ChangeDetectorRef);

  readonly dialog = inject(MatDialog);


  constructor() {
    effect(() => {
      console.log("effect 11111111");

      // we only want to fetch the product the once the component initialize, not everytime product updates
      if (this.product()?.quantity === undefined) {
        this.product.set(this.productStore.selectedProduct() ?? null);
      }

      // To toggle the cart button
      if (this.product() != null) {
        if (this.userItemsStore.IsItemInCart(this.product()!.id)) {
          this.isItemAdded.set(true);
        } else {
          this.isItemAdded.set(false);
        }

        // To toggle the save button
        if (this.userItemsStore.IsItemSaved(this.product()!.id)) {
          this.isItemSaved.set(true);
        } else {
          this.isItemSaved.set(false);
        }
      }
    }, { allowSignalWrites: true });

    effect(() => {
      console.log("effect 2222222222222");

      if (this.productStore.relatedProducts()) {
        this.Allimgs.set(
          this.productStore.relatedProducts()!.map((product) => {
            return { id: product.id, img: product.image, price: product.price }
          })
        );
        this.displayedProducts.set(this.Allimgs().slice(0, 5).reverse());
      } else {
        this.productStore.FetchAllProducts();
      }
    }, { allowSignalWrites: true });

    //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!
    effect(() => {
      console.log("effect 333333333");

      if (this.product()) {
        const productInCart = this.userItemsStore.cartItems().find(product => product.id === this.product()!.id);
        if (this.userItemsStore.IsItemInCart(this.product()!.id) && this.product()?.quantity != productInCart?.quantity) {
          console.log("effect 333333333 +++++++++++");
          this.product.set(productInCart!);
        }
      }
    }, { allowSignalWrites: true });
    //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!

  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.isScrollEnabled()) {
        this.onNextClick();
      }
    }, 2000);
  }


  onNextClick() {
    if (this.ImageIndex() === this.Allimgs().length - 1) {
      this.ImageIndex.set(0);
    } else {
      this.ImageIndex.update(state => ++state);
    }
    this.displayedProducts().pop();
    this.displayedProducts().unshift(this.Allimgs()[this.ImageIndex()]);
    this.changeRef.detectChanges();
  }

  onCancelScrolling() {
    // There is no hovering on mobile, so if the user pressed on it to navigate to it, and he/she went back to this page later
    // he/she will find out that the scrolling has stopped because he/she pressed on it before
    if (window.innerWidth >= 450) {
      this.isScrollEnabled.set(false);
    }
  }

  onEnableScrolling() {
    this.isScrollEnabled.set(true)
  }

  onAlterCart() {
    if (this.isItemAdded()) {
      this.userItemsStore.RemoveItemFromCart(this.product()!);
      this.isItemAdded.update(state => !state);
    } else {
      this.userItemsStore.AddItemToCart(this.product()!);
      this.isItemAdded.update(state => !state);
    }
  }

  onAlterSavedItems() {
    if (this.authStore.jwt()) {
      if (this.isItemSaved()) {
        this.userItemsStore.RemoveSavedItem(this.product()!);
        this.isItemSaved.update(state => !state);
      } else {
        this.userItemsStore.SaveItem(this.product()!);
        this.isItemSaved.update(state => !state);
      }
    } else {
      // If the user isnt logged in then we cant save his item and ask him to sign in
      this.dialog.open(PreviewComponent, {
        panelClass: 'preview',
        data: { DialogType: 'heart' }
      });
    }




  }

  onDecrementQuantity() {
    if (this.product()!.quantity > 1) {
      this.product.update(state => ({
        ...state,
        quantity: --state!.quantity  // The 1st decncrement the quantity will be undefined
      }) as Product);

      //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!
      this.userItemsStore.UpdateItemInCart(this.product()!);

      //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!

    }
  }

  onIncrementQuantity() {
    this.product.update(state => ({
      ...state,
      quantity: state!.quantity === undefined ? 2 : ++state!.quantity  // The 1st increment the quantity will be undefined
    }) as Product);

    //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!
    this.userItemsStore.UpdateItemInCart(this.product()!);

    //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!
  }


}
