import { ChangeDetectionStrategy, Component, Inject, inject, signal } from "@angular/core";
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
export class PreviewComponent {


  dialogType = signal<'heart' | 'cart'>('cart');
  RemainingStarCount = 0;
  stars = signal(5);

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
    if (this.dialogType() === 'cart') {
      // We start the product with quantity = 1
      this.products.set(this.userItemsStore.cartItems().map(product => ({ ...product, quantity: product.quantity ?? 1 })));
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
  decrementQuantity(itemIndex: number) {
    const product = this.products().at(itemIndex);
    if (product!.quantity > 1) {
      --product!.quantity;
    } else { // else we remove the item
      // Create a copy of the products array without the item at `itemIndex`
      const updatedProducts = [...this.products()];
      updatedProducts.splice(itemIndex, 1);

      // Update the signal with the new array
      this.products.set(updatedProducts);

      // Update the cart in store
      this.userItemsStore.RemoveItemFromCart(product!)

      // Toggle the cart icon in the product-card to confirm to the user that she/he removed the item from his/her cart 
      this.toggleIcon(product!.id, 'cart')
    }
  }

  incrementQuantity(itemIndex: number) {
    const product = this.products().at(itemIndex);
    ++product!.quantity;
  }

  onNavigate(route?: string) {
    this.dialogRef.close();
    // We need a timeout here because the dialogue isn't allowing us to navigate to the logContainer
    // So we wait for it to close then navigate
    setTimeout(() => {
      if (route) {
        this.router.navigate([route]);
      } else {
        this.router.navigate(['login'], { fragment: 'logContainer' });
      }
    }, 100);
  }

  removeItemFromCart(itemIndex: number) {
    // update the displayed product list
    const updatedProducts = [...this.products()];
    const remvedProduct = updatedProducts.splice(itemIndex, 1)[0];
    this.products.set(updatedProducts);

    // update the UI icons
    this.toggleIcon(remvedProduct.id, 'cart');
    // update the store
    this.userItemsStore.RemoveItemFromCart(remvedProduct);
  }

  removeSavedItem(itemIndex: number) {
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
    this.userItemsStore.updateCart(this.products());
  }

  onClearCart() {
    for (let i = 0; i < this.products().length; i++) {
      this.toggleIcon((this.products()[i].id), "cart");
    }
    this.userItemsStore.updateCart([]);
  }

  onPay() {
    this.onNavigate('homepage');
    this.userItemsStore.updateCart([]);
  }

  private toggleIcon(productId: number, iconType: 'heart' | 'cart') {
    if (iconType === 'heart') {
      const heartIcon = document.getElementById('heart-svg-' + productId)
      heartIcon?.classList.toggle('product-card__nav--item-active-heart');
    } else {
      const cartIcon = document.getElementById('cart-svg-' + productId)
      cartIcon?.classList.toggle('product-card__nav--item-active-cart');
    }
  }
}
