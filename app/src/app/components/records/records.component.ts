import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Observable} from "rxjs/Observable";
import {RecordDto} from "../../dto/record.dto";
import {MatSnackBar, MatTableDataSource} from "@angular/material";
import {ConverterService} from "../../services/converter.service";
import {animate, keyframes, query, stagger, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':leave', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 1, transform: 'translateX(0)', offset: 0}),
            style({opacity: 0, transform: 'translateX(-50px)', offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ]
})
export class RecordsComponent implements OnInit {
  public displayedColumns = ['date', 'distance', 'duration', 'averageSpeed', 'edit', 'delete'];
  public dataSource = new MatTableDataSource();

  private records;

  constructor(private apiService: ApiService,
              private snackBar: MatSnackBar,
              private converterService: ConverterService) {
  }

  private setData(records: RecordDto[]) {
    this.dataSource.data = this.records = records;
  }

  ngOnInit() {
    this.apiService.getRecords().subscribe(records => this.setData(records));
  }

  public getAverageSpeed(record: RecordDto) {
    return (this.converterService.metersToKm(record.distance) / this.converterService.msToHours(record.duration))
      .toFixed(2);
  }

  public deleteRecord(record: RecordDto) {
    const oldRecords = this.dataSource.data.slice() as RecordDto[];
    this.setData(this.dataSource.data.filter(x => x !== record) as RecordDto[]);
    this.apiService.deleteRecord(record).catch(e => {
      this.setData(oldRecords);
      this.showErrorNotification('Failed to delete record');
      return Observable.never();
    }).subscribe();
  }

  public sortData(e) {
    if (e.direction === 'asc') {
      this.dataSource.data = this.records.slice().sort((a: RecordDto, b: RecordDto) => {
        return new Date(a.date as string).getTime() - new Date(b.date as string).getTime();
      });
    } else if (e.direction === 'desc') {
      this.dataSource.data = this.records.slice().sort((a: RecordDto, b: RecordDto) => {
        return new Date(b.date as string).getTime() - new Date(a.date as string).getTime();
      });
    } else {
      this.dataSource.data = this.records;
    }
  }

  private showErrorNotification(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
