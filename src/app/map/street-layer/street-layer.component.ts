import {Component, OnInit, Input} from '@angular/core';
import { Observable, Subject } from "rxjs";
import { environment } from '../../../environments/environment';
import * as axios from 'axios';
import { LayerType } from '../layertype';

declare var ol: any;

@Component({
  selector: 'esp-street-layer',
  template: '<esp-street-layer-dialog [streetLayer]="streetLayer" [dialogParameterStream]="dialogParameterStream"></esp-street-layer-dialog>'
})
export class StreetLayerComponent implements OnInit {

  @Input() map: any;
  @Input() mapClickObservable: Observable<ol.MapBrowserEvent>;
  streetLayer: any;
  dialogParameterStream: Subject<any>;
  streetConditionSource: ol.source.TileWMS;
  streetMaintenanceSource: ol.source.TileWMS;
  streetSource: ol.source.TileWMS;
  streetConditionLayer: ol.layer.Tile;
  streetMaintenanceLayer: ol.layer.Tile;

  constructor() { }

  ngOnInit() {
    this.dialogParameterStream = new Subject();

    let extent = this.map.getView().calculateExtent(this.map.getSize());

    this.streetConditionSource = this.createWMSSource('kunto');
    this.streetMaintenanceSource = this.createWMSSource('kunnossapito');
    this.streetSource = this.createWMSSource('katu');

    this.streetConditionLayer = this.createWMSLayer(
      'Kunto',
      this.streetConditionSource,
      extent,
      true
    );

    this.streetMaintenanceLayer = this.createWMSLayer(
      'Kunnossapito',
      this.streetMaintenanceSource,
      extent,
      false
    );

    this.mapClickObservable.subscribe((e) => {
      const isVisible = this.streetConditionLayer.getVisible()
        || this.streetMaintenanceLayer.getVisible();

      if (!isVisible) {
        return;
      }

      let resolution = this.map.getView().getResolution();
      let params = {
        INFO_FORMAT: 'application/json'
      };

      let url = this.streetSource.getGetFeatureInfoUrl(
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
    });

    this.map.addLayer(this.streetConditionLayer);
    this.map.addLayer(this.streetMaintenanceLayer);
  }

  createWMSSource(layername: string) {
    return new ol.source.TileWMS({
      url: environment.geoserver + '/wms',
      params: {
        'LAYERS': layername,
        'TILED': true
      },
      serverType: 'geoserver'
    });
  }

  createWMSLayer(title: string, source: any, extent: any, visible: boolean) {
    return new ol.layer.Tile({
      extent: extent,
      source: source,
      title: title,
      visible: visible,
      type: 'base'
    });
  }

}
