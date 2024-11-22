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
  protected readonly productStore = inject(ProductStore);
  private router = inject(Router);

  displaySearchInput = input.required<boolean>({ alias: 'appHeader' })
  navigateToProducts = output<string>();

  readonly dialog = inject(MatDialog);

  // Only allows letters,spaces,numbers, and ,./()- (but not double hyphens) as they are used in some product titles.
  // It cant also start with a hyphen to cancel negative ids requests.
  inputRegex = /^(?!-)(?!.*--)[a-zA-Z0-9\s(),./-]*$/;



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

  onSearchForProduct(event: Event) {
    const productName = (event.target as HTMLInputElement).value;
    
    // To not send a request of empty and malicious input 
    if (this.inputRegex.test(productName)) {

    // If its an id then its greater than 0
    if(+productName > 0 ) { // the ids start from 0
      this.productStore.SearchForAProduct(+productName);
      // else it will be a string
    } else {
      this.productStore.SearchForAProduct(productName);
    }

    this.navigateToProducts.emit(productName);
    }

  }
}

