import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { PreviewComponent } from '../preview-component/preview-component.component';

@Component({
  selector: 'header[appHeader]',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

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

