import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoginToken, UserLogin } from 'src/app/home/types/user.type';
import { UserService } from '../../../services/user/user-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  userLoginForm: FormGroup;
  alertMessage: string = '';
  alertType: number = 0; //0-success 1-warning 2-error

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email(): AbstractControl<any, any> | null {
    return this.userLoginForm.get('email');
  }

  get password(): AbstractControl<any, any> | null {
    return this.userLoginForm.get('password');
  }

  onSubmit(): void {
    const userLogin: UserLogin = {
      email: this.userLoginForm.get('email')?.value,
      password: this.userLoginForm.get('password')?.value,
    };
    this.userService.loginUser(userLogin).subscribe({
      next: (result: LoginToken) => {
        result.user.email = this.email?.value;
        this.userService.activeToken(result);
        this.alertMessage = 'Login successful';
        this.alertType = 0;
        setTimeout(() => {
          this.location.back();
        }, 1000);
      },
      error: (error) => {
        this.alertMessage = error.error.message;
        this.alertType = 2;
      },
    });
  }
}
