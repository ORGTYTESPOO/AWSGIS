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

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    StreetLayerComponent,
    StreetLayerDialogComponent,
    PatchLayerComponent,
    PatchLayerDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
