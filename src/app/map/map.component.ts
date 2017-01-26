import { Component } from '@angular/core';
declare var ol: any;

@Component({
  selector: 'esp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent {

  map: any;

  constructor() { }

  ngOnInit() {
    const centerLongitude = 24.82;
    const centerLatitude = 60.228;
    const centerCoordinate = ol.proj.fromLonLat([centerLongitude, centerLatitude]);

    let basemapLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    this.map = new ol.Map({
      target: 'map',
      view: new ol.View({
        center: centerCoordinate,
        zoom: 14
      })
    });
    this.map.addLayer(basemapLayer);
  }
}
