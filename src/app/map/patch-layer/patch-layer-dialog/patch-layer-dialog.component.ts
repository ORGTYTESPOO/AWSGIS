import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import * as axios from 'axios';

@Component({
  selector: 'esp-patch-layer-dialog',
  templateUrl: './patch-layer-dialog.component.html'
})
export class PatchLayerDialogComponent implements OnInit {

  @ViewChild('patchDialog') patchDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  @Input() addPatch: boolean;
  modalRef: NgbModalRef;
  feature: ol.Feature;
  ready: boolean

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
    this.feature.set('type', 'A');
    this.feature.set('deleted', false);
    this.feature.set('pavement', 'pav');
    this.feature.set('grainsize', 4);
    this.feature.set('kgm2', 4);
    this.feature.set('updated', new Date().toISOString());
    this.feature.set('comment', 'kommentti');

    let opts = {
      featureNS: 'espoo',
      featurePrefix: 'espoo',
      featureType: 'paikkauskohde3857',
      nativeElements: []
    };

    if (!this.addPatch) {
      this.feature.unset('geometry');
      this.feature.unset('bbox');
    } else {
      this.feature.set('geom', this.feature.getGeometry());
    }

    const newFeatures = this.addPatch ? [this.feature] : [];
    const updateFeatures = this.addPatch ? [] : [this.feature];

    let format = new ol.format.WFS();
    let node = format.writeTransaction(newFeatures, updateFeatures, [], opts);
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
