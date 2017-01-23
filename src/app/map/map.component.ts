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
    var map = L.map(document.getElementById('map')).setView([60, 24], 9);

    var wmsLayer = L.tileLayer.wms('http://demo.opengeo.org/geoserver/ows?', {
      layers: 'ne:ne'
    }).addTo(map);

  }

}
