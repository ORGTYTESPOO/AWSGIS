import { Injectable } from '@angular/core';

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

@Injectable()
export class CognitoService {

  constructor() { }

  isAuthenticated(callback: LoggedInCallback) {
    if (callback === null) {
      throw new Error('No callback provided');
    }

    callback.isLoggedIn('callback message', false);
  }

  login(username: string, password: string, callback: LoggedInCallback) {
    console.log('Try to login with username/password', username, password);
    callback.isLoggedIn('callback message', false);
  }
}
