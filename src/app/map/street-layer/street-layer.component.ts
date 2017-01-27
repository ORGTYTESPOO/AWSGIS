import {Component, OnInit, Input} from '@angular/core';
import {Observable, Subject} from "rxjs";

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
    let streetLayerSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: 'http://geoserver-lb-1359047372.eu-west-1.elb.amazonaws.com/geoserver/espoo/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=espoo:katu&outputFormat=application/json',
      // url: 'http://localhost:8080/geoserver/espoo/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=espoo:katu&outputFormat=application/json',
      strategy: ol.loadingstrategy.all
    });

    this.streetLayer = new ol.layer.Vector({
      source: streetLayerSource,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 255, 1.0)',
          width: 2
        })
      })
    });

    this.map.addLayer(this.streetLayer);

    let selectInteraction = new ol.interaction.Select({
      condition: ol.events.condition.click,
      layers: [this.streetLayer],
      hitTolerance: 2
    });

    selectInteraction.on('select', (e) => {
      if (e.selected.length === 0) {
        return;
      }

      this.dialogParameterStream.next(e.selected[0]);
    });

    this.map.addInteraction(selectInteraction);

    this.dialogParameterStream = new Subject();
  }

}
