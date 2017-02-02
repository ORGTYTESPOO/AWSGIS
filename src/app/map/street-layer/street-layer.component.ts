import {Component, OnInit, Input} from '@angular/core';
import {Subject} from "rxjs";
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
  @Input() mapThemeActionStream: Subject<string>;
  wmsSource: ol.source.TileWMS;

  constructor() { }

  ngOnInit() {

    this.dialogParameterStream = new Subject();

    this.mapThemeActionStream.subscribe( (mapTheme: string) => {
      let sourceParams = this.wmsSource.getParams();
      if(sourceParams['STYLES'] !== mapTheme) {
        sourceParams['STYLES'] = mapTheme;
        this.wmsSource.updateParams(sourceParams);
      }
    });

    let extent = this.map.getView().calculateExtent(this.map.getSize());
    this.wmsSource = new ol.source.TileWMS({
      // url: 'http://localhost:8080/geoserver/espoo/wms',
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/wms',
      params: {
        'LAYERS': 'espoo:katu',
        'TILED': true,
      },
      serverType: 'geoserver'
    });

    let wmsLayer = new ol.layer.Tile({
      extent: extent,
      source: this.wmsSource
    });

    this.map.on('click', (e) => {
      let resolution = this.map.getView().getResolution();
      let projection = 'EPSG:3857';
      let params = {
        INFO_FORMAT: 'application/json'
      };

      let url = this.wmsSource.getGetFeatureInfoUrl(
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
