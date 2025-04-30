import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(NonNullableFormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  msg = signal('');

  form = this.fb.group<{
    username:FormControl<string>,
    password:FormControl<string>,
  }>({
    username:this.fb.control('',Validators.required),
    password:this.fb.control('',Validators.required),
  });
}
