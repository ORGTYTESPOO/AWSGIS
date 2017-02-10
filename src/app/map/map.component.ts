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
  addPatch: boolean = false;
  activeLayer: LayerType = LayerType.Street;

  addPatchButton: Element;
  streetLayerButton: Element;
  patchLayerButton: Element;

  constructor() { }

  ngOnInit() {
    this.addPatchButton = document.getElementById('add-patch');
    this.streetLayerButton = document.getElementById('street-layer');
    this.patchLayerButton = document.getElementById('patch-layer');

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
    this.map.addControl(this.getAddPatchControl());
    this.map.addControl(this.getActiveLayerControl());
    this.enableStreetLayer();
 }

  getAddPatchControl() {
    const _this = this;

    let addPatchControlConfig = function(opt_options): void {
      let options = opt_options || {};

      let button = document.getElementById('add-patch');
      let element = document.getElementById('controls');
      button.addEventListener('click', () => {
        if (_this.addPatch) {
          _this.disableAddPatch.call(_this);
        } else {
          _this.enabledAddPatch.call(_this);
        }
      }, false);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });
    };
    ol.inherits(addPatchControlConfig, ol.control.Control);

    return new addPatchControlConfig({target: 'map'});
  }

  getActiveLayerControl() {
    const _this = this;

    let activeLayerControlConfig = function(opt_options): void {
      let options = opt_options || {};

      let streetLayerButton = document.getElementById('street-layer');
      let patchLayerButton = document.getElementById('patch-layer');
      patchLayerButton.addEventListener('click', _this.enablePatchLayer.bind(_this), false);
      streetLayerButton.addEventListener('click', _this.enableStreetLayer.bind(_this), false);

      ol.control.Control.call(this, {
        element: document.getElementById('controls'),
        target: options.target
      });
    };
    ol.inherits(activeLayerControlConfig, ol.control.Control);

    return new activeLayerControlConfig({target: 'map'});
  }

  enableStreetLayer() {
    this.activeLayer = LayerType.Street;
    this.disableAddPatch();
    this.streetLayerButton.classList.add('selected');
    this.patchLayerButton.classList.remove('selected');
  }

  enablePatchLayer() {
    this.activeLayer = LayerType.Patch;
    this.streetLayerButton.classList.remove('selected');
    this.patchLayerButton.classList.add('selected');
  }

  enabledAddPatch() {
    this.addPatch = true;
    this.activeLayer = LayerType.Patch;
    this.addPatchButton.classList.add('selected');
    this.patchLayerButton.classList.add('selected');
    this.streetLayerButton.classList.remove('selected');
  }

  disableAddPatch() {
    this.addPatch = false;
    this.addPatchButton.classList.remove('selected');
  }
}
