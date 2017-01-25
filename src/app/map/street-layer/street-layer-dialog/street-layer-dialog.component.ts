import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'esp-street-layer-dialog',
  templateUrl: './street-layer-dialog.component.html'
})
export class StreetLayerDialogComponent implements OnInit {

  @ViewChild('streetConditionDialog') streetConditionDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  @Input() streetLayer: any;
  parameters: any;

  conditionOptions = [
    {value: 1, label: 'Erittäin huono'},
    {value: 2, label: 'Huono'},
    {value: 3, label: 'Tyydyttävä'},
    {value: 4, label: 'Hyvä'},
    {value: 5, label: 'Erinomainen'},
  ];

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.dialogParameterStream.subscribe( (parameters: any) => {
      this.parameters = parameters;
      Observable.fromPromise(this.modalService.open(this.streetConditionDialog, parameters).result).subscribe( (e: any) => {
      }, () => {});
    })
  }

  save(): void {
    this.streetLayer.save();
  }

}
