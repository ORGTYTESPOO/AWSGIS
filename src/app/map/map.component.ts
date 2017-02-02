import { Component } from '@angular/core';
import {Subject} from "rxjs";
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
  layerSelectionActionStream: Subject<string>;

  constructor() { }

  ngOnInit() {
    this.layerSelectionActionStream = new Subject();

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
    mapConfig.controls = ol.control.defaults().extend([ this.getStreetMaintenanceControl(), this.getStreetConditionControl() ]);
    this.map = new ol.Map(mapConfig);
    this.map.addLayer(basemapLayer);
  }

  getStreetMaintenanceControl() {
    const _this = this;

    let streetTypeSelectionControlConfiguration = function(opt_options): void {

      let options = opt_options || {};

      let button = document.createElement('button');
      button.innerHTML = 'KP';

      button.addEventListener('click', () => {
        _this.layerSelectionActionStream.next('kunnossapito');
      }, false);

      let element = document.getElementById('control');
      element.className = 'street-information ol-control';
      element.appendChild(button);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });

    };
    ol.inherits(streetTypeSelectionControlConfiguration, ol.control.Control);

    return new streetTypeSelectionControlConfiguration({target: 'map'});
  }

  getStreetConditionControl() {
    const _this = this;

    let streetTypeSelectionControlConfiguration = function(opt_options): void {

      let options = opt_options || {};

      let button = document.createElement('button');
      button.innerHTML = 'K';

      button.addEventListener('click', () => {
        _this.layerSelectionActionStream.next('kunto');
      }, false);

      let element = document.getElementById('control');
      element.className = 'street-information ol-control';
      element.appendChild(button);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });

    };
    ol.inherits(streetTypeSelectionControlConfiguration, ol.control.Control);

    return new streetTypeSelectionControlConfiguration({target: 'map'});
  }

}
