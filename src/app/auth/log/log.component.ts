import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../../header/header.component';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { minLengthBeforeAt, noConsecutiveHyphens, startsWithLetter, validDomainStructure } from './log-validators/email-validators';
import { containsMixedCharacters, passwordMatchValidator } from './log-validators/password-validators';
import { hasDesiredLength, noSpecialCharacters } from './log-validators/combined-validators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import * as AuthReducer from '../store/auth.reducer';
import { take } from 'rxjs';



@Component({
  selector: 'app-log',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, HeaderComponent, MatButtonModule, MatIconModule, CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss',
  animations: [
    // Define an animation trigger named 'formAnimation'
    trigger('form-1-Animation', [
      // Define the initial state (formType '1')
      state('1', style({
        left: '50%', // Position the form centrally
        opacity: 1   // Full opacity
      })),
      // Define the second state (formType '2')
      state('2', style({
        left: '-50%', // Move the form out of view
        opacity: 0,  // Reduced opacity
        // display: 'none'
      })),
      // Transition from state '1' to '2' and vice versa
      transition('1 <=> 2', [
        // Use cubic-bezier for the animation timing
        animate('0.3s cubic-bezier(0.645, 0.045, 0.355, 1)')
      ]),
    ]),
    trigger('form-2-Animation', [
      // Define the initial state (formType '1')
      state('1', style({
        left: '150%', // Position the form centrally
        opacity: 0,   // Full opacity
        // display: 'none'
      })),
      // Define the second state (formType '2')
      state('2', style({
        left: '50%', // Move the form out of view
        opacity: 1  // Reduced opacity
      })),
      state('3', style({
        left: '-50%',  // Move the form out of view to the left
        opacity: 0     // Reduced opacity
      })),
      // Transition from state '1' to '2' and vice versa
      transition('1 <=> 2', [
        // Use cubic-bezier for the animation timing
        animate('0.3s cubic-bezier(0.645, 0.045, 0.355, 1)')
      ]),
      transition('2 <=> 3', [
        animate('0.3s cubic-bezier(0.645, 0.045, 0.355, 1)')
      ]),
    ]),
    trigger('form-3-Animation', [
      // Define the initial state (formType '1')
      state('1', style({
        left: '150%', // Position the form centrally
        opacity: 0,   // Full opacity
        // display: 'none'
      })),
      // Define the second state (formType '2')
      state('2', style({
        left: '50%', // Move the form out of view
        opacity: 1  // Reduced opacity
      })),
      // Transition from state '1' to '2' and vice versa
      transition('1 <=> 2', [
        // Use cubic-bezier for the animation timing
        animate('0.3s cubic-bezier(0.645, 0.045, 0.355, 1)')
      ])
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogComponent implements AfterViewInit{

  // didnt use email validator because i implemented a more restricted ones
  emailFormControl = new FormControl('', [
    Validators.required,
    startsWithLetter(),
    noSpecialCharacters(),
    noConsecutiveHyphens(),
    minLengthBeforeAt(),
    validDomainStructure(),
    hasDesiredLength()
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    noSpecialCharacters(),
    noConsecutiveHyphens(),
    containsMixedCharacters(),
    hasDesiredLength()
  ]);
  passwordConfirmationFormControl = new FormControl('', [
    passwordMatchValidator(this.passwordFormControl)
  ]);



  // starts with letter then at least 5 letters/numbers/._- then @ then letters then  one or more of(. then at least 2 letters) for domains like lau.edu.lb
  // It also cant have -- double hyphens in the whole string to prevent the chances of sql injections
  EmailRegex = /^[a-zA-Z](?!.*--)[a-zA-Z0-9._-]{5,}@[a-zA-Z]+(\.[a-zA-Z]{2,})+$/; // add an if to check length < 50
  // should be at least 8 characters and have at least 1 capital and small letter, 1 number and 1  special character from the mentioned ones only
  Passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*])[A-Za-z\d!@#$%^*]{8,}$/;


  errorMessage = signal('');


  emailNotFound = false;
  formType: '1' | '2' = '1'; // TO move from 1st to to 2nd form 
  resetPassword: '1' | '2' = '1'; // To move from 2nd password form to 3rd reset form
  resetting: '1' | '2' = '2'; // to move from 3rd reset form to 1st login form

  // dummyEmails = ["dummy1@icloud.com", "dummy2@icloud.com", "dummy3@icloud.com"]

  isLoading = signal(false);

  showPass = signal(false);

  @ViewChild('inputField') input !: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  ngAfterViewInit(): void {
    // Added this bcz the navigating to the fragment logContainer using the routerlink is disabling the autofocus on it
      this.input.nativeElement.focus();
  }

  onSubmitForm() {
    this.router.navigate(['/homepage']);
  }

  togglePasswordVisibility() {
    this.showPass.update((currentVisibility) => !currentVisibility);
  }

  signingWithEmail() {

    this.isLoading.set(true);
  // ?? To avoid the it may be null error
    this.store.dispatch(AuthActions.EmailLogStart({ email: this.emailFormControl.value ?? 'email'}));

    this.store.select('auth').pipe(take(1))
      .subscribe({
        next: (state: AuthReducer.State) => {
          const eror = state.authError;
          if (eror) {
            this.errorMessage.set(eror);
          } else {
            this.emailNotFound = state.emailNotFound;
            this.isLoading.set(state.loading);
            this.triggerAnimation();
          }
        },
      })




    // let found = false;
    // this.dummyEmails.forEach((email) => {
    //   if (email === this.emailFormControl.value) {
    //     found = true;
    //   }
    // });
    // if (found) {
    //   this.emailNotFound = !this.emailNotFound;
    // }
  }

  protected triggerAnimation() {
    this.formType = this.formType === '1' ? '2' : '1';
  }

  onResetPassword() {
    this.resetPassword = this.resetPassword === '1' ? '2' : '1';
  }

  onToLogin() {
    this.resetting = this.resetting === '1' ? '2' : '1';
  }

  get getForm1Animation(): '1' | '2' {

    // if any of these variables changes, the getter triggers
    if (this.formType === '1' && this.resetPassword === '1' && this.resetting == '2') {
      return '1';
    } else if (this.formType === '1' && this.resetPassword == '2' && this.resetting == '1') {
      return '2';
    } else if (this.formType === '2' && this.resetPassword === '1') {
      return '2';
    } else if (this.formType === '2' && this.resetPassword === '2' && this.resetting === '1') {
      return '1';
    } else {
      return '2';
    }
  }

  get getForm2Animation2(): '1' | '2' | '3' { // formtype is the triggerer here
    if (this.formType == '2' && this.resetPassword == '1') {
      return '2';
    } else if (this.formType == '1' && this.resetPassword == '2' && this.resetting == '1') {
      return '2';
    } else if (this.formType === '1' && this.resetPassword === '1' && this.resetting == '1') {
      return '3';
    } else if (this.formType === '2' && this.resetPassword === '2' && this.resetting == '2') {
      return '3';
    } else {
      return '1';
    }
  }

  get getForm2Animation1(): '1' | '2' { // resetpassword is the triggerer here
    if (this.formType == '2' && this.resetPassword == '2' && this.resetting == '1') {
      return '2';
    } else if (this.formType == '1' && this.resetPassword == '2' && this.resetting == '1') {
      return '2';
    } else if (this.formType === '1' && this.resetPassword === '1' && this.resetting == '1') {
      return '2';
    } else if (this.formType == '1' && this.resetPassword == '1' && this.resetting == '2') {
      return '2';
    } else if (this.formType == '2' && this.resetPassword == '2' && this.resetting == '2') {
      return '2';
    } else {
      return '2';
    }
  }
  get getForm3Animation2(): '1' | '2' {
    if (this.formType === '1' && this.resetPassword === '1' && this.resetting == '1') {
      return '2';
    } else if (this.resetPassword == '1') {
      return '1';
    } else if (this.formType === '2' && this.resetPassword === '2' && this.resetting == '2') {
      return '2';
    } else {
      return '1'
    }
  }

  get getForm3Animation3(): '1' | '2' {
    if (this.formType === '1' && this.resetPassword === '1' && this.resetting == '1') {
      return '2';
    }
    else if (this.resetting == '1') {
      return '1';
    } else {
      return '1';
    }
  }
}
