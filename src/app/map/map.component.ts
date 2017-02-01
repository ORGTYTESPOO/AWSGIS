import { Component } from '@angular/core';
import * as ol from 'openlayers';
// declare var ol: any;


declare var isMobile: any;

@Component({
  selector: 'esp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent {

  map: any;
  showMap: boolean = false;

  constructor() { }

  ngOnInit() {
    console.log(ol);


    const centerLongitude = 24.82;
    const centerLatitude = 60.228;
    let centerCoordinate = ol.proj.fromLonLat([centerLongitude, centerLatitude]);
    let basemapLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    let defaultMapConfig = {
      target: 'map',
      view: new ol.View({
        center: centerCoordinate,
        zoom: 14
      })
    };

    if(isMobile.any && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( (result) => {
        centerCoordinate = ol.proj.fromLonLat([result.coords.longitude, result.coords.latitude])
        this.showMap = true;
        const geolocatedMapConfig = {
          target: 'map',
          view: new ol.View({
            center: centerCoordinate,
            zoom: 17
          })
        }
        this.map = new ol.Map(geolocatedMapConfig);
        this.map.addLayer(basemapLayer);
      }, () => {
        this.showMap = true;
        this.map = new ol.Map(defaultMapConfig);
        this.map.addLayer(basemapLayer);
      });
    } else {
      this.showMap = true;
      this.map = new ol.Map(defaultMapConfig);
      this.map.addLayer(basemapLayer);
    }







  }
}
