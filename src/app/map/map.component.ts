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
    // this.map = L.map(document.getElementById('map')).setView([60.23, 24.8], 13);
    //
    // var basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   maxZoom: 19,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(this.map);
  //
    // Create map with OSM base layer and the marker layer
    var map = new ol.Map({
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      target: 'map',
      view: new ol.View({
        projection: 'EPSG:900913',
        center: [18.0, 55.4],
        zoom: 7
      })
    });

  }
}
