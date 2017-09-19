import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { CognitoService, LoggedInCallback, CognitoCallback } from '../cognito.service';

@Component({
  selector: 'esp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, LoggedInCallback, CognitoCallback {

  username: string;
  password: string;
  error: string;
  processing: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.cognitoService.isAuthenticated(this);
  }

  isLoggedIn(message: string, loggedIn: boolean, jwtToken: string): void {
    if (loggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {}

  login() {
    if (!this.username || !this.password) {
      return;
    }

    this.processing = true;
    this.cognitoService.login(this.username, this.password, this);
  }

  forgot() {
    this.router.navigate(['/forgot-password']);
  }

  cognitoCallback(message: string, result: any) {
    this.processing = false;
    if (!message) {
      this.router.navigate(['/']);
    } else if (message === 'User needs to set password.') {
      this.router.navigate(['/change-password']);
    } else {
      this.error = message;
    }
  }
}
