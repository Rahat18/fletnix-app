import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit{
  signUpForm!: FormGroup;
  loginForm!: FormGroup;
  isSignUpMode: boolean = true;
  hidePassword: boolean = true;
  user_type:any
  constructor(private fb: FormBuilder , private router: Router , private authService: AuthService) {

    // Initialize Sign Up Form
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', Validators.required]
    });

    // Initialize Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const userType = sessionStorage.getItem('user_type');
    this.isSignUpMode = userType !== 'false';
  }

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe(
        res => {
          console.log(res.msg);
         if(res.msg == 'User registered successfully'){
          this.router.navigate(['/shows']);
         }
        },
        err => {
          console.error(err);
        }
      );
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        res => {
          console.log(res.msg);
          if(res.msg == 'Login successful'){
            this.router.navigate(['/shows']);
          }
        },
        err => {
          console.error(err);
        }
      );
    }
  }
  onForgotPassword() {
    alert('Redirect to Forgot Password Page');
  }
  // Utility method to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  gotoHome(){
    this.router.navigate(['/']);
  }
}
