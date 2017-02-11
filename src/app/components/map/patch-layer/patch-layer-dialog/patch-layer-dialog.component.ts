import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subject } from "rxjs";
import { environment } from '../../../../../environments/environment';
import * as axios from 'axios';

@Component({
  selector: 'esp-patch-layer-dialog',
  templateUrl: './patch-layer-dialog.component.html'
})
export class PatchLayerDialogComponent implements OnInit {

  @ViewChild('patchDialog') patchDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  modalRef: NgbModalRef;
  feature: ol.Feature;
  ready: boolean;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.dialogParameterStream.subscribe((feature: ol.Feature) => {
      this.feature = feature;
      this.ready = feature.get('ready');
      this.modalRef = this.modalService.open(this.patchDialog, feature);
    });
  }

  save() {
    this.feature.set('ready', this.ready);

    let opts = {
      featureNS: 'espoo',
      featurePrefix: 'espoo',
      featureType: 'paikkauskohde',
      nativeElements: []
    };

    this.feature.unset('geometry');
    this.feature.unset('bbox');

    let format = new ol.format.WFS();
    let node = format.writeTransaction([], [this.feature], [], opts);
    let serialized = new XMLSerializer().serializeToString(node);

    axios.post(
      environment.geoserver + '/ows?service=WFS&version=1.1.0&request=Transaction',
      serialized,
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    )
    .then((result) => {
      this.modalRef.close();
    })
    .catch((err) => {
      console.log(err);
    });

  }

}
