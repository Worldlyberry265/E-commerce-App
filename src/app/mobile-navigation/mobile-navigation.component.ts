import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PreviewComponent } from '../preview-component/preview-component.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'div[mobileNavigation]',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule, RouterModule],
  templateUrl: './mobile-navigation.component.html',
  styleUrl: './mobile-navigation.component.scss'
})
export class MobileNavigationComponent {

  isOpen = signal(false);

  @ViewChild('mobileCheckbox') mobileCheckbox!: ElementRef;
  readonly dialog = inject(MatDialog);

  constructor( private router : Router) {}

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

  onNavigate(link : string) {
    this.mobileCheckbox.nativeElement.checked = false;
    this.router.navigate([link]);
  }
}

