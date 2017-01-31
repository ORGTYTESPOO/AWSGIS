import {Component, OnInit, Input} from '@angular/core';
import {Observable, Subject} from "rxjs";
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

  constructor() { }

  ngOnInit() {
    let extent = this.map.getView().calculateExtent(this.map.getSize());
    let wmsSource = new ol.source.TileWMS({
      // url: 'http://localhost:8080/geoserver/espoo/wms',
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/wms',
      params: {
        'LAYERS': 'espoo:katu',
        'TILED': true
      },
      serverType: 'geoserver'
    });

    let wmsLayer = new ol.layer.Tile({
      extent: extent,
      source: wmsSource
    });

    this.map.on('click', (e) => {
      let resolution = this.map.getView().getResolution();
      let projection = 'EPSG:3857';
      let params = {
        INFO_FORMAT: 'application/json'
      };

      let url = wmsSource.getGetFeatureInfoUrl(
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

    this.dialogParameterStream = new Subject();
  }

}
