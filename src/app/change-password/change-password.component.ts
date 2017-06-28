import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { CognitoService, LoggedInCallback, CognitoCallback } from '../cognito.service';

@Component({
  selector: 'esp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit, CognitoCallback {
  username: string;
  oldPassword: string;
  newPassword: string;
  error: string

  constructor(private router: Router, private cognitoService: CognitoService) {
  }

  ngOnInit() {}

  changePassword() {
    if (!this.username || !this.oldPassword || !this.newPassword) {
      return;
    }

    this.cognitoService.changePassword(this.username, this.oldPassword, this.newPassword, this);
  }

  cognitoCallback(message: string, result: any) {
    if (!message) {
      this.router.navigate(['/login']);
    } else {
      this.error = message;
    }
  }
}
