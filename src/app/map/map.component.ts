import { Component } from '@angular/core';
declare var L: any;

@Component({
  selector: 'esp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent {

  constructor() { }

  ngOnInit() {
    var map = L.map(document.getElementById('map')).setView([60.23, 24.8], 13);

    var basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var streetLayer = new L.WFST({
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/ows',
      typeNS: 'espoo',
      typeName: 'katu',
      geometryField: 'geom',
      style: {
        color: 'blue',
        weight: 2
      }
    }).addTo(map);

    var streetConditionLayer = new L.WFST({
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/ows',
      typeNS: 'espoo',
      typeName: 'katualueet_kuntotieto',
      geometryField: 'geom',
      style: {
        color: 'red',
        weight: 3
      }
    }).addTo(map);
  }
}
