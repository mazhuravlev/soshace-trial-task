import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs/Observable";
import {RecordDto} from "../../dto/record.dto";
import {MatSnackBar, MatTableDataSource} from "@angular/material";
import * as moment from 'moment';
import {ConverterService} from "../../services/converter.service";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {
  public records;
  public displayedColumns = ['date', 'distance', 'duration', 'averageSpeed', 'edit', 'delete'];
  public dataSource = new MatTableDataSource();

  constructor(private apiService: ApiService,
              private snackBar: MatSnackBar,
              private converterService: ConverterService) {
    apiService.getRecords().subscribe(records => this.setData(records));
  }

  private setData(records: RecordDto[]) {
    this.records = records;
    this.dataSource.data = this.records;
  }

  ngOnInit() {
  }

  public getAverageSpeed(record: RecordDto) {
    return (this.converterService.metersToKm(record.distance) / this.converterService.msToHours(record.duration))
      .toFixed(2);
  }

  public deleteRecord(record: RecordDto) {
    const oldRecords = this.records.slice();
    this.setData(this.records.filter(x => x !== record));
    this.apiService.deleteRecord(record).catch(e => {
      this.setData(oldRecords);
      this.showErrorNotification('Failed to delete record');
      return Observable.never();
    }).subscribe();
  }

  private showErrorNotification(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
