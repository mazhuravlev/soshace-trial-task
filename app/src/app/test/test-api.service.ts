import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {RecordDto} from "../dto/record.dto";
import {UserDto} from "../dto/user.dto";
import "rxjs/add/operator/map";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/do";
import "rxjs/add/observable/of";
import "rxjs/add/observable/never";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/catch";
import * as _ from 'lodash';
import "rxjs/add/observable/concat";
import "rxjs/add/operator/first";
import {LoginDto} from "../dto/login.dto";

@Injectable()
export class TestApiService {
  private _isLoggedIn = false;
  private isLoggedInSubject = new Subject<boolean>();

  constructor() {
  }

  private setIsLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    this.isLoggedInSubject.next(value);
  }

  public get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable().startWith(this._isLoggedIn);
  }

  public checkLogin() {
    return Observable.of(this._isLoggedIn);
  }

  public login(user: LoginDto): Observable<any> {
    this.setIsLoggedIn(true);
    return Observable.of(null);
  }

  public logout(): Observable<any> {
    this.setIsLoggedIn(false);
    return Observable.of(null);
  }

  public getRecords(): Observable<RecordDto[]> {
    return Observable.of(RECORDS);
  }

  public getRecord(id: string) {
    return Observable.of(_.find(RECORDS, {_id: id}));
  }

  public createRecord(record: RecordDto): Observable<any> {
    RECORDS.push(record);
    return Observable.of(null);
  }

  public updateRecord(record: RecordDto): Observable<any> {
    return Observable.of(null);
  }

  public deleteRecord(record: RecordDto): Observable<any> {
    return Observable.of(null);
  }

  public createAccount(user: UserDto) {
    return Observable.of(null);
  }
}

const ACCOUNTS = [{username: 'test', password: 'test'}];

const RECORDS: RecordDto[] = [{
  _id: "5a3e66d665bdd91404718c74",
  date: "2017-12-23T14:23:12.588Z",
  distance: 123,
  duration: 8888,
}, {
  _id: "5a3f8e15d05a042e50d2c1a0",
  date: "2017-12-23T14:23:12.588Z",
  distance: 123,
  duration: 45133000,
}, {
  _id: "5a3f8ee927ea451e64edd34b",
  date: "2017-12-23T14:23:12.588Z",
  distance: 123,
  duration: 45133000,
}];
