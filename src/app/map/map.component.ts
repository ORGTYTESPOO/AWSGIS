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
    this.map.addControl(this.getLayerSwitcherControl());
  }

  redrawLayerSwitcher(e) {
    const select = document.getElementById('layer-switcher');
    select.innerHTML = "";
    this.map.getLayers().forEach((layer) => {
      const title = layer.get('title');
      if (title) {
        const option = document.createElement('option');
        option.value = title;
        option.innerHTML = title;

        if (layer.getVisible()) {
          option.selected = true;
        }

        select.appendChild(option);
      }
    });
  }

  getLayerSwitcherControl() {
    this.map.getLayers().on('add', this.redrawLayerSwitcher, this);
    this.map.getLayers().on('remove', this.redrawLayerSwitcher, this);

    const _this = this;
    let layerSwitcherControl = function(opt_options): void {
      let options = opt_options || {};

      let select = document.getElementById('layer-switcher');
      select.addEventListener('change', (e) => {
        _this.map.getLayers().forEach((layer) => {
          const title = layer.get('title');
          if (title) {
            layer.setVisible(title === e.target['value']);
          }
        });
      });

      ol.control.Control.call(this, {
        element: select,
        target: options.target
      });
    };
    ol.inherits(layerSwitcherControl, ol.control.Control);

    return new layerSwitcherControl({target: 'map'});
  }
}
