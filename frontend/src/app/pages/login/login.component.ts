import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isRegisterMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;

    const nameControl = this.loginForm.get('name');

    if (this.isRegisterMode) {
      nameControl?.setValidators([Validators.required]);
    } else {
      nameControl?.clearValidators();
      nameControl?.setValue('');
    }
    nameControl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const formsData = this.loginForm.value;
    console.log('Dados enviados', formsData);

    this.router.navigate(['/dashboard']);
  }
}
