import {Component, OnInit, Input} from '@angular/core';
import {Subject} from "rxjs";
import { environment } from '../../../environments/environment';
import * as axios from 'axios';

declare var ol: any;

@Component({
  selector: 'esp-street-layer',
  template: '<esp-street-layer-dialog [streetLayer]="streetLayer" [dialogParameterStream]="dialogParameterStream"></esp-street-layer-dialog>'
})
export class StreetLayerComponent implements OnInit {

  @Input() map: any;
  streetLayer: any;
  dialogParameterStream: Subject<any>;
  @Input() layerSelectionActionStream: Subject<string>;
  wmsSource: ol.source.TileWMS;
  updateSource: ol.source.TileWMS;

  constructor() { }

  ngOnInit() {

    this.dialogParameterStream = new Subject();

    this.layerSelectionActionStream.subscribe( (mapTheme: string) => {
      let sourceParams = this.wmsSource.getParams();
      if(sourceParams['LAYERS'] !== mapTheme) {
        sourceParams['LAYERS'] = mapTheme;
        this.wmsSource.updateParams(sourceParams);
        this.wmsSource.refresh();
      }
    });

    let extent = this.map.getView().calculateExtent(this.map.getSize());
    this.wmsSource = new ol.source.TileWMS({
      url: environment.geoserver + '/wms',
      params: {
        'LAYERS': 'kunto',
        'TILED': true
      },
      serverType: 'geoserver'
    });

    let wmsLayer = new ol.layer.Tile({
      extent: extent,
      source: this.wmsSource
    });

    this.updateSource = new ol.source.TileWMS({
      url: environment.geoserver + '/wms',
      params: {
        'LAYERS': 'katu',
        'TILED': true
      },
      serverType: 'geoserver'
    });

    this.map.on('click', (e) => {
      let resolution = this.map.getView().getResolution();
      let projection = 'EPSG:3857';
      let params = {
        INFO_FORMAT: 'application/json'
      };

      let url = this.updateSource.getGetFeatureInfoUrl(
        e.coordinate,
        resolution,
        projection,
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

    this.map.addLayer(wmsLayer);


  }

}
