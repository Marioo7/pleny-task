import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private auth: AuthService) {
    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  get formControlles() {
    return this.loginForm.controls;
  }

  getUserNameErrorMessage() {
    return this.loginForm.controls['userName'].hasError('required')
      ? 'required field'
      : '';
  }

  getPasswordErrorMessage() {
    return this.loginForm.controls['password'].hasError('required')
      ? 'required field'
      : '';
  }

  onSubmit(): void {
    const cred = {
      username: this.loginForm.controls['userName'].value,
      password: this.loginForm.controls['password'].value,
      expiresInMins: 60,
    };
    this.auth.login(cred);
  }
}
