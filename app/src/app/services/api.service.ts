import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
import {Router} from "@angular/router";
import * as _ from 'lodash';

@Injectable()
export class ApiService {
  private apiUrl: string;
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private _isLoggedIn = false;
  private isLoggedInSubject = new Subject<boolean>();
  private cachedRecords: RecordDto[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.checkLogin().subscribe(isLoggedIn => this.setIsLoggedIn(isLoggedIn));
  }

  private setIsLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    this.isLoggedInSubject.next(true);
  }

  public get isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn ? Observable.of(this._isLoggedIn) : this.checkLogin();
  }

  public checkLogin() {
    return this.http.get(this.apiUrl + '/check').map(_ => true).catch(e => Observable.of(false)).do(x => console.log('login check', x));
  }

  public login(user: UserDto): Observable<any> {
    return this.http.post(this.apiUrl + '/login', user).do(isLoggedIn => {
      this.setIsLoggedIn(true);
    })
      .catch(e => this.handleError(e));
  }

  public logout(): Observable<any> {
    return this.http.get(this.apiUrl + '/logout').do(() => this.isLoggedInSubject.next(false))
      .catch(e => this.handleError(e));
  }

  public getRecords(): Observable<RecordDto[]> {
    return this.http.get(this.apiUrl + '/records', {withCredentials: true})
      .catch(e => this.handleError(e))
      .map(x => x as RecordDto[])
      .do(records => this.cachedRecords = records)
      .startWith(this.cachedRecords);
  }

  public getRecord(id: string) {
    const response = this.http.get(`${this.apiUrl}/records/${id}`)
      .catch(e => this.handleError(e))
      .map(res => res as RecordDto);
    const record = _.find(this.cachedRecords, {_id: id});
    return record ? response.startWith(record) : response;
  }

  public createRecord(record: RecordDto): Observable<any> {
    return this.http.post(this.apiUrl + '/records', record, {headers: this.headers, withCredentials: true})
      .catch(e => this.handleError(e))
      .do(_ => this.cachedRecords.push(record));
  }

  public updateRecord(record: RecordDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/records/${record._id}`, record, {
      headers: this.headers,
      withCredentials: true
    })
      .catch(e => this.handleError(e));
  }

  public deleteRecord(record: RecordDto): Observable<any> {
    return this.http.delete(`${this.apiUrl}/records/${record._id}`, {headers: this.headers, withCredentials: true})
      .catch(e => this.handleError(e))
      .do(_ => this.cachedRecords.splice(this.cachedRecords.indexOf(record)))
  }

  public createAccount(user: UserDto) {
    return this.http.post(this.apiUrl + 'register', user, {headers: this.headers})
      .catch(e => this.handleError(e));
  }

  private handleError(e): Observable<any> {
    if (e.status === 401) {
      this.router.navigateByUrl('/register');
      return Observable.never();
    }
    return Observable.throw(e);
  }
}
