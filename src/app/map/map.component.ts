import {Component, Output} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {LayerType} from './layertype';
import {environment} from '../../environments/environment';
import * as axios from 'axios';
import {UserAgentService} from "../useragent.service";
import {Router} from "@angular/router";

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
  showLegend: boolean = true;
  isReportVisible: boolean = false;

  constructor(private userAgentService: UserAgentService, private router: Router) {
  }

  ngOnInit() {
    const centerLongitude = 24.82;
    const centerLatitude = 60.228;
    let centerCoordinate = ol.proj.fromLonLat([centerLongitude, centerLatitude]);
    let basemapLayer = new ol.layer.Tile({source: new ol.source.OSM()});

    let defaultMapConfig = {
      target: 'map',
      view: new ol.View({
        center: centerCoordinate,
        zoom: 14
      })
    };

    if (isMobile.any && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((result) => {
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
    this.mapClickObservable = Observable.fromEvent(this.map, 'singleclick');
    this.map.addLayer(basemapLayer);
    this.map.addControl(this.getLayerSwitcherControl());
    this.map.addControl(this.getReportToggleControl());
    this.initializeLegend();
  }

  initializeLegend() {
    const getLegend = (layer) => {
      const source = layer.getSource();
      const layerName = source.getParams()['LAYERS'];
      const url = `${environment.geoserver}/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=espoo:${layerName}`;
      const legend = document.getElementById('legend');
      const img = document.createElement('img');
      img.setAttribute('src', url);
      legend.innerHTML = "";
      legend.appendChild(img);
    };

    const visibleHandler = (e) => {
      const layer = e.target;
      if (layer.getVisible() && layer.get('title')) {
        getLegend(layer);
      }
    };

    // Keep track of layers which already have the handler
    let events = {};
    const layers = this.map.getLayers();

    const addHandlers = () => {
      layers.forEach((layer: ol.layer.Base) => {
        const title = layer.get('title');
        if (title && !events[title]) {
          layer.on('change:visible', visibleHandler);
          events[title] = true;

          if (layer.getVisible()) {
            getLegend(layer);
          }
        }
      });
    };

    layers.on('add', addHandlers);
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

  /*
   * @description: Report toggle control
   */
  getReportToggleControl() {
    const _this = this;

    let reportToggleControl = function (opt_options): void {
      let options = opt_options || {};

      const reportToggleButton = document.getElementById('report-holder');
      reportToggleButton.addEventListener('click', (event: any) => {
        _this.toggleReport();
      });

      ol.control.Control.call(this, {
        element: reportToggleButton,
        target: options.target
      });

    };

    ol.inherits(reportToggleControl, ol.control.Control);
    return new reportToggleControl({target: 'map'});
  }

  toggleReport(): void {

    if (this.userAgentService.isMobileDevice()) {
      this.router.navigate(['/report']);
    } else {

      this.isReportVisible = !this.isReportVisible;

      setTimeout(() => { // update map size after on the next
        this.map.updateSize();
      }, 0);
    }
  }


  getLayerSwitcherControl() {
    this.map.getLayers().on('add', this.redrawLayerSwitcher, this);
    this.map.getLayers().on('remove', this.redrawLayerSwitcher, this);

    const _this = this;
    let layerSwitcherControl = function (opt_options): void {
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
