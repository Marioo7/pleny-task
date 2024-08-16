import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private helper = new JwtHelperService();
  private isLoggedIn: BehaviorSubject<boolean>;

  private headerOptions;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.isLoggedIn = new BehaviorSubject<boolean>(false);
    this.headerOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }

  login(cred: any): void {
    this.httpClient
      .post<any>(environment.AuthApi, JSON.stringify(cred), this.headerOptions)
      .subscribe((value) => {
        localStorage.setItem('token', value.token);
        this.router.navigateByUrl('');
      });
  }

  getIsLoggedIn(): BehaviorSubject<boolean> {
    return this.isLoggedIn;
  }

  setIsLoggedIn(value: boolean): void {
    this.isLoggedIn.next(value);
  }
}
