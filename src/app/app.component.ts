import { Component } from '@angular/core';
import './rxjs-operators';

import { CognitoService, LoggedInCallback } from './cognito.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements LoggedInCallback {

  constructor(public cognitoService: CognitoService) {}

  ngOnInit() {
    this.cognitoService.isAuthenticated(this);
  }

  isLoggedIn(message: string, loggedIn: boolean): void {
    console.log('AppComponent.isLoggedIn, message', message, ', loggedIn', loggedIn);
  }
}
