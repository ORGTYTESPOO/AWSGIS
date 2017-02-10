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
  @Input() addPatch: boolean;
  @Input() activeLayer: LayerType;
  dialogParameterStream: Subject<any>;
  patchLayerSource: ol.source.TileWMS;
  patchLayer: ol.layer.Tile;

  constructor() { }

  ngOnInit() {
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
      visible: true,
      title: 'Paikkauskohde',
      type: 'base'
    });

    this.mapClickObservable.subscribe((e) => {
      console.log(e.coordinate);
      if (this.activeLayer === LayerType.Patch && this.addPatch) {
        let feature = new ol.Feature({
          geometry: new ol.geom.Point(e.coordinate)
        });
        this.dialogParameterStream.next(feature);
      } else if (this.activeLayer === LayerType.Patch) {
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

}
