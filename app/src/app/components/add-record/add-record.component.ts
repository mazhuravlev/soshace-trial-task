import { Component, OnInit } from '@angular/core';
import {RecordDto} from "../../dto/record.dto";

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.scss']
})
export class AddRecordComponent implements OnInit {
  public record: RecordDto;

  constructor() {
  }

  ngOnInit() {
    this.record = {
      date: new Date(),
      duration: null,
      distance: null
    };
  }
}
