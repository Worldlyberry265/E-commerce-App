import { AfterViewInit, ChangeDetectionStrategy, Component, effect, Inject, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { AuthStore } from "../../store/auth.store";
import { ProductRatingComponent } from "../products/product-rating/product-rating.component";
import { UserItemsStore } from "../../store/user-items.store";
import { Product } from "../../models/Product";

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, RouterModule, ProductRatingComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit, OnDestroy {


  dialogType = signal<'heart' | 'cart'>('cart');

  Math = Math; // Expose Math for use in the template
  Array = Array; // Expose Array for use in the template

  products = signal<Product[]>([]);

  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<PreviewComponent>);
  protected readonly authStore = inject(AuthStore);
  protected readonly userItemsStore = inject(UserItemsStore);


  // to fetch the data passed with the request to open the dialog
  constructor(@Inject(MAT_DIALOG_DATA) public data: { DialogType: 'heart' | 'cart' }) {
    this.dialogType.set(data.DialogType);


    //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!

    effect(() => {
      // TRY TO COMBINE THIS AND THE 1ST EFFECT!!!!!!!!
      console.log("PREVIEW EFFECT")
      if (this.dialogType() === 'cart') {
        // We start the product with quantity = 1 becuase the products come with no quantity from the fakestoreapi
        this.products.set(this.userItemsStore.cartItems().map(product => {
          // console.log("fom MAP");
          // console.log(product.quantity);
          // console.log(product.quantity == null ? 1 : product.quantity);



          return ({ ...product, quantity: product.quantity == null ? 1 : product.quantity })
        }));
      }
    }, { allowSignalWrites: true });
    //!!!!!!!!!!!!!! TESTING !!!!!!!!!!!!!!!!!

  }

  // moved these to ngOnInIt from the constructor because in the spec file, the store state is being updated
  // after the component is initiating, so the products weren't being updated
  ngOnInit(): void {
    if (this.dialogType() === 'cart') {
      // We start the product with quantity = 1 becuase the products come with no quantity from the fakestoreapi
      this.products.set(this.userItemsStore.cartItems().map(product => {
        // console.log("fom MAP");
        // console.log(product.quantity);
        // console.log(product.quantity == null ? 1 : product.quantity);



        return ({ ...product, quantity: product.quantity == null ? 1 : product.quantity })
      }));

      // console.log(this.userItemsStore.cartItems());
      // console.log(this.products());
      // console.log("from COMPONETNT");

    } else {
      this.products.set(this.userItemsStore.savedItems());
    }
  }

  // To check the products that have a decimal rate what should be give to them for the decimal part
  // such as 3.1 : no star given, 3.7: a half star should be given, 3.9: a 4th star should be given
  remainingStar(starsCount: number): number {
    return starsCount = starsCount - Math.floor(starsCount);
  }

  get TotalPrice() {
    let sum = 0;
    for (let i = 0; i < this.products().length; i++) {
      sum += (this.products()[i].price * this.products()[i].quantity);
    }
    return sum.toFixed(2);
  }

  onIncrementQuantity(itemIndex: number) {
    const product = this.products().at(itemIndex);
    ++product!.quantity;
  }

  onDecrementQuantity(itemIndex: number) {
    const product = this.products().at(itemIndex);
    if (product!.quantity > 1) {
      --product!.quantity;
    } else { // else we remove the item
      console.log("ondecrement is called");
      this.onRemoveItemFromCart(itemIndex);
    }
  }

  onRemoveItemFromCart(itemIndex: number) {
    // update the displayed product list
    const updatedProducts = [...this.products()];
    const remvedProduct = updatedProducts.splice(itemIndex, 1)[0];
    this.products.set(updatedProducts);

    // update the UI icons
    this.toggleIcon(remvedProduct.id, 'cart');
    // update the store
    this.userItemsStore.RemoveItemFromCart(remvedProduct);
  }

  onNavigate(route?: string, blank?: boolean) {
    this.dialogRef.close();
    // We need a timeout here because the dialogue isn't allowing us to navigate to the logContainer
    // So we wait for it to close then navigate
    setTimeout(() => {
      // We either navigate to login or to the homepage as the user should have finished the payment
      if (route) {
        if (blank) {
          // blank as target=_blank so we know that we are navigating to a product and it should be on a new tab
          const url = this.router.serializeUrl(this.router.createUrlTree([route]));
          window.open(url, '_blank');
        } else {
          this.router.navigate([route]);
        }
      } else {
        this.router.navigate(['login'], { fragment: 'logContainer' });
      }
    }, 100);
  }

  onRemoveSavedItem(itemIndex: number) {
    // update the displayed product list
    const updatedProducts = [...this.products()];
    const remvedProduct = updatedProducts.splice(itemIndex, 1)[0];
    this.products.set(updatedProducts);

    // update the UI icons
    this.toggleIcon(remvedProduct.id, 'heart')
    // update the store
    this.userItemsStore.RemoveSavedItem(remvedProduct);
  }

  onUpdateCart() {
    this.userItemsStore.UpdateCart(this.products());
    // console.log("from UPDATE");
    // console.log(this.products());
    // console.log(this.userItemsStore.cartItems());
  }

  onClearCart() {
    // Turn the active class off on the selected cart items
    for (let i = 0; i < this.products().length; i++) {
      this.toggleIcon((this.products()[i].id), "cart");
    }
    this.products.set([]);
    this.userItemsStore.UpdateCart([]);
  }

  onPay() {
    this.onNavigate('homepage');
    this.userItemsStore.UpdateCart([]);
  }

  // This method will remove the active class on the icons of the products that were removed from cart/saved items
  private toggleIcon(productId: number, iconType: 'heart' | 'cart') {
    if (iconType === 'heart') {
      const heartIcon = document.getElementById('heart-svg-' + productId)
      heartIcon?.classList.toggle('product-card__nav--item-active-heart');
    } else {
      const cartIcon = document.getElementById('cart-svg-' + productId)
      cartIcon?.classList.toggle('product-card__nav--item-active-cart');
    }
  }

  ngOnDestroy() {
    // To get back the mobile navigation display. I'm not checking if the screen is mobile or not bcz the it isnt making much here, so an if
    // check wouldn't make any difference in performance for desktop screens
    this.userItemsStore.OpenMobileNavigation();
    this.onUpdateCart();
    // console.log("from destroy");
    // console.log(this.products());
    // console.log(this.userItemsStore.cartItems());
  }
}
