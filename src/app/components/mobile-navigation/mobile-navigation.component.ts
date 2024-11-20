import { Component, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Router, RouterModule } from "@angular/router";
import { PreviewComponent } from "../preview/preview.component";
import { AuthStore } from "../../store/auth.store";



@Component({
  selector: 'div[mobileNavigation]',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule, RouterModule],
  templateUrl: './mobile-navigation.component.html', 
  styleUrl: './mobile-navigation.component.scss'
})
export class MobileNavigationComponent {

  protected readonly authStore = inject(AuthStore);

  isOpen = signal(false);

  @ViewChild('mobileCheckbox') mobileCheckbox!: ElementRef;
  readonly dialog = inject(MatDialog);

  openDialog() {
      this.isOpen.set(true);
      this.mobileCheckbox.nativeElement.checked = false;

    const dialogRef = this.dialog.open(PreviewComponent, {
      panelClass: 'preview'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isOpen.set(false);
      console.log(`Dialog result: ${result}`);
    });
  }

  closeDialog() {
    this.mobileCheckbox.nativeElement.checked = false;
  }

  signOut() {
    this.authStore.DeleteJwt();
    this.mobileCheckbox.nativeElement.checked = false;
  }
}

