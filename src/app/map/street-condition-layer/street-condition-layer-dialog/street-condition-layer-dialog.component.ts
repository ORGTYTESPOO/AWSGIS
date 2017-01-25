import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'esp-street-condition-layer-dialog',
  templateUrl: './street-condition-layer-dialog.component.html'
})
export class StreetConditionLayerDialogComponent implements OnInit {

  @ViewChild('streetConditionDialog') streetConditionDialog:ElementRef;
  @Input() dialogParameterStream: Subject<any>;
  editable: boolean = false;
  parameters: any;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.dialogParameterStream.subscribe( (parameters: any) => {
      this.parameters = parameters;
      Observable.fromPromise(this.modalService.open(this.streetConditionDialog, parameters).result).subscribe( (e: any) => {
      }, () => {});
    })
  }

  edit(): void {
    this.editable = true;
  }

  save(): void {
    this.editable = false;
  }
}
