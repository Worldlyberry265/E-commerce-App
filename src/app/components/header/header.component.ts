import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Router, RouterModule } from "@angular/router";
import { PreviewComponent } from "../preview/preview.component";
import { AuthStore } from "../../store/auth.store";

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
  private router = inject(Router);

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

  signOut() {
    this.authStore.DeleteJwt();
  }
}

