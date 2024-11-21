import { ChangeDetectionStrategy, Component, ElementRef, inject, input, Input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Router, RouterModule } from "@angular/router";
import { PreviewComponent } from "../preview/preview.component";
import { AuthStore } from "../../store/auth.store";
import { ProductStore } from "../../store/product.store";

@Component({
  selector: 'header[appHeader]',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  // protected to use it only in this component and its template
  protected readonly authStore = inject(AuthStore);
  protected readonly productsStore = inject(ProductStore);
  private router = inject(Router);

  displaySearchInput = input.required<boolean>({ alias: 'appHeader' })
  navigateToProducts = output<void>();

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(PreviewComponent, {
      panelClass: 'preview'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  signOut() {
    this.authStore.DeleteJwt();
  }

  onSearchForProduct(event: KeyboardEvent) {

    // if ((event.target as HTMLInputElement).value.length > 0) {
    const productName = (event.target as HTMLInputElement).value;
    this.productsStore.SearchForAProduct(productName);
    this.navigateToProducts.emit();
    // }

  }
}

