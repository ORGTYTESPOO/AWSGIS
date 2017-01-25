import {Component, OnInit, Input} from '@angular/core';
import {Observable, Subject} from "rxjs";

declare var L: any;

@Component({
  selector: 'esp-street-layer',
  template: '<esp-street-layer-dialog [dialogParameterStream]="dialogParameterStream"></esp-street-layer-dialog>'
})
export class StreetLayerComponent implements OnInit {

  @Input() map: any;
  streetLayer: any;
  dialogParameterStream: Subject<any>;

  constructor() { }

  ngOnInit() {
    this.streetLayer = new L.WFST({
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/ows',
      typeNS: 'espoo',
      typeName: 'katu',
      geometryField: 'geom',
      style: {
        color: 'blue',
        weight: 2
      }
    }).addTo(this.map);

    this.dialogParameterStream = new Subject();

    this.streetLayer.on('click', (e) => {
      this.dialogParameterStream.next(e.layer.feature);
    });

  }

}
