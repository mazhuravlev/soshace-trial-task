import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RecordDto} from "../../dto/record.dto";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {ConverterService} from "../../services/converter.service";

@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss']
})
export class RecordFormComponent implements OnInit {
  @Input() record: RecordDto;
  public form: FormGroup;

  public mask = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
  public placeholderChar = '_';

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private converterService: ConverterService,
              private router: Router) {
  }

  ngOnInit() {
    const durationRegex = new RegExp(this.mask.join('').replace(/\//g, ''));
    this.form = this.formBuilder.group({
      _id: this.record._id,
      date: this.record.date,
      distance: this.record.distance,
      duration: [
        this.converterService.durationToString(this.record.duration),
        Validators.pattern(durationRegex)
      ]
    });
  }

  public formValid() {
    return this.form.valid;
  }

  public onSubmit({valid, value}) {
    const record = {...value, duration: this.converterService.stringToDuration(value.duration)};
    if (record._id) {
      this.apiService.updateRecord(record).subscribe(() => this.router.navigateByUrl('/dashboard/records'));
    } else {
      this.apiService.createRecord(record).subscribe(() => this.router.navigateByUrl('/dashboard/records'));
    }
  }
}
