import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Router, RouterModule } from "@angular/router";
import { PreviewComponent } from "../preview/preview.component";
import { AuthStore } from "../../store/auth.store";
import { UserItemsStore } from "../../store/user-items.store";

@Component({
  selector: 'div[mobileNavigation]',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, RouterModule],
  templateUrl: './mobile-navigation.component.html',
  styleUrl: './mobile-navigation.component.scss'
})
export class MobileNavigationComponent {

  protected readonly authStore = inject(AuthStore);
  protected readonly userItemsStore = inject(UserItemsStore);


  readonly dialog = inject(MatDialog);
  private router = inject(Router);

  @ViewChild('mobileCheckbox') mobileCheckbox!: ElementRef;

  onOpenDialog(dialogType: 'cart' | 'heart') {
    // We cant have the cart and this component displayed together, so we disable its display
    this.userItemsStore.CloseMobileNavigation();

    // This is to reset the mobile navigation, so its not opened when displayed again
    this.mobileCheckbox.nativeElement.checked = false;

    this.dialog.open(PreviewComponent, {
      panelClass: 'preview',
      data: { DialogType: dialogType }
    });
  }


  onCloseNavAndSaveRoute() {
    this.authStore.SaveCurrentRoute(this.router.url)
    this.onCloseNav();
  }

  onCloseNav() {
    this.mobileCheckbox.nativeElement.checked = false;
  }

  onSignOut() {
    this.authStore.SignOut();
    this.mobileCheckbox.nativeElement.checked = false;
  }
}

