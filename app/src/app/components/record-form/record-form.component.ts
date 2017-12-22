import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RecordDto} from "../../dto/record.dto";
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss']
})
export class RecordFormComponent implements OnInit {
  @Input() record: RecordDto;
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router) {
   }

  ngOnInit() {
    this.form = this.formBuilder.group({
    _id: this.record._id,
    date: this.record.date,
    distance: this.record.distance,
    duration: this.record.duration
  });
  }

  public formValid() {
    return this.form.valid;
  }

  public onSubmit({valid, value}) {
    if(value._id) {
      this.apiService.updateRecord(value).subscribe(() => this.router.navigateByUrl('/dashboard/records'));
    } else {
      this.apiService.createRecord(value).subscribe(() => this.router.navigateByUrl('/dashboard/records'));
    }
  }
}
