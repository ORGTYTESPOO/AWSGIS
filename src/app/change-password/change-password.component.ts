import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import { CognitoService, LoggedInCallback, CognitoCallback } from '../cognito.service';

@Component({
  selector: 'esp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit, OnDestroy, CognitoCallback {
  username: string;
  oldPassword: string;
  newPassword: string;
  verifyPassword: string;
  error: string;
  processing: boolean = false;
  private sub: any;

  constructor(private router: Router, public route: ActivatedRoute, private cognitoService: CognitoService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.username = params['username'];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  changePassword() {
    if (!this.username || !this.oldPassword || !this.newPassword || !this.verifyPassword) {
      return;
    }

    if (this.newPassword !== this.verifyPassword) {
      this.error = 'Salasanat eivät täsmää.';
      return;
    }

    this.processing = true;
    this.error = '';
    this.cognitoService.changePassword(this.username, this.oldPassword, this.newPassword, this);
  }

  cognitoCallback(message: string, result: any) {
    this.processing = false;
    if (!message) {
      this.router.navigate(['/login']);
    } else {
      this.error = message;
    }
  }
}
