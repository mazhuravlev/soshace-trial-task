import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private form: FormGroup;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.form = formBuilder.group({
      name: '',
      surname: '',
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  public formValid() {
    return this.form.valid && (this.form.get('password').value === this.form.get('passwordConfirm').value);
  }

  public onSubmit({valid, value}) {
    this.apiService.createAccount(value).subscribe();
  }
}
