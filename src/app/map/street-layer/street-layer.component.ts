import {Component, OnInit, Input} from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from '../../../environments/environment';
import * as axios from 'axios';
import { LayerType } from '../layertype';
import { loadTiles } from '../utils';
import { CognitoService, LoggedInCallback } from '../../cognito.service';

declare var ol: any;

@Component({
  selector: 'esp-street-layer',
  template: '<esp-street-layer-dialog [streetLayer]="streetLayer" [afterSave]="refreshLayer.bind(this)" [dialogParameterStream]="dialogParameterStream"></esp-street-layer-dialog>'
})
export class StreetLayerComponent implements OnInit, LoggedInCallback {

  @Input() map: any;
  @Input() mapClickObservable: Observable<ol.MapBrowserEvent>;
  streetLayer: any;
  dialogParameterStream: Subject<any>;
  streetConditionSource: ol.source.TileWMS;
  streetMaintenanceSource: ol.source.TileWMS;
  streetSource: ol.source.TileWMS;
  streetConditionLayer: ol.layer.Tile;
  streetMaintenanceLayer: ol.layer.Tile;
  jwtToken: string;

  constructor(private cognitoService: CognitoService) { }

  ngOnInit() {
    this.cognitoService.isAuthenticated(this);

    this.dialogParameterStream = new Subject();

    this.streetConditionSource = this.createWMSSource('kunto');
    this.streetMaintenanceSource = this.createWMSSource('kunnossapito');
    this.streetSource = this.createWMSSource('katu');

    this.streetConditionLayer = this.createWMSLayer(
      'Kunto',
      this.streetConditionSource,
      true
    );

    this.streetMaintenanceLayer = this.createWMSLayer(
      'Kunnossapito',
      this.streetMaintenanceSource,
      false
    );

    this.mapClickObservable.subscribe((e) => {
      const isVisible = this.streetConditionLayer.getVisible()
        || this.streetMaintenanceLayer.getVisible();

      if (!isVisible) {
        return;
      }

      let resolution = this.map.getView().getResolution();
      let params = {
        INFO_FORMAT: 'application/json'
      };

      let url = this.streetSource.getGetFeatureInfoUrl(
        e.coordinate,
        resolution,
        environment.projection,
        params
      );

      const options = {
        headers: {
          'Authorization': this.jwtToken
        }
      };

      axios.get(url, options)
        .then((res) => {
          let format = new ol.format.GeoJSON();
          let features = format.readFeatures(res.data);
          if (features.length > 0) {
            this.dialogParameterStream.next(features[0]);
          }
        });
    });

    this.map.addLayer(this.streetConditionLayer);
    this.map.addLayer(this.streetMaintenanceLayer);
  }

  isLoggedIn(message: string, loggedIn: boolean, jwtToken: string): void {
    if (loggedIn) {
      this.jwtToken = jwtToken;
    }
  }

  createWMSSource(layername: string) {
    return new ol.source.TileWMS({
      url: environment.geoserver + '/wms',
      params: {
        'LAYERS': layername,
        'TILED': true
      },
      tileLoadFunction: loadTiles.bind(null, this.jwtToken),
      serverType: 'geoserver'
    });
  }

  createWMSLayer(title: string, source: any, visible: boolean) {
    return new ol.layer.Tile({
      source: source,
      title: title,
      visible: visible,
      type: 'base',
      zIndex: 1
    });
  }

  refreshLayer() {
    // Update a dummy parameter to force layer refresh
    const salt = {salt: Math.random()};
    this.streetConditionSource.updateParams(salt);
    this.streetMaintenanceSource.updateParams(salt);
  }
}
