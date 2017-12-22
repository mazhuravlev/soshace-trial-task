import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {RecordDto} from "../../dto/record.dto";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.scss']
})
export class EditRecordComponent implements OnInit, OnDestroy {
  private paramsSubscription: Subscription;

  public record: RecordDto;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private activatedRoute: ActivatedRoute) {
    this.paramsSubscription = activatedRoute.paramMap
      .flatMap(params => this.apiService.getRecord(params.get('id')))
      .subscribe(record => this.record = record);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.paramsSubscription) this.paramsSubscription.unsubscribe();
  }
}
