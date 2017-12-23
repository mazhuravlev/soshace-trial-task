import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {ApiService} from "./services/api.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './components/register/register.component';
import {MaterialModule} from "./modules/material.module";
import {RoutingModule} from "./modules/routing.module";
import { LogoutComponent } from './components/logout/logout.component';
import {HttpClientModule} from "@angular/common/http";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecordsComponent } from './components/records/records.component';
import { ReportsComponent } from './components/reports/reports.component';
import { IndexComponent } from './components/index/index.component';
import {LoggedInGuard} from "./guards/logged-in.guard";
import { EditRecordComponent } from './components/edit-record/edit-record.component';
import { AddRecordComponent } from './components/add-record/add-record.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { DurationPipe } from './pipes/duration.pipe';
import {ConverterService} from "./services/converter.service";
import {TextMaskModule} from "angular2-text-mask";


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LogoutComponent,
    DashboardComponent,
    RecordsComponent,
    ReportsComponent,
    IndexComponent,
    EditRecordComponent,
    AddRecordComponent,
    RecordFormComponent,
    DurationPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    RoutingModule,
    HttpClientModule,
    TextMaskModule
  ],
  providers: [ApiService, LoggedInGuard, ConverterService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
