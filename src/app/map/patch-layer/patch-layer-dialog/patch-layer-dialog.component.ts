import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subject } from "rxjs";
import { environment } from '../../../../environments/environment';
import * as axios from 'axios';

/**
 * Hardcoded list of pavement types and related values combined together.
 *
 * Splitting the value by space (' ') can result into 3 parts:
 *   0: pavement type,
 *   1: grain size,
 *   2: kgm2
 */
const PAVEMENT_TYPES = [
  'SMA 11',
  'SMA 16',
  'AB 11',
  'AB 16',
  'AB 22',
  'AB 11/100',
  'AB 16/125',
  'AB 22/125',
  'ABK 31/125',
  'ABK 31/150',
  'PAB-B 16/125',
  'SIP/SOP',
  'Pintaus',
  'Uraremix',
  'AA 8/75',
  'AA 11/90'
];

const DEFAULT_PAVEMENT_TYPE = 'AB 11/100';

@Component({
  selector: 'esp-patch-layer-dialog',
  templateUrl: './patch-layer-dialog.component.html'
})
export class PatchLayerDialogComponent implements OnInit {

  @ViewChild('patchDialog') patchDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  @Input() addPatch: boolean;
  @Input() afterAdd: Function;
  @Input() afterSave: Function;
  modalRef: NgbModalRef;
  feature: ol.Feature;
  properties: Object;
  pavementTypes: Array<String> = PAVEMENT_TYPES;
  confirmDelete: boolean = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.dialogParameterStream.subscribe((feature: ol.Feature) => {
      this.feature = feature;
      this.properties = this.getProperties(feature);
      this.modalRef = this.modalService.open(this.patchDialog, feature);
    });
  }

  getProperties(feature: ol.Feature): Object {
    // Create combined pavement string
    const pavement = feature.get('pavement') || '';
    const grainSize = feature.get('grainsize') || '';
    const kgm2 = feature.get('kgm2') || '';

    let pavementCombined = '';
    if (pavement) {
      const parts = [pavement];

      if (grainSize && kgm2) {
        parts.push(`${grainSize}/${kgm2}`);
      } else if (grainSize) {
        parts.push(grainSize)
      }

      pavementCombined = parts.join(' ');
    }

    return {
      ready: feature.get('ready') || false,
      comment: feature.get('comment') || '',
      pavementCombined: pavementCombined || DEFAULT_PAVEMENT_TYPE
    };
  }

  assignProperties(): void {
    // Split the combined pavement string into individual properties
    const pavementCombined = this.properties['pavementCombined'];
    const [pavement, grainSizeKgm2] = pavementCombined.split(' ');
    let grainSize, kgm2 = '';

    if (grainSizeKgm2) {
      [grainSize, kgm2] = grainSizeKgm2.split('/');
    }

    this.feature.set('ready', this.properties['ready']);
    this.feature.set('type', 'A');
    this.feature.set('deleted', false);
    this.feature.set('pavement', pavement);
    this.feature.set('grainsize', grainSize || null);
    this.feature.set('kgm2', kgm2 || null);
    this.feature.set('updated', new Date().toISOString());
    this.feature.set('comment', this.properties['comment']);
  }

  save() {
    this.assignProperties();

    if (!this.addPatch) {
      this.feature.set('geom', this.feature.getGeometry());
      this.feature.unset('geometry');
      this.feature.unset('bbox');
    } else {
      this.feature.set('geom', this.feature.getGeometry());
    }

    const newFeatures = this.addPatch ? [this.feature] : [];
    const updateFeatures = this.addPatch ? [] : [this.feature];
    this.sendRequest(newFeatures, updateFeatures);
  }

  delete() {
    this.confirmDelete = false;
    this.assignProperties();
    this.feature.set('deleted', true);
    this.feature.set('geom', this.feature.getGeometry());
    this.feature.unset('geometry');
    this.feature.unset('bbox');
    this.sendRequest([], [this.feature]);
  }

  sendRequest(created: Array<ol.Feature>, updated: Array<ol.Feature>): void {
    let opts = {
      featureNS: 'espoo',
      featurePrefix: 'espoo',
      featureType: 'paikkauskohde3857',
      nativeElements: []
    };

    let format = new ol.format.WFS();
    let node = format.writeTransaction(created, updated, [], opts);
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

      this.afterSave();
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
