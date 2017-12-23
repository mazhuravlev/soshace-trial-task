import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {RecordDto} from "../../dto/record.dto";
import {MatTableDataSource} from "@angular/material";
import * as moment from 'moment';
import * as _ from 'lodash';
import {ConverterService} from "../../services/converter.service";
import {ReportRecord} from "./report-record";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public displayedColumns = ['week', 'averageDistance', 'averageSpeed'];
  public dataSource = new MatTableDataSource();

  constructor(private apiService: ApiService, private converterService: ConverterService) {
  }

  ngOnInit() {
    this.apiService.getRecords()
      .map(records => this.makeReport(records))
      .subscribe(report => this.dataSource.data = report);
  }

  private makeReport(records: RecordDto[]): ReportRow[] {
    return Object.entries(_.groupBy(records.map(record => this.makeReportRecord(record)),
      record => record.week + '_' + record.year))
      .map(row => this.makeReportRow(row[1]))
      .sort((a, b) => {
        if(a.year === b.year) return a.week - b.week;
        return a.year - b.year;
      });
  }

  private calcAverageSpeed(records: RecordDto[]): number {
    return this.converterService.metersToKm(records.reduce((distanceAcc, r) => distanceAcc + r.distance, 0))
      / this.converterService.msToHours(records.reduce((durationAcc, r) => durationAcc + r.duration, 0));
  }

  private calcAverageDistance(records: RecordDto[]): number {
    return Math.round(_.mean(records.map(r => r.distance)));
  }

  private makeReportRow(records: ReportRecord[]): ReportRow {
    return {
      week: records[0].week,
      year: records[0].year,
      averageSpeed: this.calcAverageSpeed(records),
      averageDistance: this.calcAverageDistance(records)
    };
  }

  private makeReportRecord(record: RecordDto): ReportRecord {
    const mDate = moment(record.date);
    return {...record, week: mDate.week(), year: mDate.year()};
  }
}

interface ReportRow {
  week: number;
  year: number;
  averageSpeed: number;
  averageDistance: number;
}
