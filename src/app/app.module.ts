import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MapComponent} from "./map/map.component";
import {StreetLayerDialogComponent} from "./map/street-layer/street-layer-dialog/street-layer-dialog.component";
import {StreetLayerComponent} from "./map/street-layer/street-layer.component";
import { PatchLayerComponent } from './map/patch-layer/patch-layer.component';
import { PatchLayerDialogComponent } from './map/patch-layer/patch-layer-dialog/patch-layer-dialog.component';
import {Routes} from "./routes";
import {RouterModule} from "@angular/router";
import { ReportComponent } from './report/report.component';
import {UserAgentService} from "./useragent.service";
import { GpsPositionLayerComponent } from './map/gps-position-layer/gps-position-layer.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent, ForgotPasswordStep2Component } from './forgot-password/forgot-password.component';
import { CognitoService } from './cognito.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StreetLayerComponent,
    StreetLayerDialogComponent,
    PatchLayerComponent,
    PatchLayerDialogComponent,
    ReportComponent,
    GpsPositionLayerComponent,
    LoginComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ForgotPasswordStep2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(Routes)
  ],
  providers: [UserAgentService, CognitoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
