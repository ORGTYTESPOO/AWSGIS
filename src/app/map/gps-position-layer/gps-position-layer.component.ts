import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var isMobile: any;

@Component({
  selector: 'esp-gps-position-layer',
  templateUrl: './gps-position-layer.component.html',
  styleUrls: ['./gps-position-layer.component.less']
})
export class GpsPositionLayerComponent implements OnInit {

  @Input() map: ol.Map;

  constructor() { }

  ngOnInit() {
    if (isMobile.any && navigator.geolocation) {
      this.initGpsTracking();
    }
  }

  initGpsTracking() {
    const geolocation = new ol.Geolocation({
      tracking: true,
      projection: environment.projection
    });

    const positionMarker = new ol.Overlay({
      element: document.getElementById('my-location'),
      positioning: 'center-center'
    });

    geolocation.on('change:position', (e) => {
      positionMarker.setPosition(geolocation.getPosition());
    });

    this.map.addOverlay(positionMarker);
  }
}
