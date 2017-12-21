import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.logout().subscribe(() => this.router.navigateByUrl('/'));
  }

}
