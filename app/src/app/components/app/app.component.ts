import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private loginForm: FormGroup;

  public isLoggedIn: boolean;
  private loginSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginSubscription = this.apiService.isLoggedIn.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy() {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  public onLoginFormSubmit({valid, value}) {
    this.apiService.login(value).subscribe(_ => this.router.navigateByUrl('/dashboard'));
  }
}
