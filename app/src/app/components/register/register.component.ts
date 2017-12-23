import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";
import "rxjs/add/operator/mergeMap";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private form: FormGroup;
  private formSubscription: Subscription;
  private passwordMismatch: boolean;

  constructor(private formBuilder: FormBuilder,
              private apiService: ApiService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: '',
      surname: '',
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
    this.formSubscription = this.form.valueChanges.subscribe(values => {
      if (values.password && values.passwordConfirm && values.password !== values.passwordConfirm) {
        this.passwordMismatch = true;
      } else {
        this.passwordMismatch = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }

  public formValid() {
    return !this.passwordMismatch && this.form.valid;
  }

  public onSubmit({valid, value}) {
    this.apiService.createAccount(value).catch(e => {
      this.snackBar.open(e.error, null, {
        duration: 4000,
      });
      return Observable.never();
    }).flatMap(_ => this.apiService.login({username: value.username, password: value.password}))
      .catch(e => {
        this.snackBar.open('Log in failed: ' + e.error, null, {
          duration: 4000,
        });
        return Observable.never();
      })
      .subscribe(_ => this.router.navigateByUrl('/'));
  }
}
