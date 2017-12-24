import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecordFormComponent} from './record-form.component';
import {ApiService} from "../../services/api.service";
import {TestApiService} from "../../test/test-api.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {ConverterService} from "../../services/converter.service";
import {TextMaskModule} from "angular2-text-mask";
import {MaterialModule} from "../../modules/material.module";
import {Router} from "@angular/router";
import {TestRouter} from "../../test/test-router";
import {TestRecord} from "../../test/test-record";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('RecordFormComponent', () => {
  let component: RecordFormComponent;
  let fixture: ComponentFixture<RecordFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextMaskModule, MaterialModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [RecordFormComponent],
      providers: [
        {provide: ApiService, useClass: TestApiService},
        {provide: FormBuilder, useClass:FormBuilder},
        {provide: ConverterService, useClass: ConverterService},
        {provide: Router, useClass: TestRouter},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordFormComponent);
    component = fixture.componentInstance;
    component.record = TestRecord.get();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
