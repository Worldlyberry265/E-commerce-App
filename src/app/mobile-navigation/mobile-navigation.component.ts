import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PreviewComponent } from '../preview-component/preview-component.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'div[mobileNavigation]',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './mobile-navigation.component.html',
  styleUrl: './mobile-navigation.component.scss'
})
export class MobileNavigationComponent {

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
}

