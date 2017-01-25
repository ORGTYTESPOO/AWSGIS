import {Component, OnInit, Input} from '@angular/core';
import {Subject} from "rxjs";

declare var L: any;

@Component({
  selector: 'esp-street-condition-layer',
  template: '<esp-street-condition-layer-dialog [dialogParameterStream]="dialogParameterStream"></esp-street-condition-layer-dialog>'
})
export class StreetConditionLayerComponent implements OnInit {

  @Input() map: any;
  streetConditionLayer: any;
  dialogParameterStream: Subject<any>;

  constructor() { }

  ngOnInit() {
    this.streetConditionLayer = new L.WFST({
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/ows',
      typeNS: 'espoo',
      typeName: 'katualueet_kuntotieto',
      geometryField: 'geom',
      style: {
        color: 'red',
        weight: 3
      }
    }).addTo(this.map);

    this.dialogParameterStream = new Subject();

    this.streetConditionLayer.on('click', (e) => {
      this.dialogParameterStream.next(e.layer.feature);
    });
  }

}
