import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import { CognitoService, LoggedInCallback } from '../cognito.service';

@Component({
  selector: 'esp-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit, LoggedInCallback {

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.cognitoService.isAuthenticated(this);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
  }

}
