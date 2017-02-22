import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from '../../../environments/environment';
import * as axios from 'axios';
import { LayerType } from '../layertype';

declare var ol: any;

@Component({
  selector: 'esp-patch-layer',
  template: '<esp-patch-layer-dialog [dialogParameterStream]="dialogParameterStream" [addPatch]="addPatch" [afterAdd]="disableAddPatch.bind(this)"></esp-patch-layer-dialog>'
})
export class PatchLayerComponent implements OnInit {

  @Input() map: ol.Map;
  @Input() mapClickObservable: Observable<ol.MapBrowserEvent>;
  dialogParameterStream: Subject<any>;
  patchLayerSource: ol.source.TileWMS;
  patchLayerUpdateSource: ol.source.TileWMS;
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
        LAYERS: 'paikkauskohde_deleted_false',
        TILED: true
      },
      projection: environment.projection,
      serverType: 'geoserver'
    });

    this.patchLayerUpdateSource = new ol.source.TileWMS({
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
      type: 'base',
      zIndex: 1
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
        const getBufferValue = () => {
          const MAX_ZOOM = 21;
          const MIN_ZOOM = 14;
          const zoomLevel = Math.floor(this.map.getView().getZoom());

          if (!zoomLevel || zoomLevel > MAX_ZOOM) {
            return 1;
          } else if (zoomLevel < MIN_ZOOM) {
            return 200;
          }

          // Fibonacci sequence seems to generate quite good buffer value :)
          const target = 21 - zoomLevel;
          let last = 1;
          let current = 1;

          for (let i = 0; i < target; i++) {
            let tmp = current;
            current = last + current;
            last = current;
          }

          return current;
        };

        const bufferValue = getBufferValue();
        const initialExtent = ol.extent.boundingExtent([e.coordinate]);
        const bufferedExtent = ol.extent.buffer(initialExtent, bufferValue);

        const options = {
          featureNS: 'espoo',
          featurePrefix: 'espoo',
          featureTypes: ['paikkauskohde3857'],
          srsName: environment.projection,
          outputFormat: 'application/json',
          bbox: bufferedExtent,
          geometryName: 'geom'
        };

        const format = new ol.format.WFS();
        const node = format.writeGetFeature(options);
        let serialized = new XMLSerializer().serializeToString(node);

        axios.post(
          environment.geoserver + '/ows?service=WFS',
          serialized,
          {
            headers: {
              'Content-Type': 'text/xml'
            }
          }
        ).then(res => {
            let format = new ol.format.GeoJSON();
            let features = format.readFeatures(res.data);
            if (features.length > 0) {
              const wgs84Radius = 6378137;
              const wgs84Sphere = new ol.Sphere(wgs84Radius);
              const clickCoord = ol.proj.transform(e.coordinate, environment.projection, 'EPSG:4326');

              // Find the feature closest to the click event
              const closestFeature = features.reduce((acc, current) => {
                const coordinates  = current.getGeometry().getCoordinates();
                const featureCoord = ol.proj.transform(coordinates, environment.projection, 'EPSG:4326');
                const distance = wgs84Sphere.haversineDistance(clickCoord, featureCoord);
                return (acc && acc.distance < distance)
                  ? acc
                  : { distance, feature: current }
              }, undefined);

              this.dialogParameterStream.next(closestFeature.feature);
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
