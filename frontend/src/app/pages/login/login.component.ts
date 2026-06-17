import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  public toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;

    const nameControl = this.loginForm.get('name');
    const passwordControl = this.loginForm.get('confirmPassword');

    if (this.isRegisterMode) {
      nameControl?.setValidators([Validators.required]);
      passwordControl?.setValidators([Validators.required]);
      this.loginForm.setValidators([this.passwordMatchValidator()])
    } else {
      nameControl?.clearValidators();
      passwordControl?.clearValidators();
      nameControl?.setValue('');
    }
    nameControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const formsData = this.loginForm.value;
    if (this.isRegisterMode) {
      this.authService.register(formsData).subscribe({
        next: (res) => {
          console.log('Usuario cadastrado com sucesso: ', res);
          alert('Conta criada com sucesso! Faca seu Login.');
          this.toggleMode();
        },
        error: (err) => {
          console.log('Erro no cadastro: ', err);
          alert(err.error?.error || 'Erro ao cadastrar usuario.');
        },
      });
    } else {
      this.authService.login(formsData).subscribe({
        next: (res) => {
          console.log('Login efetuado com sucesso: ', res);

          localStorage.setItem('userLogado', JSON.stringify(res.user));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.log('Erro no login: ', err);
          alert(err.error?.error || 'E-mail ou senha invalidas!');
        },
      });
    }
  }
}
