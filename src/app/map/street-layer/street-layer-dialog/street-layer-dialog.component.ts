import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { environment } from '../../../../environments/environment';
import * as axios from 'axios';
import * as moment from 'moment';
import { CognitoService, LoggedInCallback } from '../../../cognito.service';

@Component({
  selector: 'esp-street-layer-dialog',
  templateUrl: './street-layer-dialog.component.html'
})
export class StreetLayerDialogComponent implements OnInit, LoggedInCallback {

  @ViewChild('streetConditionDialog') streetConditionDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  @Input() streetLayer: any;
  @Input() afterSave: Function;
  modalRef: NgbModalRef;
  parameters: any;
  properties: any;
  success: boolean;
  error: boolean;
  jwtToken: string;

  conditionOptions = [
    {value: 1, label: 'Erittäin huono'},
    {value: 2, label: 'Huono'},
    {value: 3, label: 'Tyydyttävä'},
    {value: 4, label: 'Hyvä'},
    {value: 5, label: 'Erinomainen'},
  ];

  constructor(private modalService: NgbModal, private cognitoService: CognitoService) { }

  ngOnInit() {
    this.cognitoService.isAuthenticated(this);
    this.dialogParameterStream.subscribe( (parameters: any) => {
      this.parameters = parameters;
      this.properties = parameters.getProperties();

      const updated = moment(parameters.get('updated'), 'YYYY-MM-DDZ');
      this.properties.updated = updated.isValid()
        ? updated.format('DD.MM.YYYY')
        : '';

      this.success = null;
      this.error = null;
      this.modalRef = this.modalService.open(this.streetConditionDialog, parameters);
    })
  }

  isLoggedIn(message: string, loggedIn: boolean, jwtToken: string): void {
    if (loggedIn) {
      this.jwtToken = jwtToken;
    }
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
    this.parameters.set('comment', this.properties.comment);

    // Ugly hack... unset unnecessary attributes from the object to prevent
    // error from Geoserver. Find a nicer way to handle this.
    let geometry = this.parameters.get('geometry');
    let bbox = this.parameters.get('bbox');
    this.parameters.unset('geometry');
    this.parameters.unset('bbox');

    this.parameters.set('updated', new Date().toISOString());

    let format = new ol.format.WFS();
    let node = format.writeTransaction([], [this.parameters], [], opts);
    let serialized = new XMLSerializer().serializeToString(node);

    // Restore the unset attributes
    this.parameters.set('geometry', geometry);
    this.parameters.set('bbox', bbox);

    axios.post(
      environment.geoserver + '/ows?service=WFS&version=1.1.0&request=Transaction',
      serialized,
      {
        headers: {
          'Content-Type': 'text/xml',
          'Authorization': this.jwtToken
        }
      }
    )
    .then((result) => {
      this.success = true;
      this.modalRef.close();
      this.afterSave();
    })
    .catch((err) => {
      this.error = true;
    });
  }

}
