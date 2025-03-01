import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  constructor(private fb: FormBuilder , private router: Router , private authService: AuthService , private snackBar: MatSnackBar) {

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
signupSuccess:boolean=false;
  onSignUp() {
    if (this.signUpForm.valid) {
      this.authService.register(this.signUpForm.value).subscribe(
        res => {
          // console.log(res.msg);
          // this.router.navigate(['/shows']);
          this.isSignUpMode = false
        //  if(res){
        //   this.router.navigate(['/shows']);
        //  }
        this.snackBar.open('Signup Succesfull');
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
        (res: any) => {
          // console.log(res);
  
          localStorage.setItem('token', res.token);
  
          const decoded = jwtDecode(res.token);
          // console.log('Decoded Token:', decoded);
  
          if (decoded) {
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
