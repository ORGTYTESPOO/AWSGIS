import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { StreetLayerComponent } from './map/street-layer/street-layer.component';
import { StreetConditionLayerComponent } from './map/street-condition-layer/street-condition-layer.component';
import { StreetLayerDialogComponent } from './map/street-layer/street-layer-dialog/street-layer-dialog.component';
import { StreetConditionLayerDialogComponent } from './map/street-condition-layer/street-condition-layer-dialog/street-condition-layer-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StreetLayerComponent,
    StreetConditionLayerComponent,
    StreetLayerDialogComponent,
    StreetConditionLayerDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
