import { Injectable } from '@angular/core';

declare var isMobile: any;

@Injectable()
export class UserAgentService {

  constructor() { }

  isMobileDevice() {
    return isMobile.any;
  }

}
