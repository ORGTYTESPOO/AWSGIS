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
  @Input() afterAdd: Function;
  modalRef: NgbModalRef;
  feature: ol.Feature;
  properties: Object;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.dialogParameterStream.subscribe((feature: ol.Feature) => {
      this.feature = feature;
      this.properties = this.getProperties(feature);
      this.modalRef = this.modalService.open(this.patchDialog, feature);
    });
  }

  getProperties(feature: ol.Feature): Object {
    return {
      ready: feature.get('ready') || false,
      pavement: feature.get('pavement'),
      comment: feature.get('comment') || ''
    };
  }

  assignProperties(): void {
    this.feature.set('ready', this.properties['ready']);
    this.feature.set('type', 'A');
    this.feature.set('deleted', false);
    this.feature.set('pavement', this.properties['pavement']);
    this.feature.set('grainsize', 4);
    this.feature.set('kgm2', 4);
    this.feature.set('updated', new Date().toISOString());
    this.feature.set('comment', this.properties['comment']);
  }

  save() {
    this.assignProperties();

    if (!this.addPatch) {
      this.feature.unset('geometry');
      this.feature.unset('bbox');
    } else {
      this.feature.set('geom', this.feature.getGeometry());
    }

    const newFeatures = this.addPatch ? [this.feature] : [];
    const updateFeatures = this.addPatch ? [] : [this.feature];
    this.sendRequest(newFeatures, updateFeatures, []);
  }

  delete() {
    this.assignProperties();
    this.feature.set('deleted', true);
    this.feature.unset('geometry');
    this.feature.unset('bbox');
    this.sendRequest([], [this.feature], []);
  }

  sendRequest(created: Array<ol.Feature>, updated: Array<ol.Feature>, deleted: Array<ol.Feature>): void {
    let opts = {
      featureNS: 'espoo',
      featurePrefix: 'espoo',
      featureType: 'paikkauskohde3857',
      nativeElements: []
    };

    let format = new ol.format.WFS();
    let node = format.writeTransaction(created, updated, deleted, opts);
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

      if (this.addPatch) {
        this.afterAdd();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
