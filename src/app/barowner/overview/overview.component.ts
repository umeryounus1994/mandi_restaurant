import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  userBars;
  userId;
  noBars = false;
  accountType;
  assignedBar;
  assignedBy;
  packageId="";
  packageDetails;
  day1;
  day2;
  month1;
  month2;
  fname;
  loadingText=""
  showPayment = false

  constructor(public auth: AuthService, private api: ApiService, private spinner: NgxSpinnerService, private router : Router) {
    this.userId = JSON.parse(localStorage.getItem('data')).uid;
  }

  ngOnInit() {
  }

  bar(barId,barName)
  { 
    if(this.packageId === "8n3g") {
      this.auth.saveLocalData(barId,barName);
      this.router.navigate(['/bar']);
    } 
    if(this.packageId === "sk2b") {
      this.auth.saveLocalData(barId,barName);
      this.router.navigate(['/bar/einstellungen']);
    }
    if(this.packageId === "gm8m") {
      this.auth.saveLocalData(barId,barName);
      this.router.navigate(['/bar/karten']);
    }
  }

}
