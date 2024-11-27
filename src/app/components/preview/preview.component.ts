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

  // numb = signal<number>(0);

  dialogType = signal<string>('');

  RemainingStarCount = 0;
  stars = signal(5);

  products = signal<Product[] | null>(null);

  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<PreviewComponent>);
  protected readonly authStore = inject(AuthStore);
  protected readonly userItemsStore = inject(UserItemsStore);

  // private data = inject(MAT_DIALOG_DATA);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { DialogType: string }) {
    this.dialogType.set(data.DialogType);

    this.products.set(this.userItemsStore.cartItems().map(product => ({ ...product, quantity: 1 })));
  }

  get starsCount(): number[] {
    this.RemainingStarCount = this.stars() - Math.floor(this.stars());
    return Array(Math.floor(this.stars()));

  }
  // TRY TO USE ITEM INSTEAD
  decrementQuantity(itemIndex: number) {
    const product = this.products()!.at(itemIndex);
    if (product!.quantity > 1) {
      --product!.quantity;
    } else { // else we remove the item

      // Create a copy of the products array without the item at `itemIndex`
      const updatedProducts = [...this.products()!];
      updatedProducts.splice(itemIndex, 1);

      // Update the signal with the new array
      this.products.set(updatedProducts);
    }
  }

  incrementQuantity(itemIndex: number) {
    const product = this.products()!.at(itemIndex);
    ++product!.quantity;
  }

  onNavigate() {
    this.dialogRef.close();
    // We need a timeout here because the dialogue isn't allowing us to navigate to the logContainer
    // So we wait for it to close then navigate
    setTimeout(() => {
      this.router.navigate(['login'], { fragment: 'logContainer' });
    }, 100);
  }
}
