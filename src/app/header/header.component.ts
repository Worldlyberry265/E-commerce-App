import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { PreviewComponent } from '../preview-component/preview-component.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'header[appHeader]',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  @Input({required: true}) displaySearchInput : boolean = true;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(PreviewComponent, {
      panelClass: 'preview'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

