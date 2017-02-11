import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes } from './routes';
import { AppComponent } from './app.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MapComponent} from "./components/map/map.component";
import {StreetLayerDialogComponent} from "./components/map/street-layer/street-layer-dialog/street-layer-dialog.component";
import {StreetLayerComponent} from "./components/map/street-layer/street-layer.component";
import { PatchLayerComponent } from './components/map/patch-layer/patch-layer.component';
import { PatchLayerDialogComponent } from './components/map/patch-layer/patch-layer-dialog/patch-layer-dialog.component';
import {RouterModule} from "@angular/router";
import {UserAgentService} from "./shared/user-agent/user-agent.service";

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
    NgbModule.forRoot(),
    RouterModule.forRoot(Routes)
  ],
  providers: [UserAgentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
