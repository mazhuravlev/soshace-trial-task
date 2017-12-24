import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from "../components/register/register.component";
import {LogoutComponent} from "../components/logout/logout.component";
import {DashboardComponent} from "../components/dashboard/dashboard.component";
import {RecordsComponent} from "../components/records/records.component";
import {ReportsComponent} from "../components/reports/reports.component";
import {IndexComponent} from "../components/index/index.component";
import {LoggedInGuard} from "../guards/logged-in.guard";
import {EditRecordComponent} from "../components/edit-record/edit-record.component";
import {AddRecordComponent} from "../components/add-record/add-record.component";

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        redirectTo: 'records',
        pathMatch: 'full'
      },
      {
        path: 'records',
        component: RecordsComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      }
    ]
  },
  {
    path: 'add-record',
    canActivate: [LoggedInGuard],
    component: AddRecordComponent
  },
  {
    path: 'edit-record/:id',
    canActivate: [LoggedInGuard],
    component: EditRecordComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
