import { ChangeDetectionStrategy, Component, Inject, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { AuthStore } from "../../store/auth.store";

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, RouterModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent {

  numb = signal<number>(0);

  dialogType = signal<string>('');

  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<PreviewComponent>);
  protected readonly authStore = inject(AuthStore);

  // private data = inject(MAT_DIALOG_DATA);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {DialogType : string}) {
    this.dialogType.set(data.DialogType);
    console.log(`from dialogue: ${this.dialogType()}`);
    console.log(this.dialogType());
    console.log(`type of dialoguetype: ${typeof(this.dialogType())}`);
    
    console.log(this.dialogType() == 'cart');
    
    
  }

  decrementQuantity() {
    if(this.numb() > 0) {
      this.numb.update(oldVal => --oldVal);
    }
  }

  incrementQuantity() {
    this.numb.update(oldVal => ++oldVal);
  }

  onNavigate() {
    this.dialogRef.close();
    // We need a timeout here because the dialogue isn't allowing us to navigate to the logContainer
    // So we wait for it to close then navigate
    setTimeout(() => {
      this.router.navigate(['login'], {fragment: 'logContainer'});
    }, 100);
    }
}
