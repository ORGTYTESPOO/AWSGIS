import { Component, Output } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { LayerType } from './layertype';
import { environment } from '../../environments/environment';

declare var ol: any;
declare var isMobile: any;

@Component({
  selector: 'esp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent {

  map: any;
  showMap: boolean = false;
  mapClickObservable: Observable<ol.MapBrowserEvent>;

  constructor() { }

  ngOnInit() {
    const centerLongitude = 24.82;
    const centerLatitude = 60.228;
    let centerCoordinate = ol.proj.fromLonLat( [centerLongitude, centerLatitude] );
    let basemapLayer = new ol.layer.Tile( { source: new ol.source.OSM() });

    let defaultMapConfig = {
      target: 'map',
      view: new ol.View({
        center: centerCoordinate,
        zoom: 14
      })
    };

    if(isMobile.any && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (result) => {
        centerCoordinate = ol.proj.fromLonLat([result.coords.longitude, result.coords.latitude]);

        const geolocatedMapConfig = {
          target: 'map',
          view: new ol.View({
            center: centerCoordinate,
            zoom: 17
          })
        };
        this.initializeMap(geolocatedMapConfig, basemapLayer);
      }, () => {
        this.initializeMap(defaultMapConfig, basemapLayer);
      });
    } else {
      this.initializeMap(defaultMapConfig, basemapLayer);
    }

  }

  initializeMap(mapConfig: any, basemapLayer: any) {
    this.showMap = true;
    this.map = new ol.Map(mapConfig);
    this.mapClickObservable = Observable.fromEvent(this.map, 'click');
    this.map.addLayer(basemapLayer);
    this.map.addControl(new ol.control.LayerSwitcher());
 }
}
