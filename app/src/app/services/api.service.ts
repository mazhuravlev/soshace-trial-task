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

@Injectable()
export class ApiService {
  private apiUrl: string;
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private isLoggedIn = false;
  private isLoggedInSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  get loginObservable(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable().startWith(this.isLoggedIn);
  }

  public login(user: UserDto): Observable<any> {
    return this.http.post(this.apiUrl + '/login', user).do(() => this.isLoggedInSubject.next(true));
  }

  public logout(): Observable<any> {
    return this.http.get(this.apiUrl + '/logout').do(() => this.isLoggedInSubject.next(false));
  }

  public getRecords(): Observable<RecordDto[]> {
    return this.http.get(this.apiUrl + '/records', {withCredentials: true}).map(x => x as RecordDto[]);
  }

  public createRecord(record: RecordDto): Observable<any> {
    return this.http.post(this.apiUrl + '/records', record, {headers: this.headers, withCredentials: true});
  }

  public updateRecord(record: RecordDto): Observable<any> {
    return this.http.put(this.apiUrl + '/records/' + record._id, record,{headers: this.headers, withCredentials: true});
  }

  public deleteRecord(record: RecordDto): Observable<any> {
    return this.http.delete(this.apiUrl + '/records/' + record._id, {headers: this.headers, withCredentials: true});
  }

  public createAccount(user: UserDto) {
    return this.http.post(this.apiUrl + 'register', user,{headers: this.headers});
  }
}
