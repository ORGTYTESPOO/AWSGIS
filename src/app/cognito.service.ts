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

    callback.isLoggedIn('callback message', true);
  }
}
