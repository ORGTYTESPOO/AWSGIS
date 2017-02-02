import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import * as axios from 'axios';

@Component({
  selector: 'esp-street-layer-dialog',
  templateUrl: './street-layer-dialog.component.html'
})
export class StreetLayerDialogComponent implements OnInit {

  @ViewChild('streetConditionDialog') streetConditionDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  @Input() streetLayer: any;
  modalRef: NgbModalRef;
  parameters: any;
  properties: any;
  success: boolean;
  error: boolean;

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
      this.properties = parameters.getProperties();
      this.success = null;
      this.error = null;
      this.modalRef = this.modalService.open(this.streetConditionDialog, parameters);
    })
  }

  save(): void {
    let opts = {
      featureNS: 'espoo',
      featurePrefix: 'espoo',
      featureType: 'katu',
      nativeElements: []
    };

    // Set the modified worstura property to the feature to be serialized
    this.parameters.set('worstura', this.properties.worstura)

    // Ugly hack... unset unnecessary attributes from the object to prevent
    // error from Geoserver. Find a nicer way to handle this.
    let geometry = this.parameters.get('geometry');
    let bbox = this.parameters.get('bbox');
    this.parameters.unset('geometry');
    this.parameters.unset('bbox');

    let format = new ol.format.WFS();
    let node = format.writeTransaction([], [this.parameters], [], opts);
    let serialized = new XMLSerializer().serializeToString(node);

    // Restore the unset attributes
    this.parameters.set('geometry', geometry);
    this.parameters.set('bbox', bbox);

    axios.post(
      // 'http://localhost:8080/geoserver/espoo/ows?service=WFS&version=1.1.0&request=Transaction',
      'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/ows?service=WFS&version=1.1.0&request=Transaction',
      serialized,
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    )
    .then((result) => {
      this.success = true;
      this.modalRef.close();
    })
    .catch((err) => {
      this.error = true;
    });
  }

}
