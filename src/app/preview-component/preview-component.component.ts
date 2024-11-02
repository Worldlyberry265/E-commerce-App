import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './preview-component.component.html',
  styleUrl: './preview-component.component.scss'
})
export class PreviewComponent {

}
