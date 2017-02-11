import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from '../../../environments/environment';
import * as axios from 'axios';
import { LayerType } from '../layertype';

declare var ol: any;

@Component({
  selector: 'esp-patch-layer',
  template: '<esp-patch-layer-dialog [dialogParameterStream]="dialogParameterStream" [addPatch]="addPatch"></esp-patch-layer-dialog>'
})
export class PatchLayerComponent implements OnInit {

  @Input() map: ol.Map;
  @Input() mapClickObservable: Observable<ol.MapBrowserEvent>;
  dialogParameterStream: Subject<any>;
  patchLayerSource: ol.source.TileWMS;
  patchLayer: ol.layer.Tile;
  addPatch: boolean = false;
  addPatchButton: Element;
  addPatchControl: ol.control.Control;

  constructor() { }

  ngOnInit() {
    this.addPatchButton = document.getElementById('add-patch');
    this.addPatchControl = this.getAddPatchControl();

    this.dialogParameterStream = new Subject();

    let extent = this.map.getView().calculateExtent(this.map.getSize());

    this.patchLayerSource = new ol.source.TileWMS({
      url: environment.geoserver + '/wms',
      params: {
        LAYERS: 'paikkauskohde3857',
        TILED: true
      },
      projection: environment.projection,
      serverType: 'geoserver'
    });

    this.patchLayer = new ol.layer.Tile({
      extent: extent,
      source: this.patchLayerSource,
      visible: false,
      title: 'Paikkauskohde',
      type: 'base'
    });

    this.patchLayer.on('change:visible', () => {
      if (this.patchLayer.getVisible()) {
        this.map.addControl(this.addPatchControl);
      } else {
        this.map.removeControl(this.addPatchControl);
        this.disableAddPatch();
      }
    });

    this.mapClickObservable.subscribe((e) => {
      if (!this.patchLayer.getVisible()) {
        return;
      }

      if (this.addPatch) {
        let feature = new ol.Feature({
          geometry: new ol.geom.Point(e.coordinate)
        });
        this.dialogParameterStream.next(feature);
      } else {
        let resolution = this.map.getView().getResolution();
        let params = {
          INFO_FORMAT: 'application/json'
        };

        let url = this.patchLayerSource.getGetFeatureInfoUrl(
          e.coordinate,
          resolution,
          environment.projection,
          params
        );

        axios.get(url)
          .then((res) => {
            let format = new ol.format.GeoJSON();
            let features = format.readFeatures(res.data);
            if (features.length > 0) {
              this.dialogParameterStream.next(features[0]);
            }
          });
      }
    });

    this.map.addLayer(this.patchLayer);
  }

  getAddPatchControl() {
    const _this = this;

    let addPatchControlConfig = function(opt_options): void {
      let options = opt_options || {};

      let button = document.getElementById('add-patch');
      let element = document.getElementById('controls');
      button.addEventListener('click', () => {
        if (_this.addPatch) {
          _this.disableAddPatch.call(_this);
        } else {
          _this.enabledAddPatch.call(_this);
        }
      }, false);

      ol.control.Control.call(this, {
        element: element,
        target: options.target
      });
    };
    ol.inherits(addPatchControlConfig, ol.control.Control);

    return new addPatchControlConfig({target: 'map'});
  }

  enabledAddPatch() {
    this.addPatch = true;
    this.addPatchButton.classList.add('selected');
  }

  disableAddPatch() {
    this.addPatch = false;
    this.addPatchButton.classList.remove('selected');
  }
}
