import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { CognitoService, LoggedInCallback } from '../cognito.service';

@Component({
  selector: 'esp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, LoggedInCallback {

  username: string;
  password: string;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.cognitoService.isAuthenticated(this);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
    if (loggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {}

  login() {
    if (!this.username || !this.password) {
      return;
    }

    this.cognitoService.login(this.username, this.password, this);
  }
}
