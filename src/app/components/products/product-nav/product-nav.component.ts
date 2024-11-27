import { AfterViewInit, Component, effect, inject, input, signal } from '@angular/core';
import { AuthStore } from '../../../store/auth.store';
import { MatDialog } from '@angular/material/dialog';
import { PreviewComponent } from '../../preview/preview.component';
import { UserItemsStore } from '../../../store/user-items.store';
import { Product } from '../../../models/Product';

@Component({
  selector: 'nav[appProductNav]',
  standalone: true,
  imports: [],
  templateUrl: './product-nav.component.html',
  styleUrl: './product-nav.component.scss'
})
export class ProductNavComponent implements AfterViewInit {

  private readonly userItemsStore = inject(UserItemsStore);
  private readonly authStore = inject(AuthStore);
  readonly dialog = inject(MatDialog);

  product = input.required<Product>({ alias: 'appProductNav' });
  toggleIcon = input<boolean>(false);
  dialogType = signal('');

  Id = signal(0);

  cart!: HTMLElement | null;
  heart!: HTMLElement | null;

  constructor() {
    effect(() => {
      console.log("effect triggered from nav");

      if (this.toggleIcon() && this.dialogType() === 'heart') {
        this.heart = document.getElementById(`heart-svg-${this.Id()}`);
        if (this.heart) {
          this.heart.classList.toggle('product-card__nav--item-active-heart'); // Toggle the active class
        }
      }

      if (this.toggleIcon() && this.dialogType() === 'cart') {
        this.cart = document.getElementById(`cart-svg-${this.Id()}`);
        if (this.cart) {
          this.cart.classList.toggle('product-card__nav--item-active-cart'); // Toggle the active class
        }

      }

    });
  }

  ngAfterViewInit(): void {
    this.Id.set(this.product().id);
  }

  onToggleItem(dialogType: string) {
    this.dialogType.set(dialogType);
    if (dialogType === 'heart') {
      if (!this.authStore.jwt()) {
        this.dialog.open(PreviewComponent, {
          panelClass: 'preview',
          data: { DialogType: 'heart' }
        });
      } else {
        this.heart = document.getElementById(`heart-svg-${this.Id()}`);
        if (this.heart) {
          if (this.heart.classList.contains('product-card__nav--item-active-heart')) {
            this.userItemsStore.RemoveSavedItem(this.product());
          } else {
            this.userItemsStore.SaveItem(this.product());
          }
          this.heart.classList.toggle('product-card__nav--item-active-heart'); // Toggle the active class
        }
      }
    } else if (dialogType === 'cart') {
      this.cart = document.getElementById(`cart-svg-${this.Id()}`);
      if (this.cart) {
        if (this.cart.classList.contains('product-card__nav--item-active-cart')) {
          this.userItemsStore.RemoveItemFromCart(this.product());
        } else {
          this.userItemsStore.AddItemToCart(this.product());
        }
        this.cart.classList.toggle('product-card__nav--item-active-cart'); // Toggle the active class
      }
    }
  }
}
