import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.apiService.isLoggedIn.first()
      .subscribe(isLoggedIn => this.router.navigateByUrl(isLoggedIn ? '/dashboard' : '/register'));
  }
}
