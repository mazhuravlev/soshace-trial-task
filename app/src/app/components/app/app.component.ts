import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {animate, keyframes, query, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('loginAnimation', [
      transition('* => *', [
        query(':enter',
          animate('.5s ease-in', keyframes([
            style({opacity: 0, offset: 0}),
            style({opacity: 1, offset: 1.0}),
          ])), {optional: true})
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoggedIn = false;
  public loginChecked = false;

  private loginForm: FormGroup;
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
      this.loginChecked = true;
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
