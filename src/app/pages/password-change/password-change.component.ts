import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { hasDesiredLength, noConsecutiveHyphens, noSpecialCharacters } from '../../services/log-validators/combined-validators';
import { containsMixedCharacters, passwordMatchValidator } from '../../services/log-validators/password-validators';
import { AuthStore } from '../../store/auth.store';
import { JwtDecodeService } from '../../services/auth/jwt-decode.service';
import { PreviewComponent } from '../../components/preview/preview.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, HeaderComponent, MatButtonModule, MatIconModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordChangeComponent {

  passwordFormControl = new FormControl('', [
    Validators.required,
    noSpecialCharacters(),
    noConsecutiveHyphens(),
    containsMixedCharacters(),
    hasDesiredLength()
  ]);
  passwordConfirmationFormControl = new FormControl('', [
    Validators.required,
    passwordMatchValidator(this.passwordFormControl)
  ]);

  showPass = signal(false);

  protected readonly authStore = inject(AuthStore);
  private jwtDecoder = inject(JwtDecodeService);

  readonly dialog = inject(MatDialog);


  constructor() {

    effect(() => {
      if (this.authStore.authError() && this.authStore.loading() === false) {
        // We only display the errors at the input field when the request times out
        if (this.authStore.authError() == 'Request Timed Out') {
          setTimeout(() => {
            this.passwordFormControl.setErrors({ authError: true });
          }, 1);
        } else {
          // If it's not a request timed out, then it's an expired jwt error, that's why we don't want to display
          // an error at the input field
          this.passwordFormControl.setErrors({ authError: false });
          this.passwordFormControl.updateValueAndValidity();
        }
      }
    })
  }

  onSubmitForm() {
    // This if is only a double check, it's not completely neccassary due to the form validators we already have
    if (!this.passwordConfirmationFormControl.getError('passwordMismatch')) {
      // It won't process the request unless the password matches
      const password = this.passwordFormControl.value ?? 'anything since its for sure not null';
      const id = this.jwtDecoder.fetchId(this.authStore.jwt()!)
      this.authStore.ChangePassword({ password: password, userId: id });

      // When the interceptor declines the request due to expired jwt, we opens the preview to display the error
      // instead of displaying it at the input field.
      // And we then ask the user to kindly sign in
      if (this.authStore.authError() && this.authStore.authError() !== 'Request Timed Out') {
        this.dialog.open(PreviewComponent, {
          panelClass: 'preview',
          data: { DialogType: 'Expired Jwt' }
        });
      }

    }
  }

  onTogglePasswordVisibility() {
    this.showPass.update((currentVisibility) => !currentVisibility);
  }

}
