import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  userInfo: FormGroup;
  loginError: string | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.userInfo = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    try {
      this.loginError = null;
      if (this.userInfo.valid) {
        const { username, password } = this.userInfo.getRawValue();
        this.authService.login(username, password).subscribe({
          next: (res: { status: string; message: string }) => {
            if (res?.status === 'success') {
              this.router.navigate(['/home']);
              this.loginError = null;
            } else {
              this.loginError = res?.message || 'Invalid username or password';
            }
          },
          error: (error: { status: number; error: { message: string } }) => {
            if (error.status === 401) {
              this.loginError = error.error?.message || 'Invalid credentials';
            } else {
              this.loginError = 'An error occurred during login';
            }
          },
        });
      }
    } catch {
      this.loginError = 'An unexpected error occurred';
    }
  }
}
