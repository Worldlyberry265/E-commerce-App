import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { AuthStore } from '../../../store/auth.store';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponent } from '../../preview/preview.component';
import { UserItemsStore } from '../../../store/user-items.store';
import { Product } from '../../../models/Product';
import { ProductStore } from '../../../store/product.store';

@Component({
  selector: 'nav[appProductNav]',
  standalone: true,
  imports: [],
  templateUrl: './product-nav.component.html',
  styleUrl: './product-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductNavComponent implements AfterViewInit {

  private readonly userItemsStore = inject(UserItemsStore);
  private readonly authStore = inject(AuthStore);
  readonly dialog = inject(MatDialog);

  product = input.required<Product>({ alias: 'appProductNav' });
  dialogType = signal('');

  cart!: HTMLElement | null;
  heart!: HTMLElement | null;

  ngAfterViewInit(): void {

    // !!!! IMPORTANT !!!!!!!!!!!!!!!!!
    this.cart = document.getElementById('cart-svg-' + this.product().id);
    if (this.userItemsStore.IsItemInCart(this.product().id)) {
      this.cart?.classList.add('product-card__nav--item-active-cart')
    }
    this.heart = document.getElementById('heart-svg-' + this.product().id);
    if (this.userItemsStore.IsItemSaved(this.product().id)) {
      this.heart?.classList.add('product-card__nav--item-active-heart')
    }


  }

  onToggleItem(dialogType: string) {
    this.dialogType.set(dialogType);
    if (dialogType === 'heart') {
      if (this.authStore.jwt()) {
        if (this.heart) {
          if (this.userItemsStore.IsItemSaved(this.product().id)) {
            this.userItemsStore.RemoveSavedItem(this.product());
          } else {
            this.userItemsStore.SaveItem(this.product());
          }
          this.heart.classList.toggle('product-card__nav--item-active-heart');
        }
      } else {
        // If the user isnt logged in then we cant save his item and ask him to sign in
        this.dialog.open(PreviewComponent, {
          panelClass: 'preview',
          data: { DialogType: 'heart' }
        });
      }
    } else if (dialogType === 'cart') {
      if (this.cart) {
        if (this.userItemsStore.IsItemInCart(this.product().id)) {
          this.userItemsStore.RemoveItemFromCart(this.product());
        } else {
          this.userItemsStore.AddItemToCart(this.product());
        }
        this.cart.classList.toggle('product-card__nav--item-active-cart');
      }
    }
  }
}
