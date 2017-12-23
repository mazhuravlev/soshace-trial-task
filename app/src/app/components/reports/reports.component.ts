import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {RecordDto} from "../../dto/record.dto";
import {MatTableDataSource} from "@angular/material";
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public displayedColumns = ['week', 'averageDistance', 'averageSpeed'];
  public dataSource = new MatTableDataSource();

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getRecords()
      .map(records => this.makeReport(records))
      .subscribe(report => this.dataSource.data = report);
  }

  private makeReport(records: RecordDto[]): ReportRow[] {
    return Object.entries(_.groupBy(records, record => moment(record.date).week()))
      .map(row => this.makeReportRow(row))
      .sort((a,b) => a.week - b.week);
  }

  private calcAverageSpeed(records: RecordDto[]): number {
    return this.metersToKm(records.reduce((distanceAcc, r) => distanceAcc + r.distance, 0)) / this.secondsToHours(records.reduce((durationAcc, r) => durationAcc + r.duration, 0));
  }

  private secondsToHours(seconds: number) {
    return seconds / 3600;
  }

  private metersToKm(meters: number): number {
    return meters / 1000;
  }

  private calcAverageDistance(records: RecordDto[]): number {
    return Math.round(_.mean(records.map(r => r.distance)));
  }

  private makeReportRow([week, records]: [string, RecordDto[]]): ReportRow {
    return {
      week: Number(week),
      averageSpeed: this.calcAverageSpeed(records),
      averageDistance: this.calcAverageDistance(records)
    };
  }
}

interface ReportRow {
  week: number;
  averageSpeed: number;
  averageDistance: number;
}
