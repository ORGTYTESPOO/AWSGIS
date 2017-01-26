import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as axios from 'axios';

@Component({
  selector: 'esp-street-layer-dialog',
  templateUrl: './street-layer-dialog.component.html'
})
export class StreetLayerDialogComponent implements OnInit {

  @ViewChild('streetConditionDialog') streetConditionDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  @Input() streetLayer: any;
  parameters: any;

  conditionOptions = [
    {value: 1, label: 'Erittäin huono'},
    {value: 2, label: 'Huono'},
    {value: 3, label: 'Tyydyttävä'},
    {value: 4, label: 'Hyvä'},
    {value: 5, label: 'Erinomainen'},
  ];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.dialogParameterStream.subscribe( (parameters: any) => {
      this.parameters = parameters;
      Observable.fromPromise(this.modalService.open(this.streetConditionDialog, parameters).result).subscribe( (e: any) => {
      }, () => {});
    })
  }

  save(): void {
    let opts = {
      featureNS: 'espoo',
      featurePrefix: 'espoo',
      featureType: 'katu',
      nativeElements: []
    };

    // hack... find a better way or atleast create a copy of the feature if this is necessary...
    this.parameters.set('geom', this.parameters.getGeometry());
    this.parameters.unset('geometry');
    this.parameters.unset('bbox');

    let format = new ol.format.WFS();
    let node = format.writeTransaction([], [this.parameters], [], opts);
    let serialized = new XMLSerializer().serializeToString(node);

    // doesn't work yet because geoserver says the layer is read-only...
    // check DB credentials and make sure there is primary id
    axios.post(
      'http://localhost:8080/geoserver/espoo/ows?service=WFS&version=1.1.0&request=Transaction',
      serialized,
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    )
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  }

}
