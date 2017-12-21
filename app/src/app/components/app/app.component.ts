import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private loginForm: FormGroup;

  public isLoggedIn: boolean;
  private loginSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loginSubscription = this.apiService.loginObservable.subscribe(x => this.isLoggedIn = x);
  }

  ngOnDestroy() {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  public onLoginFormSubmit({valid, value}) {
    this.apiService.login(value).subscribe();
  }
}
