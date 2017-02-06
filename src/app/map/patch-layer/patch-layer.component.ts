import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

declare var ol: any;

@Component({
  selector: 'esp-patch-layer',
  template: '<esp-patch-layer-dialog></esp-patch-layer-dialog>'
})
export class PatchLayerComponent implements OnInit {

  @Input() map: ol.Map;
  patchLayerSource: ol.source.TileWMS;
  patchLayer: ol.layer.Tile;

  constructor() { }

  ngOnInit() {
    let extent = this.map.getView().calculateExtent(this.map.getSize());

    this.patchLayerSource = new ol.source.TileWMS({
      url: environment.geoserver + '/wms',
      params: {
        LAYERS: 'paikkauskohde',
        TILED: true
      },
      projection: environment.projection,
      serverType: 'geoserver'
    });

    this.patchLayer = new ol.layer.Tile({
      extent: extent,
      source: this.patchLayerSource,
      visible: true,
      title: 'Paikkauskohde'
    });

    this.map.addLayer(this.patchLayer);
  }

}
