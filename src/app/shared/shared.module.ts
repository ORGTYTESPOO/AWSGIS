import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserAgentService} from "./user-agent/user-agent.service";


/*
 * @description: This module contains services and pipes that are available ( global ) to all components in this application
 */


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [UserAgentService],
  exports: [UserAgentService]
})
export class SharedModule { }
