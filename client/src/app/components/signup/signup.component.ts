import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  signupError: string | null = null;
  userInfo: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userInfo = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.userInfo.valid) {
      const { username, email, password } = this.userInfo.getRawValue();
      this.authService.signup(username, email, password).subscribe({
        next: res => {
          if (res?.status === 'success') {
            this.router.navigate(['/home']);
            this.signupError = null;
          } else {
            this.signupError = res?.message || 'Signup failed';
          }
        },
        error: error => {
          if (error.status === 401) {
            this.signupError = error.error?.message || 'Signup failed';
          } else {
            this.signupError = 'An error occurred during signup';
          }
        },
      });
    }
  }
}
