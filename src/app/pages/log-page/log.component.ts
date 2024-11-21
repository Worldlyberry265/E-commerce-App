import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../models/User';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthStore } from '../../store/auth.store';
import { minLengthBeforeAt, noConsecutiveHyphens, startsWithLetter, validDomainStructure } from '../../services/log-validators/email-validators';
import { hasDesiredLength, noSpecialCharacters } from '../../services/log-validators/combined-validators';
import { containsMixedCharacters, passwordMatchValidator } from '../../services/log-validators/password-validators';



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
      state('noAnimation', style({
        left: '50%', // Position the form centrally
        opacity: 1   // Full opacity
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
export class LogComponent implements AfterViewInit {

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


  // errorMessage = signal<string | null>('');


  formType: '1' | '2' = '1'; // TO move from 1st to to 2nd form 
  resetPassword: '1' | '2' = '1'; // To move from 2nd password form to 3rd reset form
  resetting: '1' | '2' = '2'; // to move from 3rd reset form to 1st login form

  showPass = signal(false);

  @ViewChild('inputField') input !: ElementRef<HTMLInputElement>;

  protected readonly authStore = inject(AuthStore);

  constructor() {

    effect(() => {
      if(this.authStore.authError() && !this.authStore.loading()) {
        setTimeout(() => {
          this.passwordFormControl.setErrors( { authError : true});          
        }, 1);        
      }
    });
    
  }

  ngAfterViewInit(): void {
    // Added this bcz the navigating to the fragment logContainer using the routerlink is disabling the autofocus on it
    this.input.nativeElement.focus();
  }

  onSubmitForm() {
    // To not let the user to make another request if he/she got an error untill he matches the passwords again
    this.passwordConfirmationFormControl.updateValueAndValidity();
    if(!this.passwordConfirmationFormControl.getError('passwordMismatch') || this.passwordConfirmationFormControl.value === '') {
      const user : User = {
        email: this.emailFormControl.value ?? 'anything since its for sure not null',
        password: this.passwordFormControl.value ?? 'anything since its for sure not null',
      }
      this.authStore.PasswordLog(user);
    }
  }

  signingWithEmail() {
    // ?? To avoid the it may be null error
    this.authStore.EmailLog(this.emailFormControl.value ?? 'anything since its for sure not null');
    if (this.authStore.authError()) {
      // 1001 just the enough time to pass the simulated time for the response.
      setTimeout(() => {
        this.emailFormControl.setErrors({ authError: true });
      }, 1001);
    } else {
      this.emailFormControl.setErrors({ authError: false });
      this.triggerAnimation();
    }

  }

  changeEmail() {
    this.triggerAnimation();
    // To remove the confirmed password if the user chose to login instead of signing up
    this.passwordConfirmationFormControl.setValue('');
  }


  protected triggerAnimation() {
    this.formType = this.formType === '1' ? '2' : '1';
    this.emailFormControl.updateValueAndValidity(); // to revalidate the form and enable the submit button
  }

  togglePasswordVisibility() {
    this.showPass.update((currentVisibility) => !currentVisibility);
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

  get getForm2Animation1(): '1' | '2' | 'noAnimation' { // resetpassword is the triggerer here
    if (this.formType == '2' && this.resetPassword == '2' && this.resetting == '1') {
      return '2';
    } else if (this.formType == '1' && this.resetPassword == '2' && this.resetting == '1') {
      return 'noAnimation';
    } else if (this.formType === '1' && this.resetPassword === '1' && this.resetting == '1') {
      return '2';
    } else if (this.formType == '1' && this.resetPassword == '1' && this.resetting == '2') {
      return '2';
    } else if (this.formType == '2' && this.resetPassword == '2' && this.resetting == '2') {
      return '2';
    } else if (this.authStore.authError()) {
      return 'noAnimation';
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
