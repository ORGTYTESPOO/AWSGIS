import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MapComponent} from "./map/map.component";
import {StreetLayerDialogComponent} from "./map/street-layer/street-layer-dialog/street-layer-dialog.component";
import {StreetLayerComponent} from "./map/street-layer/street-layer.component";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StreetLayerComponent,
    StreetLayerDialogComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
