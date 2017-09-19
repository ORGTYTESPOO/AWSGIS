import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import { CognitoService, CognitoCallback } from '../cognito.service';

@Component({
  selector: 'esp-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit, CognitoCallback {
  username: string;
  error: string
  processing: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) {
  }

  ngOnInit() {}

  cognitoCallback(message: string, result: any) {
    this.processing = false;

    if (message) {
      this.error = message;
    } else {
      this.router.navigate(['/forgot-password', this.username]);
    }
  }

  retrieve() {
    this.processing = true;
    this.cognitoService.forgotPassword(this.username, this);
  }
}

@Component({
  selector: 'esp-forgot-password',
  templateUrl: './forgot-password-step2.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordStep2Component implements OnInit, OnDestroy, CognitoCallback {
  username: string;
  password: string;
  verifyPassword: string;
  verificationCode: string;
  error: string
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

  cognitoCallback(message: string, result: any) {
    this.processing = false;

    if (message) {
      this.error = message;
    } else {
      console.log('Password successfully changed.');
      this.router.navigate(['/login']);
    }
  }

  changePassword() {
    if (this.password !== this.verifyPassword) {
      this.error = 'Salasanat eivät täsmää.'
      return;
    }

    this.processing = true;
    this.error = '';
    this.cognitoService.confirmNewPassword(this.username, this.verificationCode, this.password, this);
  }
}
